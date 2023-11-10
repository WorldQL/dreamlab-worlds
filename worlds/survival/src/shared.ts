import type { InitShared } from '@dreamlab.gg/core/sdk'
import { createPickupItem } from './entities/shared/InventoryItem.js'
import { createBreakableSolid } from './entities/shared/breakableSolid.js'
import { createLadder } from './entities/shared/ladder.js'
import { createZombieMob } from './entities/shared/mobs/zombie.js'
import { createArcherMob } from './entities/shared/mobs/zombieArcher.js'
import { createPlatform } from './entities/shared/platform.js'
import { createProjectile } from './entities/shared/projectile.js'
import { createRegion } from './entities/shared/region.js'
import { level } from './level/shared/level.js'
import { regionManager } from './managers/regions.js'
import { initProjectileWeapons } from './managers/shooters.js'

export const sharedInit: InitShared = async game => {
  game.register('@dreamlab/ZombieMob', createZombieMob)
  game.register('@dreamlab/ArcherMob', createArcherMob)

  game.register('@dreamlab/Ladder', createLadder)
  game.register('@dreamlab/Region', createRegion)
  game.register('@dreamlab/BreakableSolid', createBreakableSolid)
  game.register('@dreamlab/InventoryItem', createPickupItem)
  game.register('@dreamlab/Platform', createPlatform)
  game.register('@dreamlab/Projectile', createProjectile)

  await game.spawnMany(...level)

  // Draw hard-coded regions for debugging (see regions.ts for hard-coded region locations)
  const regionSpawns = regionManager.getRegions().map(async region =>
    game.spawn({
      entity: '@dreamlab/Region',
      args: { width: region.bounds.width, height: region.bounds.height },
      transform: {
        position: { x: region.center.x, y: region.center.y },
        rotation: 0,
      },
    }),
  )

  await Promise.all(regionSpawns)

  initProjectileWeapons(game)
}
