import type { InitClient } from '@dreamlab.gg/core/sdk'
import { preloadAssets } from './AssetLoader.js'
import { createBackground } from './entities/client/background.js'
import { createGrappleHook } from './entities/client/grappleHook.js'
import { initializeUI } from './screens/start.js'
import { sharedInit } from './shared.js'

export const init: InitClient = async game => {
  await preloadAssets()
  initializeUI(game)

  // entities
  game.register('@dreamlab/Background', createBackground)
  game.register('@dreamlab/Hook', createGrappleHook)

  await sharedInit(game)
}
