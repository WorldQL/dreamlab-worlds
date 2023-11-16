import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { createSpawnableEntity, isEntity } from '@dreamlab.gg/core'
import { z } from '@dreamlab.gg/core/dist/sdk'
import {
  loadPlayerSpritesheet,
  SpriteSourceSchema,
} from '@dreamlab.gg/core/dist/textures'
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
  MessageListenerClient,
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

interface MobData {
  health: number
  direction: number
  currentPatrolDistance: number
  hitCooldownCounter: number
}

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onHitServer: MessageListenerServer
  onHitClient: MessageListenerClient
  netServer: NetServer | undefined
  netClient: NetClient | undefined
  onPlayerAttack: OnPlayerAttack
  onCollisionStart: OnCollisionStart
  onPlayerCollisionStart: OnPlayerCollisionStart

  health: SyncedValue<number>
  direction: SyncedValue<number>
  currentPatrolDistance: SyncedValue<number>
  hitCooldownCounter: SyncedValue<number>
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

type zombieAnimations = 'hitting' | 'recoil' | 'walk'

const zombieSymbol = Symbol.for('@dreamlab/core/entities/zombie')
export const isZombie = (
  entity: unknown,
): entity is SpawnableEntity<Data, Render> => {
  if (!isEntity(entity)) return false
  return zombieSymbol in entity && entity[zombieSymbol] === true
}

export const createZombieMob = createSpawnableEntity<
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
    const hitRadius = width / 2 + 220
    const hitCooldown = 1 // Second(s)

    const healthIndicatorWidth = width + 50
    const healthIndicatorHeight = 20

    const zombieAnimations: Record<string, Texture<Resource>[]> = {}
    let currentAnimation: zombieAnimations = 'walk'
    let newAnimation: zombieAnimations = 'walk'

    return {
      [zombieSymbol]: true,

      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      rectangleBounds() {
        // TODO
        return undefined
      },

      isPointInside(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)

        const netServer = onlyNetServer(game)
        const netClient = onlyNetClient(game)

        const direction = syncedValue(game, uid, 'direction', 1)
        const health = syncedValue(game, uid, 'health', maxHealth)
        const hitCooldownCounter = syncedValue(
          game,
          uid,
          'hitCooldownCounter',
          0,
        )
        const currentPatrolDistance = syncedValue(
          game,
          uid,
          'currentPatrolDistance',
          0,
        )

        const onPlayerAttack: OnPlayerAttack = (player, item) => {
          if (
            hitCooldownCounter.value <= 0 &&
            item?.animationName !== 'bow' &&
            item?.animationName !== 'shoot'
          ) {
            const xDiff = player.body.position.x - body.position.x

            if (Math.abs(xDiff) <= hitRadius) {
              netClient?.sendCustomMessage(HIT_CHANNEL, { uid })

              if (health.value - 1 <= 0) {
                events.emit('onPlayerScore', maxHealth * 20)
              }
            }
          }
        }

        const onCollisionStart: OnCollisionStart = ([a, b]) => {
          if (a.uid === uid || b.uid === uid) {
            const other = a.uid === uid ? b : a

            if (other.tags.includes('Projectile')) {
              netClient?.sendCustomMessage(HIT_CHANNEL, { uid })

              if (health.value - 1 <= 0) {
                events.emit('onPlayerScore', maxHealth * 20)
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
        game.events.common.addListener(
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

          hitCooldownCounter.value = hitCooldown * 60
          const force = knockback * direction.value
          Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

          health.value -= 1
          if (health.value <= 0) {
            await game.destroy(this as SpawnableEntity)
          } else {
            network.broadcastCustomMessage(HIT_CHANNEL, {
              uid,
              health: health.value,
            })
          }
        }

        const onHitClient: MessageListenerClient = (_, data) => {
          const network = netClient
          if (!network) throw new Error('missing network')

          if (!('uid' in data)) return
          if (typeof data.uid !== 'string') return
          if (data.uid !== uid) return

          if (!('health' in data)) return
          if (typeof data.health !== 'number') return
        }

        netServer?.addCustomMessageListener(HIT_CHANNEL, onHitServer)
        netClient?.addCustomMessageListener(HIT_CHANNEL, onHitClient)

        return {
          game,
          body,
          onHitServer,
          onHitClient,
          netServer,
          netClient,
          onPlayerAttack,
          onCollisionStart,
          onPlayerCollisionStart,
          // mob data
          health,
          direction,
          currentPatrolDistance,
          hitCooldownCounter,
        }
      },

      initRenderContext: async (_, { camera, stage }) => {
        const spritesheetwalk = await loadPlayerSpritesheet(
          '/animations/z1walk.json',
        )
        zombieAnimations.walk = spritesheetwalk.textures
        const spritesheetRecoil = await loadPlayerSpritesheet(
          '/animations/z1hitreact.json',
        )
        zombieAnimations.recoil = spritesheetRecoil.textures

        const sprite = new AnimatedSprite(zombieAnimations[currentAnimation]!)
        sprite.scale.set(0.9)
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
        onHitClient,
        netServer,
        netClient,
        onPlayerAttack,
        onCollisionStart,
        onPlayerCollisionStart,
      }) {
        game.physics.unregister(this, body)
        game.events.common.removeListener('onPlayerAttack', onPlayerAttack)
        game.events.common.removeListener('onCollisionStart', onCollisionStart)
        game.events.common.removeListener(
          'onPlayerCollisionStart',
          onPlayerCollisionStart,
        )

        netServer?.removeCustomMessageListener(HIT_CHANNEL, onHitServer)
        netClient?.removeCustomMessageListener(HIT_CHANNEL, onHitClient)
      },

      teardownRenderContext({ container, ctrHealth, sprite }) {
        container.destroy({ children: true })
        ctrHealth.destroy({ children: true })
        sprite.destroy()
      },

      async onPhysicsStep(
        _,
        { game, direction, currentPatrolDistance, hitCooldownCounter },
      ) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        if (hitCooldownCounter.value > 0 && game.server) {
          hitCooldownCounter.value -= 1
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
          if (game.server) {
            direction.value =
              closestPlayer.position.x > body.position.x ? -1 : 1
          }
        } else {
          // patrol back and fourth when player is far from entity
          if (game.server && currentPatrolDistance.value >= patrolDistance) {
            currentPatrolDistance.value = 0
            direction.value *= -1
          }

          Matter.Body.translate(body, {
            x: (speed / 2) * direction.value,
            y: 0,
          })

          if (game.server) currentPatrolDistance.value += Math.abs(speed / 2)
        }

        if (game.server && (!closestPlayer || minDistance > 6_000)) {
          await game.destroy(this as SpawnableEntity)
        }
      },

      onRenderFrame(
        { smooth },
        { game, body, direction, hitCooldownCounter, health },
        { camera, sprite, container, gfxHittest, gfxBounds, gfxHealthAmount },
      ) {
        const debug = game.debug
        const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
        const pos = Vec.add(smoothed, camera.offset)

        sprite.scale.x = direction.value === 1 ? 1 : -1

        sprite.position = pos
        if (currentAnimation !== newAnimation) {
          console.log('switching animation for zombie')
          currentAnimation = newAnimation
          sprite.textures = zombieAnimations[currentAnimation]!
          sprite.gotoAndPlay(0)
        }

        if (
          currentAnimation === 'recoil' &&
          sprite.currentFrame === sprite.totalFrames - 1
        ) {
          newAnimation = 'walk'
        }

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
        gfxHittest.alpha = hitCooldownCounter.value === 0 ? alpha / 3 : 0

        drawBox(
          gfxHealthAmount,
          {
            width: (health.value / maxHealth) * healthIndicatorWidth,
            height: 20,
          },
          { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
        )
      },
    }
  },
)
