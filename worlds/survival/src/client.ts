import type { InitClient } from '@dreamlab.gg/core/sdk'
import { createBackground } from './entities/client/background.js'
import { createGrappleHook } from './entities/client/grappleHook.js'
import { initializeGameUI } from './inventory/inventoryManager.js'
// import { images } from './level/client/graphics.js'
import { map1 } from './level/client/map1.js'
import { initializeStartScreen } from './screens/start.js'
import { sharedInit } from './shared.js'

export const init: InitClient = async game => {
  initializeStartScreen(game)

  // entities
  game.register('@dreamlab/Background', createBackground)
  game.register('@dreamlab/Hook', createGrappleHook)

  await sharedInit(game)
  await game.spawnMany(...map1)
  // await game.spawn(...images)

  initializeGameUI(game)
}
