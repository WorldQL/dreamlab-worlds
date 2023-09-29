import { initializeGameUI } from './dist/inventory/inventoryManager.js'
import { sharedInit } from './shared.js'
import { createBackground } from './dist/entities/client/background.js'
import { createFreeform } from './dist/entities/client/freeform.js'
import { createGrappleHook } from './dist/entities/client/grappleHook.js'
import { createPlatform } from './dist/entities/client/platform.js'
// import { images } from './level/client/graphics.js'
import { map1 } from './level/client/map1.js'

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  // entities
  game.register('@dreamlab/Background', createBackground)
  game.register('@dreamlab/Freeform', createFreeform)
  game.register('@dreamlab/Hook', createGrappleHook)
  game.register('@dreamlab/Platform', createPlatform)

  await sharedInit(game)
  await game.spawn(...map1)
  // await game.spawn(...images)

  initializeGameUI(game)
}
