import type { Game } from '@dreamlab.gg/core'
import Matter from 'matter-js'

export const ZombieTypes = [
  {
    width: 80,
    height: 100,
    maxHealth: 2,
    speed: 5,
    knockback: 2,
  }, // babyZombie
  {
    width: 80,
    height: 260,
    maxHealth: 1,
    speed: 2,
    knockback: 0.5,
  }, // weakZombie
  {
    width: 130,
    height: 260,
    maxHealth: 4,
    speed: 3,
    knockback: 1.5,
  }, // zombie
  {
    width: 130,
    height: 380,
    maxHealth: 10,
    speed: 2,
    knockback: 1,
  }, // strongZombie
]

export interface Region {
  id: string
  bounds: { width: number; height: number }
  center: { x: number; y: number }
  difficulty: number
  zombieTypes: typeof ZombieTypes
  spawnIntervalId?: NodeJS.Timeout
}

class RegionManager {
  private regions: Region[] = []

  public addRegion(region: Region) {
    this.regions.push(region)
  }

  public setRegions(newRegions: Region[]) {
    this.regions = newRegions
  }

  public findRegionByPlayerLocation(playerPosition: {
    x: number
    y: number
  }): Region | undefined {
    return this.regions.find(region =>
      this.isPlayerInRegion(playerPosition, region),
    )
  }

  public async startRegionInterval(game: Game<false>, region: Region) {
    if (region.spawnIntervalId) return

    const spawn = async () => {
      await this.spawnZombies(game, region)

      clearTimeout(region.spawnIntervalId)

      const newSpawnIntervalId = setTimeout(spawn, 20 * 1_000)
      region.spawnIntervalId = newSpawnIntervalId
    }

    await spawn()
  }

  public stopRegionInterval(region: Region) {
    if (region.spawnIntervalId) clearInterval(region.spawnIntervalId)
    region.spawnIntervalId = undefined
  }

  public isPlayerInRegion(
    playerPosition: { x: number; y: number },
    region: Region,
  ): boolean {
    const regionLeft = region.center.x - region.bounds.width / 2
    const regionRight = region.center.x + region.bounds.width / 2
    const regionTop = region.center.y - region.bounds.height / 2
    const regionBottom = region.center.y + region.bounds.height / 2
    return (
      playerPosition.x >= regionLeft &&
      playerPosition.x <= regionRight &&
      playerPosition.y >= regionTop &&
      playerPosition.y <= regionBottom
    )
  }

  private getSpawnPositionAwayFromPlayer(
    region: Region,
    playerPosition: { x: number; y: number },
  ): { x: number; y: number } {
    const minDistance = 500
    let spawnPosition: { x: number; y: number }
    do {
      const regionLeft = region.center.x - region.bounds.width / 2
      const regionRight = region.center.x + region.bounds.width / 2
      const regionTop = region.center.y - region.bounds.height / 2
      const regionBottom = region.center.y + region.bounds.height / 2
      const spawnX = Math.random() * (regionRight - regionLeft) + regionLeft
      const spawnY = Math.random() * (regionBottom - regionTop) + regionTop
      spawnPosition = { x: spawnX, y: spawnY }
    } while (
      Math.hypot(
        spawnPosition.x - playerPosition.x,
        spawnPosition.y - playerPosition.y,
      ) < minDistance
    )

    return spawnPosition
  }

  private async spawnZombies(game: Game<false>, region: Region) {
    const players = Matter.Composite.allBodies(
      game.physics.engine.world,
    ).filter(
      b =>
        b.label === 'player' &&
        this.isPlayerInRegion({ x: b.position.x, y: b.position.y }, region),
    )
    if (players.length === 0) {
      this.stopRegionInterval(region)
      return
    }

    const zombies = Matter.Composite.allBodies(
      game.physics.engine.world,
    ).filter(b => b.label === 'zombie')
    if (zombies.length >= 30) return
    const spawnPromises = players.flatMap(player => {
      const playerPosition = { x: player.position.x, y: player.position.y }
      return Array.from({ length: region.difficulty }, async () => {
        const randomZombieTypeIndex = Math.floor(
          Math.random() * region.zombieTypes.length,
        )
        const randomZombieType = region.zombieTypes[randomZombieTypeIndex]
        const spawnPosition = this.getSpawnPositionAwayFromPlayer(
          region,
          playerPosition,
        )
        return game.spawn({
          entity: '@dreamlab/ZombieMob',
          args: randomZombieType as Record<string, unknown>,
          transform: { position: [spawnPosition.x, spawnPosition.y] },
          tags: [
            'net/replicated',
            'net/server-authoritative',
            'editor/doNotSave',
          ],
        })
      })
    })

    await Promise.all(spawnPromises)
  }

  public getRegions(): Region[] {
    return this.regions
  }
}

export const regionManager = new RegionManager()

regionManager.setRegions([
  {
    id: 'center',
    bounds: { width: 4_000, height: 1_100 },
    center: { x: 0, y: 4_000 },
    difficulty: 2,
    zombieTypes: [ZombieTypes[0]!, ZombieTypes[1]!],
  },
  {
    id: 'left',
    bounds: { width: 4_000, height: 1_100 },
    center: { x: -5_000, y: 4_000 },
    difficulty: 3,
    zombieTypes: [ZombieTypes[1]!, ZombieTypes[2]!],
  },
  {
    id: 'right',
    bounds: { width: 4_000, height: 1_100 },
    center: { x: 5_000, y: 4_000 },
    difficulty: 4,
    zombieTypes: [ZombieTypes[2]!, ZombieTypes[3]!],
  },
])
