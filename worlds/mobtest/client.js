import { init as initReactClient } from './dist/client.js'
import { sharedInit } from './shared.js'
import { createBackground } from './dist/entities/client/background.js'
import { createFreeform } from './dist/entities/client/freeform.js'
import { createGrapplingHook } from './dist/entities/client/grapplingHook.js'
import { createPlatform } from './dist/entities/client/platform.js'
import { images } from './level/client/graphics.js'
import { map1 } from './level/client/map1.js'

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  await initReactClient(game)
  // entities
  game.register('@dreamlab/Background', createBackground)
  game.register('@dreamlab/Freeform', createFreeform)
  game.register('@dreamlab/Hook', createGrapplingHook)
  game.register('@dreamlab/Platform', createPlatform)

  await sharedInit(game)
  await game.spawnMany(...images, ...map1)
}
