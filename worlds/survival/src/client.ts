import type { InitClient } from '@dreamlab.gg/core/sdk'
import { preloadAssets } from './AssetLoader.js'
import { initializeUI } from './screens/start.js'
import { sharedInit } from './shared.js'

export const init: InitClient = async game => {
  await preloadAssets()
  initializeUI(game)

  await sharedInit(game)
}
