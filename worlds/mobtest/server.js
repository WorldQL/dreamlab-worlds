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
    entity: '@dreamlab/BouncyBall',
    args: [50],
    transform: {
      position: { x: 0, y: 1_750 },
      rotation: 90,
    },
    tags: ['net/replicated'],
  })
}
