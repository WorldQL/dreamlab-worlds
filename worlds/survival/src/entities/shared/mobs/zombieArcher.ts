import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { createSpawnableEntity } from '@dreamlab.gg/core'
import { z } from '@dreamlab.gg/core/dist/sdk'
import { SpriteSourceSchema } from '@dreamlab.gg/core/dist/textures'
import type { Camera } from '@dreamlab.gg/core/entities'
import { isNetPlayer } from '@dreamlab.gg/core/entities'
import type { EventHandler } from '@dreamlab.gg/core/events'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import {
  onlyNetClient,
  onlyNetServer,
  syncedValue,
} from '@dreamlab.gg/core/network'
import type {
  MessageListenerServer,
  NetClient,
  NetServer,
  SyncedValue,
} from '@dreamlab.gg/core/network'
import {
  deferUntilPhysicsStep,
  drawBox,
  drawCircle,
} from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import type { Resource, Texture } from 'pixi.js'
import { AnimatedSprite, Container, Graphics } from 'pixi.js'
import { getPreloadedAssets } from '../../../AssetLoader'
import { events } from '../../../events'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  maxHealth: z.number().positive().min(1),
  speed: z.number().positive().min(1),
  knockback: z.number().positive().min(0),
  spriteSource: SpriteSourceSchema.optional(),
})

type OnPlayerAttack = EventHandler<'onPlayerAttack'>
type OnCollisionStart = EventHandler<'onCollisionStart'>
type OnPlayerCollisionStart = EventHandler<'onPlayerCollisionStart'>
type zombieAnimations = 'hitting' | 'recoil' | 'walk'

interface MobData {
  health: number
  direction: number
  hitCooldownCounter: number
  currentPatrolDistance: number
  currentAnimation: zombieAnimations
  projectileCooldownCounter: number
}

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onHitServer: MessageListenerServer
  netServer: NetServer | undefined
  netClient: NetClient | undefined
  onPlayerAttack: OnPlayerAttack
  onCollisionStart: OnCollisionStart
  onPlayerCollisionStart: OnPlayerCollisionStart

  mobData: SyncedValue<MobData>
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  gfxHittest: Graphics
  ctrHealth: Container
  gfxHealthAmount: Graphics
  sprite: AnimatedSprite
}

export const createArcherMob = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(
  ArgsSchema,
  (
    { uid, tags, transform },
    { width, height, maxHealth, speed, knockback },
  ) => {
    const HIT_CHANNEL = '@dreamlab/Hittable/hit'
    const { position, zIndex } = transform

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
      {
        label: 'zombie',
      },
    )

    const patrolDistance = 300
    const projectileCooldown = 2 * 60 // 2 seconds
    const hitRadius = width / 2 + 120
    const hitCooldown = 1 // Second(s)
    const healthIndicatorWidth = width + 50
    const healthIndicatorHeight = 20

    const zombieAnimations: Record<string, Texture<Resource>[]> = {}
    let applyKnockback: [Matter.Body, number] | undefined

    return {
      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      rectangleBounds() {
        return { width, height }
      },

      isPointInside(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)

        const netServer = onlyNetServer(game)
        const netClient = onlyNetClient(game)

        const mobData = syncedValue(game, uid, 'mobData', {
          health: maxHealth,
          direction: 1,
          hitCooldownCounter: 0,
          currentPatrolDistance: 0,
          currentAnimation: 'walk' as zombieAnimations,
          projectileCooldownCounter: 0,
        })

        const onPlayerAttack: OnPlayerAttack = (player, item) => {
          if (
            mobData.value.hitCooldownCounter <= 0 &&
            item?.animationName !== 'bow' &&
            item?.animationName !== 'shoot'
          ) {
            const xDiff = player.body.position.x - body.position.x

            if (Math.abs(xDiff) <= hitRadius) {
              void netClient?.sendCustomMessage(HIT_CHANNEL, { uid })

              if (mobData.value.health - 1 <= 0) {
                events.emit('onPlayerScore', maxHealth * 25)
              }
            }
          }
        }

        const onCollisionStart: OnCollisionStart = ([a, b]) => {
          if (a.uid === uid || b.uid === uid) {
            const other = a.uid === uid ? b : a

            if (other.tags.includes('Projectile')) {
              void netClient?.sendCustomMessage(HIT_CHANNEL, { uid })

              if (mobData.value.health - 1 <= 0) {
                events.emit('onPlayerScore', maxHealth * 25)
              }
            }
          }
        }

        const onPlayerCollisionStart: OnPlayerCollisionStart = (
          [player, bodyCollided],
          _raw,
        ) => {
          if (body && bodyCollided === body) {
            events.emit('onPlayerDamage', 1)
            const force = 4 * -player.facingDirection
            deferUntilPhysicsStep(game, () => {
              Matter.Body.applyForce(player.body, player.body.position, {
                x: force,
                y: -1,
              })
            })
          }
        }

        game.events.common.addListener('onPlayerAttack', onPlayerAttack)
        game.events.common.addListener('onCollisionStart', onCollisionStart)
        game.events.client?.addListener(
          'onPlayerCollisionStart',
          onPlayerCollisionStart,
        )

        const onHitServer: MessageListenerServer = async (
          { peerID },
          _,
          data,
        ) => {
          const network = netServer
          if (!network) throw new Error('missing network')

          if (!('uid' in data)) return
          if (typeof data.uid !== 'string') return
          if (data.uid !== uid) return

          const player = game.entities
            .filter(isNetPlayer)
            .find(netplayer => netplayer.peerID === peerID)

          if (!player) throw new Error('missing netplayer')

          mobData.value.hitCooldownCounter = hitCooldown * 60
          mobData.value.currentAnimation = 'recoil'
          const force = knockback * mobData.value.direction
          Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

          mobData.value.health -= 1
          if (mobData.value.health <= 0) {
            await game.destroy(this as SpawnableEntity)
          } else {
            void network.broadcastCustomMessage(HIT_CHANNEL, {
              uid,
              health: mobData.value.health,
            })
          }
        }

        netServer?.addCustomMessageListener(HIT_CHANNEL, onHitServer)

        return {
          game,
          body,
          onHitServer,
          netServer,
          netClient,
          onPlayerAttack,
          onCollisionStart,
          onPlayerCollisionStart,

          mobData,
        }
      },

      initRenderContext: async (_, { camera, stage }) => {
        const assets = getPreloadedAssets()
        zombieAnimations.walk = assets.walkTextures
        zombieAnimations.recoil = assets.recoilTextures
        const sprite = new AnimatedSprite(zombieAnimations.walk!)
        sprite.gotoAndPlay(0)
        sprite.anchor.set(0.45, 0.535)

        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex

        const gfxBounds = new Graphics()
        const gfxHittest = new Graphics()

        const ctrHealth = new Container()
        ctrHealth.sortableChildren = true

        gfxHittest.zIndex = -1
        ctrHealth.zIndex = 1
        ctrHealth.position.y = -height / 2 - 30

        drawBox(gfxBounds, { width, height }, { stroke: '#00f' })
        drawCircle(
          gfxHittest,
          { radius: hitRadius },
          { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
        )

        const gfxHealthBorder = new Graphics()
        const gfxHealthAmount = new Graphics()

        drawBox(
          gfxHealthBorder,
          { width: healthIndicatorWidth, height: healthIndicatorHeight },
          {
            fill: 'white',
            stroke: 'black',
            fillAlpha: 1,
            strokeAlign: 1,
            strokeWidth: 4,
          },
        )

        ctrHealth.addChild(gfxHealthBorder)
        ctrHealth.addChild(gfxHealthAmount)

        container.addChild(gfxBounds)
        container.addChild(gfxHittest)
        container.addChild(ctrHealth)
        stage.addChild(container)
        stage.addChild(sprite)

        return {
          camera,
          container,
          gfxBounds,
          gfxHittest,
          ctrHealth,
          gfxHealthAmount,
          sprite,
        }
      },

      teardown({
        game,
        onHitServer,
        netServer,
        onPlayerAttack,
        onCollisionStart,
        onPlayerCollisionStart,
      }) {
        game.physics.unregister(this, body)
        game.events.common.removeListener('onPlayerAttack', onPlayerAttack)
        game.events.common.removeListener('onCollisionStart', onCollisionStart)
        game.events.client?.removeListener(
          'onPlayerCollisionStart',
          onPlayerCollisionStart,
        )

        netServer?.removeCustomMessageListener(HIT_CHANNEL, onHitServer)
      },

      teardownRenderContext({ container, ctrHealth }) {
        container.destroy({ children: true })
        ctrHealth.destroy({ children: true })
      },

      async onPhysicsStep(_, { game, mobData }) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        if (mobData.value.hitCooldownCounter > 0) {
          mobData.value.hitCooldownCounter -= 1
        }

        if (applyKnockback) {
          const [knockbackBody, force] = applyKnockback
          Matter.Body.applyForce(knockbackBody, knockbackBody.position, {
            x: force,
            y: -1,
          })
          applyKnockback = undefined
        }

        const allBodies = Matter.Composite.allBodies(game.physics.engine.world)
        let closestPlayer: Matter.Body | null = null
        let minDistance = Number.POSITIVE_INFINITY

        for (const player of allBodies) {
          if (player.label === 'player') {
            const dx = player.position.x - body.position.x
            const dy = player.position.y - body.position.y
            const distance = Math.hypot(dx, dy)

            if (distance < minDistance) {
              minDistance = distance
              closestPlayer = player
            }
          }
        }

        if (closestPlayer && minDistance < 2_000) {
          const dx = closestPlayer.position.x - body.position.x
          const dy = closestPlayer.position.y - body.position.y

          const distance = Math.hypot(dx, dy)
          const unitX = dx / distance
          const unitY = dy / distance

          Matter.Body.translate(body, {
            x: speed * unitX,
            y: speed * unitY,
          })
        } else {
          // patrol back and fourth when player is far from entity
          if (mobData.value.currentPatrolDistance >= patrolDistance) {
            mobData.value.currentPatrolDistance = 0
            mobData.value.direction *= -1
          }

          Matter.Body.translate(body, {
            x: (speed / 2) * mobData.value.direction,
            y: 0,
          })

          mobData.value.currentPatrolDistance += Math.abs(speed / 2)
        }

        if (game.server) {
          if (mobData.value.projectileCooldownCounter === 0) {
            const xOffset = mobData.value.direction === 1 ? 150 : -150
            const yOffset = 75

            await game.spawn({
              entity: '@dreamlab/Projectile',
              args: {
                width: 50,
                height: 10,
                direction: mobData.value.direction,
              },
              transform: {
                position: {
                  x: body.position.x + xOffset,
                  y: body.position.y - yOffset,
                },
                rotation: 0,
              },
              tags: ['net/replicated'],
            })

            if (mobData.value.projectileCooldownCounter === 0) {
              mobData.value.projectileCooldownCounter = projectileCooldown
            }
          } else {
            mobData.value.projectileCooldownCounter -= 1
          }
        }

        if (game.server && (!closestPlayer || minDistance > 6_000)) {
          await game.destroy(this as SpawnableEntity)
        }
      },

      onRenderFrame(
        { smooth },
        { game, mobData },
        { camera, container, gfxHittest, gfxBounds, gfxHealthAmount, sprite },
      ) {
        const debug = game.debug
        const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
        const pos = Vec.add(smoothed, camera.offset)

        sprite.scale.x = mobData.value.direction

        sprite.position = pos
        if (
          sprite.textures !== zombieAnimations[mobData.value.currentAnimation]
        ) {
          sprite.textures = zombieAnimations[mobData.value.currentAnimation]!
          sprite.gotoAndPlay(0)
        }

        if (
          mobData.value.currentAnimation === 'recoil' &&
          sprite.currentFrame === sprite.totalFrames - 1
        ) {
          mobData.value.currentAnimation = 'walk'
        }

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
        gfxHittest.alpha =
          mobData.value.hitCooldownCounter === 0 ? alpha / 3 : 0

        drawBox(
          gfxHealthAmount,
          {
            width: (mobData.value.health / maxHealth) * healthIndicatorWidth,
            height: 20,
          },
          { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
        )
      },
    }
  },
)
