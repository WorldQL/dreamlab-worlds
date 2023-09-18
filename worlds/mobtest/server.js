import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)

  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [0, 400] },
    tags: ['net/replicated'],
  })
  game.spawn({
    entity: '@dreamlab/Ladder',
    args: [],
    transform: { position: [-2_375, 1_475] },
    tags: ['net/replicated'],
  })
  game.spawn({
    entity: '@dreamlab/Ladder',
    args: [],
    transform: { position: [2_375, 1_475] },
    tags: ['net/replicated'],
  })
}
