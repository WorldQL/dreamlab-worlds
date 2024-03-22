import type { InitShared } from "@dreamlab.gg/core/sdk"
import { ParticleSpawner } from "./entities/particleSpawner.ts"
import { RegionManager } from "./entities/regionManager.ts"
import { GrappleHook, GrappleHookArgs } from "./entities/spawnable/grappleHook.ts"
import { InventoryItemArgs, Item } from "./entities/spawnable/inventoryItem.ts"
import { ZombieRegion, ZombieRegionArgs } from "./entities/spawnable/zombieRegion.ts"
import { Zombie, ZombieArgs } from "./entities/spawnable/zombie.ts"
import { Prompt, PromptArgs } from "./entities/spawnable/prompt.ts"
import { HealingItem, HealingItemArgs } from "./entities/spawnable/healingItem.ts"
import {
  EnvironmentParticle,
  EnvironmentParticleArgs
} from "./entities/spawnable/environmentParticle.ts"
import { AnimatedNonSolid, AnimatedNonSolidArgs } from "./entities/spawnable/animatedNonsolid.ts"
import { QuestEntity, QuestArgs } from "./entities/spawnable/quest.ts"
import { GameManager } from "./entities/gameManager.ts"
import { Gold, GoldArgs } from "./entities/spawnable/gold.ts"
import { ZombieSpawn, ZombieSpawnArgs } from "./entities/spawnable/zombieSpawn.ts"

export const sharedInit: InitShared = async game => {
  game.register("@cvz/AnimatedNonsolid", AnimatedNonSolid, AnimatedNonSolidArgs)
  game.register("@cvz/EnvironmentParticle", EnvironmentParticle, EnvironmentParticleArgs)
  game.register("@cvz/ZombieMob", Zombie, ZombieArgs)
  game.register("@cvz/Hook", GrappleHook, GrappleHookArgs)
  game.register("@cvz/ZombieRegion", ZombieRegion, ZombieRegionArgs)
  game.register("@cvz/ZombieSpawn", ZombieSpawn, ZombieSpawnArgs)
  game.register("@cvz/InventoryItem", Item, InventoryItemArgs)
  game.register("@cvz/HealthItem", HealingItem, HealingItemArgs)
  game.register("@cvz/Quest", QuestEntity, QuestArgs)
  game.register("@cvz/Prompt", Prompt, PromptArgs)
  game.register("@cvz/Gold", Gold, GoldArgs)

  game.instantiate(new ParticleSpawner())
  game.instantiate(new RegionManager())
  game.instantiate(new GameManager())
}
