import type { InitShared } from '@dreamlab.gg/core/sdk'
import { createPlatform } from './entities/client/platform.js'
import { createBreakableSolid } from './entities/shared/breakableSolid.js'
import { createLadder } from './entities/shared/ladder.js'
import { createZombieMob } from './entities/shared/mobs/zombie.js'
import { createArcherMob } from './entities/shared/mobs/zombieArcher.js'
import { createPickupItem } from './entities/shared/pickupItem.js'
import { createProjectile } from './entities/shared/projectile.js'
import { level } from './level/shared/level.js'
import { initBow } from './managers/bow.js'

export const sharedInit: InitShared = async game => {
  game.register('@dreamlab/PassiveMob', createZombieMob)
  game.register('@dreamlab/ArcherMob', createArcherMob)

  game.register('@dreamlab/Ladder', createLadder)
  game.register('@dreamlab/BreakableSolid', createBreakableSolid)
  game.register('@dreamlab/PickupItem', createPickupItem)
  game.register('@dreamlab/Platform', createPlatform)
  game.register('@dreamlab/Projectile', createProjectile)

  await game.spawnMany(...level)

  initBow(game)
}
