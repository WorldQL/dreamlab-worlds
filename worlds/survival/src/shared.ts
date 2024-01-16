import type { InitShared } from '@dreamlab.gg/core/sdk'
import { createInventoryItem } from './entities/InventoryItem.js'
import { createBreakableSolid } from './entities/breakableSolid.js'
import { createGrappleHook } from './entities/grappleHook.js'
import { createLadder } from './entities/ladder.js'
import { createZombieMob } from './entities/mobs/zombie.js'
import { createArcherMob } from './entities/mobs/zombieArcher.js'
import { createProjectile } from './entities/projectile.js'
import { createSpawnRegion } from './entities/spawnRegion.js'
import { initProjectileWeapons } from './managers/shooters.js'

export const sharedInit: InitShared = async game => {
  game.register('@cvz/ZombieMob', createZombieMob)
  game.register('@cvz/ArcherMob', createArcherMob)
  game.register('@cvz/Hook', createGrappleHook)
  game.register('@cvz/Ladder', createLadder)
  game.register('@cvz/SpawnRegion', createSpawnRegion)
  game.register('@cvz/BreakableSolid', createBreakableSolid)
  game.register('@cvz/InventoryItem', createInventoryItem)
  game.register('@cvz/Projectile', createProjectile)

  initProjectileWeapons(game)
}
