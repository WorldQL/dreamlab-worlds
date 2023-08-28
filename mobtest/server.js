import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/dist/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)

  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [0, -100] },
    tags: ['net/replicated'],
  })
}