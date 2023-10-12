import { sharedInit } from './shared.js'

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)

  game.spawn({
    entity: '@dreamlab/PassiveMob',
    args: [],
    transform: { position: [-1_250, 300] },
    tags: ['net/replicated'],
  })
}
