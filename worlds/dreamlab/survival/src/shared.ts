import type { InitShared } from '@dreamlab.gg/core/sdk'
import { ProjectileSpawner } from './entities/projectileSpawner.js'
import { RegionManager } from './entities/regionManager.js'
import {
  GrappleHook,
  GrappleHookArgs,
} from './entities/spawnable/grappleHook.js'
import { InventoryItemArgs, Item } from './entities/spawnable/inventoryItem.js'
import { Projectile, ProjectileArgs } from './entities/spawnable/projectile.js'
import {
  SpawnRegion,
  SpawnRegionArgs,
} from './entities/spawnable/spawnRegion.js'
import { Zombie, ZombieArgs } from './entities/spawnable/zombie.js'

export const sharedInit: InitShared = async game => {
  game.register('@cvz/ZombieMob', Zombie, ZombieArgs)
  game.register('@cvz/Hook', GrappleHook, GrappleHookArgs)
  game.register('@cvz/SpawnRegion', SpawnRegion, SpawnRegionArgs)
  game.register('@cvz/InventoryItem', Item, InventoryItemArgs)
  game.register('@cvz/Projectile', Projectile, ProjectileArgs)

  game.instantiate(new ProjectileSpawner())
  game.instantiate(new RegionManager())
}
