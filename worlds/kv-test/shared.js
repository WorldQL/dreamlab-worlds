import { createEntity } from '@dreamlab.gg/core'
import { onlyNetClient, onlyNetServer } from '@dreamlab.gg/core/network'
import { createDebugText } from '@dreamlab.gg/core/utils'

/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level = [
  {
    entity: '@dreamlab/Solid',
    args: { width: 5_000, height: 50 },
    transform: {
      position: { x: 0, y: 295 },
      rotation: 0,
    },
  },
]

const createPlayerTracker = () => {
  const CHANNEL = '@dreamlab/PlayerTracker/data'
  const KV_KEY = 'plays'

  /** @type {{ globalPlays: number | undefined; playerPlays: number | undefined}} */
  const playsData = {
    globalPlays: undefined,
    playerPlays: undefined,
  }

  return createEntity({
    init({ game }) {
      const netServer = onlyNetServer(game)
      const netClient = onlyNetClient(game)

      /** @type {import('@dreamlab.gg/core/network').MessageListenerServer} */
      const onConnectServer = async ({ peerID }) => {
        const network = netServer
        if (!network) throw new Error('missing network')

        // Ensure KV exists
        const kv = game.server?.kv
        if (!kv) throw new Error('missing kv')

        // Get global plays (or default to 0)
        const globalPlaysStr = await kv.world.get(KV_KEY)
        const globalPlays = globalPlaysStr
          ? Number.parseInt(globalPlaysStr, 10)
          : 0

        // Increment and update global plays
        const newGlobalPlays = globalPlays + 1
        await kv.world.set(KV_KEY, newGlobalPlays.toString())

        // Broadcast new global plays to all clients
        network.broadcastCustomMessage(CHANNEL, { globalPlays: newGlobalPlays })

        // Get stable player ID for current peer ID
        const { id: playerID } = kv.getPlayerInfo(peerID)

        // Same as above but scoped to the current player
        const playerPlaysStr = await kv.player(playerID).get(KV_KEY)
        const playerPlays = playerPlaysStr
          ? Number.parseInt(playerPlaysStr, 10)
          : 0

        // Increment and update player plays
        const newPlayerPlays = playerPlays + 1
        await kv.player(playerID).set(KV_KEY, newPlayerPlays.toString())

        // Send new player plays to current player
        network.sendCustomMessage(peerID, CHANNEL, {
          playerPlays: newPlayerPlays,
        })
      }

      /** @type {import('@dreamlab.gg/core/network').MessageListenerClient} */
      const onConnectClient = (_, data) => {
        const network = netClient
        if (!network) throw new Error('missing network')

        // Update globalPlays locally
        if ('globalPlays' in data && typeof data.globalPlays === 'number') {
          playsData.globalPlays = data.globalPlays
        }

        // Update playerPlays locally
        if ('playerPlays' in data && typeof data.playerPlays === 'number') {
          playsData.playerPlays = data.playerPlays
        }
      }

      // Register network listeners
      netServer?.addCustomMessageListener(CHANNEL, onConnectServer)
      netClient?.addCustomMessageListener(CHANNEL, onConnectClient)

      // Fire event on server on init
      netClient?.sendCustomMessage(CHANNEL, {})

      return { game, onConnectServer, onConnectClient, netServer, netClient }
    },

    initRenderContext(_, { stage, camera }) {
      // TODO: better display
      const text = createDebugText(3)
      stage.addChild(text.gfx)

      return {
        camera,
        text,
      }
    },

    teardown({ onConnectServer, onConnectClient, netServer, netClient }) {
      netServer?.removeCustomMessageListener(CHANNEL, onConnectServer)
      netClient?.removeCustomMessageListener(CHANNEL, onConnectClient)
    },

    teardownRenderContext({ text }) {
      text.gfx.destroy()
    },

    onRenderFrame(_, { game }, { camera, text }) {
      const debug = game.debug

      text.update(JSON.stringify(playsData))
      text.render(camera.scale, debug.value)
    },
  })
}

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  await game.spawnMany(...level)

  // Create and instantiate tracker entity
  const tracker = createPlayerTracker()
  await game.instantiate(tracker)
}
