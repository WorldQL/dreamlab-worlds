import { createSpawnableEntity } from '@dreamlab.gg/core'
import { isNetPlayer, isPlayer } from '@dreamlab.gg/core/entities'
import { cloneTransform, distance, Vec } from '@dreamlab.gg/core/math'
import { onlyNetClient, onlyNetServer } from '@dreamlab.gg/core/network'
import { drawBox, drawCircle } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

export const level = [
  {
    entity: '@dreamlab/Solid',
    args: [5_000, 50],
    transform: {
      position: { x: 0, y: 295 },
      rotation: 0,
    },
  },
]

const createHittableMob = (globalPassPlayerData) => createSpawnableEntity(
  ({ uid, tags, transform, zIndex }) => {
    const HIT_CHANNEL = '@dreamlab/Hittable/hit'
    const { position } = transform

    console.log(globalPassPlayerData)
    let weapon = -1

    const width = 130
    const height = width * 2
    const body = Matter.Bodies.rectangle(position.x, position.y, width, height)

    const hitRadius = width / 2 + 120
    const hitCooldown = 1 // Second(s)
    let hitTimer = 0

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

      isInBounds() {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.client?.inputs.registerInput('@weapon/change', 'KeyQ')
        game.physics.register(this, body)

        const netServer = onlyNetServer(game)
        const netClient = onlyNetClient(game)

        /** @type {import('@dreamlab.gg/core/network').MessageListenerServer} */
        const onHitServer = (peerID, _, data) => {
          const network = netServer
          if (!network) throw new Error('missing network')

          if (!('uid' in data)) return
          if (typeof data.uid !== 'string') return
          if (data.uid !== uid) return

          const player = game.entities
            .filter(isNetPlayer)
            .find(netplayer => netplayer.peerID === peerID)

          if (!player) throw new Error('missing netplayer')
          const dist = distance(player.position, body.position)
          if (dist > hitRadius) return

          const direction = body.position.x > player.position.x ? 1 : -1
          const force = 0.5 * direction
          Matter.Body.applyForce(body, body.position, { x: force, y: -1.75 })

          health -= 1
          if (health <= 0) {
            // @ts-expect-error `this` is a partial entity
            game.destroy(this)
          } else {
            network.broadcastCustomMessage(HIT_CHANNEL, { uid, health })
          }
        }

        /** @type {import('@dreamlab.gg/core/network').MessageListenerClient} */
        const onHitClient = (_, data) => {
          const network = netClient
          if (!network) throw new Error('missing network')

          if (!('uid' in data)) return
          if (typeof data.uid !== 'string') return
          if (data.uid !== uid) return

          if (!('health' in data)) return
          if (typeof data.health !== 'number') return

          console.log(data.name)
          health = data.health
        }

        netServer?.addCustomMessageListener(HIT_CHANNEL, onHitServer)
        netClient?.addCustomMessageListener(HIT_CHANNEL, onHitClient)

        return { game, body, onHitServer, onHitClient, netServer, netClient }
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

      teardown({ game, onHitServer, onHitClient, netServer, netClient }) {
        game.physics.unregister(this, body)

        netServer?.removeCustomMessageListener(HIT_CHANNEL, onHitServer)
        netClient?.removeCustomMessageListener(HIT_CHANNEL, onHitClient)
      },

      teardownRenderContext({ container, ctrHealth }) {
        container.destroy({ children: true })
        ctrHealth.destroy({ children: true })
      },

      onPhysicsStep({ delta }, { game, netClient, netServer }) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        const inputs = game.client?.inputs
        const hit = inputs?.getInput('@player/attack') ?? false
        if (hit && hitTimer === 0) {
          const player = game.entities.find(isPlayer)
          if (!player) return

          const dist = distance(player.position, body.position)
          if (dist > hitRadius) return

          hitTimer += hitCooldown
          netClient?.sendCustomMessage(HIT_CHANNEL, { uid })
        } else {
          hitTimer -= delta
          hitTimer = Math.max(hitTimer, 0)
        }
        
      },

      onRenderFrame(
        _,
        { game },
        { camera, container, gfxBounds, gfxHittest, gfxHealthAmount },
      ) {
        const debug = game.debug
        const pos = Vec.add(body.position, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
        gfxHittest.alpha = hitTimer === 0 ? alpha / 3 : 0

        drawBox(
          gfxHealthAmount,
          { width: (health / maxHealth) * healthIndicatorWidth, height: 20 },
          { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
        )
      },
    }
  },
)

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {

   let globalPassPlayerData = {};
  
  if (game.client) {
    try {
      globalPassPlayerData = JSON.parse(window.localStorage.getItem('globalPassedPlayerData'));
    } catch {
      console.log("JSON parse error for globalPassedPlayerData")
    }
  }  

  game.register('@dreamlab/Hittable', createHittableMob(globalPassPlayerData));

  await game.spawnMany(...level);
}

