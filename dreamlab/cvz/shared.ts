import type { InitShared } from "@dreamlab.gg/core/sdk"
import { ProjectileSpawner } from "./entities/projectileSpawner.ts"
import { RegionManager } from "./entities/regionManager.ts"
import { GrappleHook, GrappleHookArgs } from "./entities/spawnable/grappleHook.ts"
import { InventoryItemArgs, Item } from "./entities/spawnable/inventoryItem.ts"
import { Projectile, ProjectileArgs } from "./entities/spawnable/projectile.ts"
import { SpawnRegion, SpawnRegionArgs } from "./entities/spawnable/spawnRegion.ts"
import { Zombie, ZombieArgs } from "./entities/spawnable/zombie.ts"

export const sharedInit: InitShared = async game => {
  game.register("@cvz/ZombieMob", Zombie, ZombieArgs)
  game.register("@cvz/Hook", GrappleHook, GrappleHookArgs)
  game.register("@cvz/SpawnRegion", SpawnRegion, SpawnRegionArgs)
  game.register("@cvz/InventoryItem", Item, InventoryItemArgs)
  game.register("@cvz/Projectile", Projectile, ProjectileArgs)

  game.instantiate(new ProjectileSpawner())
  game.instantiate(new RegionManager())
}
