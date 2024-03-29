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

const ArgsSchema = z.object({})

type OnPlayerAttack = EventHandler<'onPlayerAttack'>
type OnCollisionStart = EventHandler<'onCollisionStart'>

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onHitServer: MessageListenerServer
  onHitClient: MessageListenerClient
  netServer: NetServer | undefined
  netClient: NetClient | undefined
  direction: SyncedValue<number>
  onPlayerAttack: OnPlayerAttack
  onCollisionStart: OnCollisionStart
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  gfxHittest: Graphics
  ctrHealth: Container
  gfxHealthAmount: Graphics
}

export const createPassiveMob = createSpawnableEntity<
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

  const hitRadius = width / 2 + 120
  const hitCooldown = 1 // Second(s)
  let hitCooldownCounter = 0

  const healthIndicatorWidth = width + 50
  const healthIndicatorHeight = 20

  const maxHealth = 10
  let health = maxHealth

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

      const onPlayerAttack: OnPlayerAttack = (player, _item) => {
        if (hitCooldownCounter <= 0) {
          const xDiff = player.body.position.x - body.position.x

          if (Math.abs(xDiff) <= hitRadius) {
            netClient?.sendCustomMessage(HIT_CHANNEL, { uid })
            hitCooldownCounter = hitCooldown * 60
          }
        }
      }

      const onCollisionStart: OnCollisionStart = ([a, b]) => {
        if ((a.uid === uid || b.uid === uid) && game.server) {
          direction.value = -direction.value
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

        direction.value = body.position.x > player.position.x ? 1 : -1
        const force = 0.5 * direction.value
        Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

        health -= 1
        if (health <= 0) {
          const respawnPosition = { ...body.position }

          await game.destroy(this as SpawnableEntity)

          setTimeout(async () => {
            await game.spawn({
              entity: '@dreamlab/PassiveMob',
              args: {},
              transform: { position: [respawnPosition.x, respawnPosition.y] },
              tags: ['net/replicated'],
            })
          }, 10_000)
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

    onPhysicsStep(_, { direction }) {
      Matter.Body.setAngle(body, 0)
      Matter.Body.setAngularVelocity(body, 0)

      if (hitCooldownCounter > 0) {
        hitCooldownCounter -= 1
      }

      const speed = 2
      Matter.Body.translate(body, {
        x: speed * direction.value,
        y: 0,
      })
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
})
