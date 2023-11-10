import type { InitServer } from '@dreamlab.gg/core/sdk'
import Matter from 'matter-js'
import { regionManager } from './managers/regions.js'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)

  const checkPlayersInRegions = () => {
    const allPlayers = Matter.Composite.allBodies(
      game.physics.engine.world,
    ).filter(b => b.label === 'player')
    for (const region of regionManager.getRegions()) {
      const playersInRegion = allPlayers.filter(player =>
        regionManager.isPlayerInRegion(
          { x: player.position.x, y: player.position.y },
          region,
        ),
      )
      if (playersInRegion.length > 0 && !region.spawnIntervalId) {
        regionManager.startRegionInterval(game, region)
      } else if (playersInRegion.length === 0 && region.spawnIntervalId) {
        regionManager.stopRegionInterval(region)
      }
    }
  }

  checkPlayersInRegions()
  setInterval(checkPlayersInRegions, 5_000)
}
