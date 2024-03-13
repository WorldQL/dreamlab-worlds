import type { InitShared } from "@dreamlab.gg/core/sdk"
import { ParticleSpawner } from "./entities/particleSpawner.ts"
import { RegionManager } from "./entities/regionManager.ts"
import { GrappleHook, GrappleHookArgs } from "./entities/spawnable/grappleHook.ts"
import { InventoryItemArgs, Item } from "./entities/spawnable/inventoryItem.ts"
import { SpawnRegion, SpawnRegionArgs } from "./entities/spawnable/spawnRegion.ts"
import { Zombie, ZombieArgs } from "./entities/spawnable/zombie.ts"
import { MessageTrigger, MessageTriggerArgs } from "./entities/spawnable/messageTrigger.ts"
import { HealingItem, HealingItemArgs } from "./entities/spawnable/healingItem.ts"
import {
  EnvironmentParticle,
  EnvironmentParticleArgs
} from "./entities/spawnable/environmentParticle.ts"
import { AnimatedNonSolid, AnimatedNonSolidArgs } from "./entities/spawnable/animatedNonsolid.ts"

export const sharedInit: InitShared = async game => {
  game.register("@cvz/ZombieMob", Zombie, ZombieArgs)
  game.register("@cvz/Hook", GrappleHook, GrappleHookArgs)
  game.register("@cvz/SpawnRegion", SpawnRegion, SpawnRegionArgs)
  game.register("@cvz/InventoryItem", Item, InventoryItemArgs)
  game.register("@cvz/MessageTrigger", MessageTrigger, MessageTriggerArgs)
  game.register("@cvz/HealItem", HealingItem, HealingItemArgs)
  game.register("@cvz/EnvironmentParticle", EnvironmentParticle, EnvironmentParticleArgs)
  game.register("@cvz/AnimatedNonsolid", AnimatedNonSolid, AnimatedNonSolidArgs)

  game.instantiate(new ParticleSpawner())
  game.instantiate(new RegionManager())
}
