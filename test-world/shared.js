import { level } from './level.js'

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  await game.spawnMany(...level)
}
