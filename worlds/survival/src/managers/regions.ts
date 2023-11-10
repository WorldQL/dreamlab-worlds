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
  zombieTypes: typeof ZombieTypes
  bounds: { width: number; height: number }
  center: { x: number; y: number }
  difficulty: number
  waves: number
  waveInterval: number
  endCooldown: number
  isInCooldown?: boolean
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

    let currentWave = 0

    const spawn = async () => {
      if (currentWave < region.waves) {
        await this.spawnZombies(game, region)
        currentWave++
      } else {
        this.stopRegionInterval(region)
        region.isInCooldown = true
        setTimeout(async () => {
          currentWave = 0
          region.isInCooldown = false
          await this.startRegionInterval(game, region)
        }, region.endCooldown * 1_000)
        return
      }

      const newSpawnIntervalId = setTimeout(spawn, region.waveInterval * 1_000)
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

    const additionalZombies = Math.floor(players.length / 2)
    const zombieCount = region.difficulty + additionalZombies

    const spawnPromises = players.flatMap(player => {
      const playerPosition = { x: player.position.x, y: player.position.y }
      return Array.from({ length: zombieCount }, async () => {
        const randomZombieTypeIndex =
          Math.random() < 0.7
            ? Math.floor(Math.random() * region.zombieTypes.length)
            : region.zombieTypes.length - 1
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
    zombieTypes: [ZombieTypes[0]!, ZombieTypes[1]!],
    bounds: { width: 4_000, height: 1_100 },
    center: { x: 0, y: 4_000 },
    difficulty: 2,
    waves: 2,
    waveInterval: Math.random() * (15 - 5) + 5,
    endCooldown: 60,
  },
  {
    id: 'left',
    zombieTypes: [ZombieTypes[1]!, ZombieTypes[2]!],
    bounds: { width: 4_000, height: 1_100 },
    center: { x: -5_000, y: 4_000 },
    difficulty: 3,
    waves: 2,
    waveInterval: Math.random() * (15 - 5) + 5,
    endCooldown: 60,
  },
  {
    id: 'right',
    zombieTypes: [ZombieTypes[2]!, ZombieTypes[3]!],
    bounds: { width: 4_000, height: 1_100 },
    center: { x: 5_000, y: 4_000 },
    difficulty: 4,
    waves: 1,
    waveInterval: Math.random() * (15 - 5) + 5,
    endCooldown: 200,
  },
])
