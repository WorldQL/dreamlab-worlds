import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)
  await game.spawn({
    entity: '@dreamlab/ServerTime',
    args: [],
    transform: { position: [0, 0] },
    tags: ['net/replicated'],
  })
}
