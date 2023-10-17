import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitServer} */
export const init = async game => {
  await sharedInit(game)

  // since this is replicated it will get auto-spawned on clients as they join
  await game.spawn({
    entity: '@dreamlab/BouncyBall',
    args: { radius: 50 },
    transform: { position: [-375, -300] },
    tags: ['net/replicated'],
  })
}
