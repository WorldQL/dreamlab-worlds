import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { z } from '@dreamlab.gg/core/dist/sdk'
import type { Camera, Player } from '@dreamlab.gg/core/entities'
import { isNetPlayer } from '@dreamlab.gg/core/entities'
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

const ArgsSchema = z.object({})

interface MobData {
  health: SyncedValue<number>
  direction: SyncedValue<number>
  projectileCooldownCounter: SyncedValue<number>
}

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onHitServer: MessageListenerServer
  onHitClient: MessageListenerClient
  netServer: NetServer | undefined
  netClient: NetClient | undefined
  onPlayerAttack(player: Player, item: PlayerInventoryItem): void
  onCollisionStart(
    pair: readonly [a: SpawnableEntity, b: SpawnableEntity],
  ): void
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
>(ArgsSchema, ({ uid, tags, transform, zIndex }) => {
  const HIT_CHANNEL = '@dreamlab/Hittable/hit'
  const { position } = transform

  const width = 130
  const height = width * 2
  const body = Matter.Bodies.rectangle(position.x, position.y, width, height)

  const maxHealth = 5
  let mobHealth = maxHealth
  const projectileCooldown = 2 * 60 // 2 seconds
  const hitRadius = width / 2 + 120
  const hitCooldown = 1 // Second(s)
  let hitCooldownCounter = 0

  const healthIndicatorWidth = width + 50
  const healthIndicatorHeight = 20

  return {
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

      const onPlayerAttack: (
        player: Player,
        item: PlayerInventoryItem,
      ) => void = (player, _item) => {
        if (hitCooldownCounter <= 0) {
          const xDiff = player.body.position.x - body.position.x

          if (Math.abs(xDiff) <= hitRadius) {
            netClient?.sendCustomMessage(HIT_CHANNEL, { uid })
            hitCooldownCounter = hitCooldown * 60
          }
        }
      }

      const onCollisionStart = (
        pair: readonly [a: SpawnableEntity, b: SpawnableEntity],
      ) => {
        const [a, b] = pair
        if ((a.uid === uid || b.uid === uid) && game.server) {
          mobData.direction.value = -mobData.direction.value
        }
      }

      game.events.common.addListener('onPlayerAttack', onPlayerAttack)
      game.events.common.addListener('onCollisionStart', onCollisionStart)

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
        const force = 0.5 * mobData.direction.value
        Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

        mobData.health.value -= 1
        if (mobData.health.value <= 0) {
          const respawnPosition = { ...body.position }

          // @ts-expect-error `this` is a partial entity
          await game.destroy(this)

          setTimeout(async () => {
            await game.spawn({
              entity: '@dreamlab/ArcherMob',
              args: {},
              transform: { position: [respawnPosition.x, respawnPosition.y] },
              tags: ['net/replicated'],
            })
          }, 10_000)
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
    }) {
      game.physics.unregister(this, body)
      game.events.common.removeListener('onPlayerAttack', onPlayerAttack)
      game.events.common.removeListener('onCollisionStart', onCollisionStart)

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

      const speed = 2
      Matter.Body.translate(body, {
        x: speed * mobData.direction.value,
        y: 0,
      })

      if (hitCooldownCounter > 0) {
        hitCooldownCounter -= 1
      }

      if (game.server) {
        if (mobData.projectileCooldownCounter.value === 0) {
          const xOffset = mobData.direction.value === 1 ? 150 : -150
          const yOffset = 75

          await game.spawn({
            entity: '@dreamlab/Projectile',
            args: { width: 50, height: 10, direction: mobData.direction.value },
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
})
