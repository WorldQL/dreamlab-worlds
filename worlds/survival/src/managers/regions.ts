import type { Game } from '@dreamlab.gg/core'
import Matter from 'matter-js'

export interface Region {
  uid: string
  zombieTypes: {
    width: number
    height: number
    maxHealth: number
    speed: number
    knockback: number
  }[]
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
  private regions: Map<string, Region> = new Map()

  public addRegion(region: Region) {
    this.regions.set(region.uid, region)
  }

  public setRegions(newRegions: Region[]) {
    for (const region of newRegions) this.regions.set(region.uid, region)
  }

  public findRegionByPlayerLocation(playerPosition: {
    x: number
    y: number
  }): Region | undefined {
    for (const region of this.regions.values()) {
      if (this.isPlayerInRegion(playerPosition, region)) {
        return region
      }
    }

    return undefined
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

  public updateRegion(uid: string, updatedRegion: Region) {
    if (this.regions.has(uid)) {
      const existingRegion = this.regions.get(uid)
      if (existingRegion) {
        this.regions.set(uid, { ...existingRegion, ...updatedRegion })
      }
    }
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
          entity: '@cvz/ZombieMob',
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
    return [...this.regions.values()]
  }
}

export const regionManager = new RegionManager()
