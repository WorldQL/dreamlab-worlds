import type { InitClient } from '@dreamlab.gg/core/sdk'
import { createBackground } from './entities/client/background.js'
import { createGrappleHook } from './entities/client/grappleHook.js'
// import { images } from './level/client/graphics.js'
import { initializeGameUI } from './inventory/InventoryApp.js'
import { map1 } from './level/client/map1.js'
import { initializeItemScreen } from './screens/item.js'
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

  // TODO: Consolidate all UI into one React tree so we dont have three roots all tracking state separately
  // TODO: Refactor the rest of the UI to use @dreamlab.gg/ui/react
  initializeGameUI(game)
  initializeItemScreen(game)
}
