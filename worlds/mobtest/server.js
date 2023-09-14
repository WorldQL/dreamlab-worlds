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
    entity: '@dreamlab/Elevator',
    args: [],
    transform: { position: [2_375, 1_475] },
    tags: ['net/replicated'],
  })
  game.spawn({
    entity: '@dreamlab/Elevator',
    args: [],
    transform: { position: [-2_375, 1_475] },
    tags: ['net/replicated'],
  })
  game.spawn({
    entity: '@dreamlab/Background',
    args: [5_760, 3_240, "/worlds/mobtest/assets/img/groundbg.png", 0.1, 0.2],
    transform: { position: [0, 0] },
    tags: ['net/replicated'],
  })
}
