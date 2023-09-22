import { createHittableMob } from './entities/shared/basic.js'
import { createLadder } from './dist/entities/shared/ladder.js'
import { createBreakableSolid } from './dist/entities/shared/breakableSolid.js'
import { createPickupItem } from './dist/entities/shared/pickupItem.js'
import { level } from './level/shared/level.js'

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  game.register('@dreamlab/Hittable', createHittableMob)
  game.register('@dreamlab/Ladder', createLadder)
  game.register('@dreamlab/BreakableSolid', createBreakableSolid)
  game.register('@dreamlab/PickupItem', createPickupItem)

  await game.spawnMany(...level)
}
