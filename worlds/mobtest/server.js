import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)

  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [-1_000, 300] },
    tags: ['net/replicated'],
  })
}
