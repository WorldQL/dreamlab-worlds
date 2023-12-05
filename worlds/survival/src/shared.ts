import type { InitShared } from '@dreamlab.gg/core/sdk'
import { createPickupItem } from './entities/InventoryItem.js'
import { createBreakableSolid } from './entities/breakableSolid.js'
import { createGrappleHook } from './entities/grappleHook.js'
import { createLadder } from './entities/ladder.js'
import { createZombieMob } from './entities/mobs/zombie.js'
import { createArcherMob } from './entities/mobs/zombieArcher.js'
import { createPlatform } from './entities/platform.js'
import { createProjectile } from './entities/projectile.js'
import { createRegion } from './entities/region.js'
import { regionManager } from './managers/regions.js'
import { initProjectileWeapons } from './managers/shooters.js'

export const sharedInit: InitShared = async game => {
  game.register('@dreamlab/ZombieMob', createZombieMob)
  game.register('@dreamlab/ArcherMob', createArcherMob)
  game.register('@dreamlab/Hook', createGrappleHook)
  game.register('@dreamlab/Ladder', createLadder)
  game.register('@dreamlab/Region', createRegion)
  game.register('@dreamlab/BreakableSolid', createBreakableSolid)
  game.register('@dreamlab/InventoryItem', createPickupItem)
  game.register('@dreamlab/Platform', createPlatform)
  game.register('@dreamlab/Projectile', createProjectile)

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
