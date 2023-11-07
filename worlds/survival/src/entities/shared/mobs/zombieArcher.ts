import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { createSpawnableEntity } from '@dreamlab.gg/core'
import { z } from '@dreamlab.gg/core/dist/sdk'
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
import { drawBox, drawCircle } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import { events } from '../../../events'

const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  maxHealth: z.number().positive().min(1),
  speed: z.number().positive().min(1),
  knockback: z.number().positive().min(0),
  spriteSource: z.string().optional(),
})

interface MobData {
  health: SyncedValue<number>
  direction: SyncedValue<number>
  projectileCooldownCounter: SyncedValue<number>
}

type OnPlayerAttack = EventHandler<'onPlayerAttack'>
type OnCollisionStart = EventHandler<'onCollisionStart'>
type OnPlayerCollisionStart = EventHandler<'onPlayerCollisionStart'>

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

  mobData: MobData
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  gfxHittest: Graphics
  ctrHealth: Container
  gfxHealthAmount: Graphics
}

export const createArcherMob = createSpawnableEntity<
  typeof ArgsSchema,
  SpawnableEntity<Data, Render>,
  Data,
  Render
>(
  ArgsSchema,
  (
    { uid, tags, transform, zIndex },
    { width, height, maxHealth, speed, knockback },
  ) => {
    const HIT_CHANNEL = '@dreamlab/Hittable/hit'
    const { position } = transform

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
      {
        label: 'zombie',
      },
    )

    let mobHealth = maxHealth
    const projectileCooldown = 2 * 60 // 2 seconds
    const hitRadius = width / 2 + 120
    const hitCooldown = 1 // Second(s)
    let hitCooldownCounter = 0

    const healthIndicatorWidth = width + 50
    const healthIndicatorHeight = 20

    let applyKnockback: [Matter.Body, number] | undefined

    return {
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
        const projectileCooldownCounter = syncedValue(
          game,
          uid,
          'projectileCooldownCounter',
          0,
        )

        const mobData = {
          health,
          direction,
          projectileCooldownCounter,
        }

        const onPlayerAttack: OnPlayerAttack = (player, _item) => {
          if (hitCooldownCounter <= 0) {
            const xDiff = player.body.position.x - body.position.x

            if (Math.abs(xDiff) <= hitRadius) {
              netClient?.sendCustomMessage(HIT_CHANNEL, { uid })
              hitCooldownCounter = hitCooldown * 60

              if (mobHealth - 1 <= 0) {
                events.emit('onPlayerScore', maxHealth * 25)
              }
            }
          }
        }

        const onCollisionStart: OnCollisionStart = ([a, b]) => {
          if ((a.uid === uid || b.uid === uid) && game.server) {
            mobData.direction.value = -mobData.direction.value
          }
        }

        const onPlayerCollisionStart: OnPlayerCollisionStart = (
          [player, bodyCollided],
          _raw,
        ) => {
          if (body && bodyCollided === body) {
            events.emit('onPlayerDamage', 1)
            const force = 4 * -player.facingDirection
            applyKnockback = [player.body, force]
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

          mobData.direction.value = body.position.x > player.position.x ? 1 : -1
          const force = knockback * mobData.direction.value
          Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

          mobData.health.value -= 1
          if (mobData.health.value <= 0) {
            await game.destroy(this as SpawnableEntity)
          } else {
            network.broadcastCustomMessage(HIT_CHANNEL, {
              uid,
              health: mobData.health.value,
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

          mobHealth = data.health
        }

        netClient?.addCustomMessageListener(HIT_CHANNEL, onHitClient)
        netServer?.addCustomMessageListener(HIT_CHANNEL, onHitServer)

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
          mobData,
        }
      },

      initRenderContext(_, { camera, stage }) {
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

        return {
          camera,
          container,
          gfxBounds,
          gfxHittest,
          ctrHealth,
          gfxHealthAmount,
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

      teardownRenderContext({ container, ctrHealth }) {
        container.destroy({ children: true })
        ctrHealth.destroy({ children: true })
      },

      async onPhysicsStep(_, { game, mobData }) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        if (hitCooldownCounter > 0) {
          hitCooldownCounter -= 1
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

        if (closestPlayer) {
          const dx = closestPlayer.position.x - body.position.x
          const dy = closestPlayer.position.y - body.position.y

          const distance = Math.hypot(dx, dy)
          const unitX = dx / distance
          const unitY = dy / distance

          Matter.Body.translate(body, {
            x: speed * unitX,
            y: speed * unitY,
          })
        }

        if (game.server) {
          if (mobData.projectileCooldownCounter.value === 0) {
            const xOffset = mobData.direction.value === 1 ? 150 : -150
            const yOffset = 75

            await game.spawn({
              entity: '@dreamlab/Projectile',
              args: {
                width: 50,
                height: 10,
                direction: mobData.direction.value,
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

            if (mobData.projectileCooldownCounter.value === 0) {
              mobData.projectileCooldownCounter.value = projectileCooldown
            }
          } else {
            mobData.projectileCooldownCounter.value -= 1
          }
        }

        if (game.server && (!closestPlayer || minDistance > 4_000)) {
          await game.destroy(this as SpawnableEntity)
        }
      },

      onRenderFrame(
        { smooth },
        { game },
        { camera, container, gfxHittest, gfxBounds, gfxHealthAmount },
      ) {
        const debug = game.debug
        const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
        const pos = Vec.add(smoothed, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
        gfxHittest.alpha = hitCooldownCounter === 0 ? alpha / 3 : 0

        drawBox(
          gfxHealthAmount,
          {
            width: (mobHealth / maxHealth) * healthIndicatorWidth,
            height: 20,
          },
          { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
        )
      },
    }
  },
)
