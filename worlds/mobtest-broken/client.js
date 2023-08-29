import { sharedInit } from './shared.js'

/** @type {import('@dreamlab.gg/core/sdk').InitClient} */
export const init = async game => {
  await sharedInit(game)
  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [0, -100] },
    tags: [],
  })
  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [300, -100] },
    tags: [],
  })
  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [700, -100] },
    tags: [],
  })
  game.spawn({
    entity: '@dreamlab/Hittable',
    args: [],
    transform: { position: [900, -100] },
    tags: [],
  })
}
