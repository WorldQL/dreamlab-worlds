import { init as initReactClient } from './dist/client.js'
import { sharedInit } from './shared.js'
import { createBackground } from './dist/entities/client/background.js'
import { createFreeform } from './dist/entities/client/freeform.js'
import { createLadder } from './dist/entities/client/ladder.js'
import { createGrapplingHook } from './dist/entities/client/grapplingHook.js'

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  await sharedInit(game)
  await initReactClient(game)

  // entities
  game.register('@dreamlab/Background', createBackground)
  game.register('@dreamlab/Freeform', createFreeform)
  game.register('@dreamlab/Ladder', createLadder)
  game.register('@dreamlab/Hook', createGrapplingHook)
}
