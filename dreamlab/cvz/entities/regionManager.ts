import { Entity, isSpawnableEntity } from "@dreamlab.gg/core"
import { game } from "@dreamlab.gg/core/labs"
import type { MessageListenerServer } from "@dreamlab.gg/core/network"
import { onlyNetClient, onlyNetServer } from "@dreamlab.gg/core/network"
import Matter from "matter-js"
import { events } from "../events.ts"

export interface Region {
  uid: string
  zombieTypes: {
    width: number
    height: number
    maxHealth: number
    speed: number
    knockback: number
  }[]
  position: { x: number; y: number }
  width: number
  height: number
  waves: number
  zombiesPerWave: number
  waveInterval: number
  endCooldown: number
  currentWave: number
  isInCooldown: boolean
  spawnIntervalId: NodeJS.Timeout | undefined
}

const stopRegionInterval = (region: Region) => {
  if (region.spawnIntervalId) {
    clearInterval(region.spawnIntervalId)
  }

  region.spawnIntervalId = undefined
  events.emit("onRegionEnd", region.uid)
}

const isPlayerInRegion = (playerPosition: { x: number; y: number }, region: Region) => {
  const buffer = 300
  const isWithinXBounds =
    playerPosition.x >= region.position.x - region.width / 2 - buffer &&
    playerPosition.x <= region.position.x + region.width / 2 + buffer

  const isWithinYBounds =
    playerPosition.y >= region.position.y - region.height / 2 - buffer &&
    playerPosition.y <= region.position.y + region.height / 2 + buffer

  return isWithinXBounds && isWithinYBounds
}

const getSpawnPosition = (region: Region) => {
  const regionLeft = region.position.x - region.width / 2
  const regionRight = region.position.x + region.width / 2
  const regionTop = region.position.y - region.height / 2
  const regionBottom = region.position.y + region.height / 2

  const randomX = Math.random() * (regionRight - regionLeft) + regionLeft
  const randomY = Math.random() * (regionBottom - regionTop) + regionTop

  return { x: randomX, y: randomY }
}

const regions: Map<string, Region> = new Map()
const START_CHANNEL = "@cvz/Region/Start"
const END_CHANNEL = "@cvz/Region/End"

const onInstantiateRegion = (entity: Entity) => {
  if (!isSpawnableEntity(entity)) return
  if (entity.definition.entity.includes("SpawnRegion")) {
    const regionArgs = entity.args
    const region = {
      uid: entity.uid,
      position: entity.transform.position,
      width: regionArgs.width,
      height: regionArgs.height,
      zombieTypes: regionArgs.zombieTypes,
      zombiesPerWave: regionArgs.zombiesPerWave,
      waves: regionArgs.waves,
      waveInterval: regionArgs.waveInterval,
      endCooldown: regionArgs.endCooldown,
      currentWave: 0,
      isInCooldown: false,
      spawnIntervalId: undefined
    }
    regions.set(region.uid, region)
  }
}

const onUpdateRegion = (entity: Entity) => {
  if (!isSpawnableEntity(entity)) return
  if (!entity.definition.entity.includes("SpawnRegion")) return

  const regionArgs = entity.args
  const updatedRegion = {
    uid: entity.uid,
    position: entity.transform.position,
    zombieTypes: regionArgs.zombieTypes,
    bounds: regionArgs.bounds,
    zombiesPerWave: regionArgs.zombiesPerWave,
    waves: regionArgs.waves,
    waveInterval: regionArgs.waveInterval,
    endCooldown: regionArgs.endCooldown,
    currentWave: 0,
    isInCooldown: false,
    spawnIntervalId: undefined
  }

  if (regions.has(updatedRegion.uid)) {
    const existingRegion = regions.get(updatedRegion.uid)
    if (existingRegion) {
      regions.set(updatedRegion.uid, {
        ...existingRegion,
        ...updatedRegion
      })
    }
  }
}

// eslint-disable-next-line no-empty-pattern
const onServerRegionEnd: MessageListenerServer = async ({}, _, data) => {
  const { uid } = data as {
    uid: string
  }
  const region = regions.get(uid)
  if (region) stopRegionInterval(region)
}

export class RegionManager extends Entity {
  public constructor() {
    super()

    const netClient = onlyNetClient(game())
    const netServer = onlyNetServer(game())

    const spawnZombies = async (region: Region) => {
      const zombies = Matter.Composite.allBodies(game().physics.engine.world).filter(
        b => b.label === "zombie"
      )
      if (zombies.length >= 30) return

      events.emit("onRegionWaveStart", region.uid)
      const zombieCount = region.zombiesPerWave

      const delay = async (ms: number) =>
        new Promise(resolve => {
          setTimeout(resolve, ms)
        })

      const positions: { x: number; y: number }[] = []
      for (let idx = 0; idx < zombieCount; idx++) {
        const spawnPosition = getSpawnPosition(region)
        positions.push(spawnPosition)
      }

      events.emit("onRegionZombieSpawning", positions)

      await delay(3_000)
      const spawnPromises = positions.map(async spawnPosition => {
        const randomZombieTypeIndex = Math.floor(Math.random() * region.zombieTypes.length)
        const randomZombieType = region.zombieTypes[randomZombieTypeIndex]

        return game().spawn({
          entity: "@cvz/ZombieMob",
          args: randomZombieType as Record<string, unknown>,
          transform: {
            position: [spawnPosition.x, spawnPosition.y],
            zIndex: 5
          },
          tags: ["net/replicated", "net/server-authoritative", "editor/doNotSave"]
        })
      })

      await Promise.all(spawnPromises)
    }

    const manageRegionWaves = async (region: Region) => {
      if (region.currentWave >= region.waves) {
        if (!region.isInCooldown) {
          region.isInCooldown = true
          events.emit("onRegionCooldownStart", region.uid)
          setTimeout(() => {
            region.isInCooldown = false
            region.currentWave = 0
            events.emit("onRegionCooldownEnd", region.uid)
            stopRegionInterval(region)
          }, region.endCooldown * 1_000)
        }
      } else {
        await spawnZombies(region)
        region.currentWave++
        // If there are more waves to handle, set up the next call
        if (region.currentWave < region.waves) {
          const interval = setTimeout(
            async () => manageRegionWaves(region),
            Math.max(region.waveInterval - 3, 0) * 1_000
          )
          region.spawnIntervalId = interval
        } else {
          // Handle cooldown if this was the last wave
          await manageRegionWaves(region)
        }
      }
    }

    const onServerRegionStart: MessageListenerServer = async (
      // eslint-disable-next-line no-empty-pattern
      {},
      _,
      data
    ) => {
      if (!netServer) throw new Error("missing network")
      const { uid } = data as {
        uid: string
      }
      const region = regions.get(uid)
      if (region) {
        if (region.isInCooldown || region.spawnIntervalId) {
          return
        }

        await manageRegionWaves(region)
        events.emit("onRegionStart", region.uid)
      }
    }

    const onEnterRegion = async (uid: string) => {
      const region = regions.get(uid)
      if (!region) return

      await netClient?.sendCustomMessage(START_CHANNEL, { uid })
    }

    const onExitRegion = async (uid: string) => {
      const region = regions.get(uid)
      if (!region) return

      const players = Matter.Composite.allBodies(game().physics.engine.world).filter(
        b => b.label === "player" && isPlayerInRegion({ x: b.position.x, y: b.position.y }, region)
      )
      if (players.length === 0) {
        await netClient?.sendCustomMessage(END_CHANNEL, { uid })
      }
    }

    netServer?.addCustomMessageListener(START_CHANNEL, onServerRegionStart)
    netServer?.addCustomMessageListener(END_CHANNEL, onServerRegionEnd)

    game().events.common.addListener("onInstantiate", onInstantiateRegion)
    game().events.common.addListener("onArgsChanged", onUpdateRegion)

    events.addListener("onEnterRegion", onEnterRegion)
    events.addListener("onExitRegion", onExitRegion)
  }

  public override teardown(): void {
    const netServer = onlyNetServer(game())
    // netServer?.removeCustomMessageListener(START_CHANNEL, onServerRegionStart)
    netServer?.removeCustomMessageListener(END_CHANNEL, onServerRegionEnd)

    game().events.common.removeListener("onInstantiate", onInstantiateRegion)
    game().events.common.removeListener("onArgsChanged", onUpdateRegion)
  }
}
