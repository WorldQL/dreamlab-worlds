import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { createSpawnableEntity, isEntity } from '@dreamlab.gg/core'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { z } from '@dreamlab.gg/core/dist/sdk'
import type { Camera, Player } from '@dreamlab.gg/core/entities'
import { isNetPlayer, isPlayer } from '@dreamlab.gg/core/entities'
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

const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  spriteSource: z.string().optional(),
  maxHealth: z.number().positive().min(1),
  speed: z.number().positive().min(1),
})

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onHitServer: MessageListenerServer
  onHitClient: MessageListenerClient
  netServer: NetServer | undefined
  netClient: NetClient | undefined
  direction: SyncedValue<number>
  onPlayerAttack(player: Player, item: PlayerInventoryItem): void
  onCollisionStart(
    pair: readonly [a: SpawnableEntity, b: SpawnableEntity],
  ): void
  onPlayerCollision(
    pair: readonly [player: Player, other: Matter.Body],
    _raw?: unknown,
  ): void
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  gfxHittest: Graphics
  ctrHealth: Container
  gfxHealthAmount: Graphics
}

const zombieSymbol = Symbol.for('@dreamlab/core/entities/zombie')
export const isZombie = (
  entity: unknown,
): entity is SpawnableEntity<Data, Render> => {
  if (!isEntity(entity)) return false
  return zombieSymbol in entity && entity[zombieSymbol] === true
}

export const createZombieMob = createSpawnableEntity<
  typeof ArgsSchema,
  SpawnableEntity<Data, Render>,
  Data,
  Render
>(
  ArgsSchema,
  ({ uid, tags, transform, zIndex }, { width, height, maxHealth, speed }) => {
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

    const hitRadius = width / 2 + 220
    const hitCooldown = 1 // Second(s)
    let hitCooldownCounter = 0

    const healthIndicatorWidth = width + 50
    const healthIndicatorHeight = 20

    let health = maxHealth
    let damagedPlayer = false

    return {
      [zombieSymbol]: true,

      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      isInBounds(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)

        const netServer = onlyNetServer(game)
        const netClient = onlyNetClient(game)
        const direction = syncedValue(game, uid, 'direction', 1)

        const onPlayerAttack: (
          player: Player,
          item: PlayerInventoryItem,
        ) => void = (player, _item) => {
          if (hitCooldownCounter <= 0) {
            const xDiff = player.body.position.x - body.position.x

            if (Math.abs(xDiff) <= hitRadius) {
              netClient?.sendCustomMessage(HIT_CHANNEL, { uid })
              hitCooldownCounter = hitCooldown * 60

              if (health - 1 <= 0) {
                game.events.custom.emit('onPlayerKill')
              }
            }
          }
        }

        const onCollisionStart = (
          pair: readonly [a: SpawnableEntity, b: SpawnableEntity],
        ) => {
          const [a, b] = pair
          if ((a.uid === uid || b.uid === uid) && game.server) {
            direction.value = -direction.value
          }
        }

        const onPlayerCollision = (
          pair: readonly [player: Player, otherBody: Matter.Body],
          _raw: unknown,
        ) => {
          const [_player, bodyCollided] = pair
          if (body && bodyCollided === body) {
            game.events.custom.emit('onPlayerDamage')
            damagedPlayer = true
          }
        }

        game.events.common.addListener('onPlayerAttack', onPlayerAttack)
        game.events.common.addListener('onCollisionStart', onCollisionStart)
        game.events.common.addListener(
          'onPlayerCollisionStart',
          onPlayerCollision,
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

          direction.value = body.position.x > player.position.x ? 1 : -1
          const force = 0.5 * direction.value
          Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

          health -= 1
          if (health <= 0) {
            await game.destroy(this as SpawnableEntity)
          } else {
            network.broadcastCustomMessage(HIT_CHANNEL, { uid, health })
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

          health = data.health
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
          direction,
          onPlayerAttack,
          onCollisionStart,
          onPlayerCollision,
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
        onPlayerCollision,
      }) {
        game.physics.unregister(this, body)
        game.events.common.removeListener('onPlayerAttack', onPlayerAttack)
        game.events.common.removeListener('onCollisionStart', onCollisionStart)
        game.events.common.removeListener(
          'onPlayerCollisionStart',
          onPlayerCollision,
        )

        netServer?.removeCustomMessageListener(HIT_CHANNEL, onHitServer)
        netClient?.removeCustomMessageListener(HIT_CHANNEL, onHitClient)
      },

      teardownRenderContext({ container, ctrHealth }) {
        container.destroy({ children: true })
        ctrHealth.destroy({ children: true })
      },

      onPhysicsStep(_, { game }) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        if (hitCooldownCounter > 0) {
          hitCooldownCounter -= 1
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
          { width: (health / maxHealth) * healthIndicatorWidth, height: 20 },
          { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
        )
      },
    }
  },
)
