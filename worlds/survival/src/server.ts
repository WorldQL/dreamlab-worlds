import type { InitServer } from '@dreamlab.gg/core/sdk'
import Matter from 'matter-js'
import { regionManager } from './managers/regions.js'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)

  // using this until we can detect players entering/exiting a region
  const checkPlayersInRegions = async () => {
    const allPlayers = Matter.Composite.allBodies(
      game.physics.engine.world,
    ).filter(b => b.label === 'player')
    const startRegionIntervalsPromises = []

    for (const region of regionManager.getRegions()) {
      const playersInRegion = allPlayers.filter(player =>
        regionManager.isPlayerInRegion(
          { x: player.position.x, y: player.position.y },
          region,
        ),
      )
      if (
        playersInRegion.length > 0 &&
        !region.spawnIntervalId &&
        !region.isInCooldown
      ) {
        startRegionIntervalsPromises.push(
          regionManager.startRegionInterval(game, region),
        )
      } else if (playersInRegion.length === 0 && region.spawnIntervalId) {
        regionManager.stopRegionInterval(region)
      }
    }

    await Promise.all(startRegionIntervalsPromises)
  }

  await checkPlayersInRegions()
  setInterval(checkPlayersInRegions, 5_000)
}
