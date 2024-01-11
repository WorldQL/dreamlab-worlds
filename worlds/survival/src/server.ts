import { isSpawnableEntity } from '@dreamlab.gg/core'
import type { Entity } from '@dreamlab.gg/core'
import type { InitServer } from '@dreamlab.gg/core/sdk'
import Matter from 'matter-js'
import { regionManager } from './managers/regions.js'
import { sharedInit } from './shared.js'

const onInstantiateRegion = (entity: Entity) => {
  if (!isSpawnableEntity(entity)) return
  if (entity.definition.entity.includes('Region')) {
    const regionArgs = entity.args
    const newRegion = {
      zombieTypes: regionArgs.zombieTypes,
      bounds: regionArgs.bounds,
      center: regionArgs.center,
      difficulty: regionArgs.difficulty,
      waves: regionArgs.waves,
      waveInterval: regionArgs.waveInterval,
      endCooldown: regionArgs.endCooldown,
    }
    regionManager.addRegion(newRegion)
  }
}

export const init: InitServer = async game => {
  await sharedInit(game)

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

  game.events.common.addListener('onInstantiate', onInstantiateRegion)

  await checkPlayersInRegions()
  setInterval(checkPlayersInRegions, 5_000)
}
