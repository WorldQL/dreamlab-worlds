import { createPassiveMob } from './dist/entities/shared/mobs/passive.js'
import { createLadder } from './dist/entities/shared/ladder.js'
import { createBreakableSolid } from './dist/entities/shared/breakableSolid.js'
import { createPickupItem } from './dist/entities/shared/pickupItem.js'
import { createPlatform } from './dist/entities/client/platform.js'
import { createProjectile } from './dist/entities/shared/projectile.js'
import { level } from './level/shared/level.js'

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  game.register('@dreamlab/PassiveMob', createPassiveMob)
  game.register('@dreamlab/Ladder', createLadder)
  game.register('@dreamlab/BreakableSolid', createBreakableSolid)
  game.register('@dreamlab/PickupItem', createPickupItem)
  game.register('@dreamlab/Platform', createPlatform)
  game.register('@dreamlab/Projectile', createProjectile)

  await game.spawnMany(...level)
}
