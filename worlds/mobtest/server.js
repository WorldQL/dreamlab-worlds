import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)

  // game.spawn({
  //   entity: '@dreamlab/Hittable',
  //   args: [],
  //   transform: { position: [0, 400] },
  //   tags: ['net/replicated'],
  // })
  // game.spawn({
  //   entity: '@dreamlab/Ladder',
  //   args: [100, 1_000],
  //   transform: { position: [1_450, 25] },
  //   tags: ['net/replicated'],
  // })
  // game.spawn({
  //   entity: '@dreamlab/Ladder',
  //   args: [150, 1_000],
  //   transform: { position: [2_375, 1_475] },
  //   tags: ['net/replicated'],
  // })
}
