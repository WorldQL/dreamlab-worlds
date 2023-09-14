import { createBackground } from './entities/background.js'
import { createElevator } from './entities/elevator.js'
import { createFreeform } from './entities/freeform.js'
import { createGrapplingHook } from './entities/grapplingHook.js'
import { createHittableMob } from './entities/mobs/basic.js'
import { createPlatform } from './entities/platform.js'
import { balls } from './level/ball-floor.js'
import { level as level1 } from './level/level1.js'
import { level2 } from './level/level2.js'

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  game.register('@dreamlab/Hittable', createHittableMob)
  game.register('@dreamlab/Elevator', createElevator)
  game.register('@dreamlab/Background', createBackground)
  game.register('@dreamlab/Platform', createPlatform)
  game.register('@dreamlab/Freeform', createFreeform)
  game.register('@dreamlab/Hook', createGrapplingHook)

  await game.spawnMany(...level1, ...balls, ...level2)
}
