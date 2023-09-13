import { createElevator } from './entities/elevator.js'
import { createHittableMob } from './entities/hittableMob.js'
import { balls } from './level/ball-floor.js'
import { level as level1 } from './level/level1.js'
import { level2 } from './level/level2.js'

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  game.register('@dreamlab/Hittable', createHittableMob)
  game.register('@dreamlab/Elevator', createElevator)

  await game.spawnMany(...level1, ...balls, ...level2)

}

