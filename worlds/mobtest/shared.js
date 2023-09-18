import { createHittableMob } from './entities/shared/basic.js'
import { createLadder } from './entities/shared/ladder.js'
import { balls } from './level/shared/ball-floor.js'
import { level1 } from './level/shared/level1.js'
import { level2 } from './level/shared/level2.js'

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  game.register('@dreamlab/Hittable', createHittableMob)
  game.register('@dreamlab/Ladder', createLadder)

  await game.spawnMany(...level1, ...balls, ...level2)
}
