import type { InitShared } from '@dreamlab.gg/core/sdk'
import { createProjectileSpawner } from './entities/projectileSpawner.js'
import { createRegionManager } from './entities/regionManager.js'
import { createBreakableSolid } from './entities/spawnable/breakableSolid.js'
import { createGrappleHook } from './entities/spawnable/grappleHook.js'
import { createInventoryItem } from './entities/spawnable/inventoryItem.js'
import { createLadder } from './entities/spawnable/ladder.js'
import { createProjectile } from './entities/spawnable/projectile.js'
import { createSpawnRegion } from './entities/spawnable/spawnRegion.js'
import { createZombieMob } from './entities/spawnable/zombie.js'

export const sharedInit: InitShared = async game => {
  game.register('@cvz/ZombieMob', createZombieMob)
  game.register('@cvz/Hook', createGrappleHook)
  game.register('@cvz/Ladder', createLadder)
  game.register('@cvz/SpawnRegion', createSpawnRegion)
  game.register('@cvz/BreakableSolid', createBreakableSolid)
  game.register('@cvz/InventoryItem', createInventoryItem)
  game.register('@cvz/Projectile', createProjectile)

  await game.instantiate(createProjectileSpawner())
  await game.instantiate(createRegionManager())
}
