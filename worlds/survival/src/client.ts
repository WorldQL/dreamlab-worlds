import { deferUntilPlayer } from '@dreamlab.gg/core/dist/utils'
import type { InitClient } from '@dreamlab.gg/core/sdk'
import { preloadAssets } from './AssetLoader.js'
import { initializeUI } from './screens/start.js'
import { sharedInit } from './shared.js'

export const init: InitClient = async game => {
  await preloadAssets()
  initializeUI(game)
  deferUntilPlayer(game, async player => {
    await player.setCharacterId('c_y9ydqx2pghxl04emgnxu6r5g')
  })

  await sharedInit(game)
}
