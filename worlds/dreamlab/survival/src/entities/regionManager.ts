import type { Entity, Game } from '@dreamlab.gg/core'
import { createEntity, isSpawnableEntity } from '@dreamlab.gg/core'
import { isNetPlayer } from '@dreamlab.gg/core/dist/entities'
import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetClient, onlyNetServer } from '@dreamlab.gg/core/dist/network'
import Matter from 'matter-js'
import { events } from '../events'

interface Data {
  game: Game<false>
  onHitServer: MessageListenerServer
}

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
  currentWave: number
  isInCooldown?: boolean
  spawnIntervalId?: NodeJS.Timeout
}

export interface RegionManager extends Entity<Data> {}

const stopRegionInterval = (region: Region) => {
  if (region.spawnIntervalId) {
    clearInterval(region.spawnIntervalId)
  }

  region.spawnIntervalId = undefined
}

const isPlayerInRegion = (
  playerPosition: { x: number; y: number },
  region: Region,
) => {
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

const getSpawnPositionAwayFromPlayer = (
  region: Region,
  playerPosition: { x: number; y: number },
) => {
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

export const createRegionManager = () => {
  const regions: Map<string, Region> = new Map()
  const SPAWNED_CHANNEL = '@cvz/Zombie/Spawned'

  const onInstantiateRegion = (entity: Entity) => {
    if (!isSpawnableEntity(entity)) return
    if (entity.definition.entity.includes('SpawnRegion')) {
      const regionArgs = entity.args
      const region = {
        uid: entity.uid,
        zombieTypes: regionArgs.zombieTypes,
        bounds: regionArgs.bounds,
        center: regionArgs.center,
        difficulty: regionArgs.difficulty,
        waves: regionArgs.waves,
        waveInterval: regionArgs.waveInterval,
        endCooldown: regionArgs.endCooldown,
        currentWave: 0,
      }
      regions.set(region.uid, region)
    }
  }

  const onUpdateRegion = (entity: Entity) => {
    if (!isSpawnableEntity(entity)) return
    if (!entity.definition.entity.includes('SpawnRegion')) return

    const regionArgs = entity.args
    const updatedRegion = {
      uid: entity.uid,
      zombieTypes: regionArgs.zombieTypes,
      bounds: regionArgs.bounds,
      center: regionArgs.center,
      difficulty: regionArgs.difficulty,
      waves: regionArgs.waves,
      waveInterval: regionArgs.waveInterval,
      endCooldown: regionArgs.endCooldown,
      currentWave: 0,
    }

    if (regions.has(updatedRegion.uid)) {
      const existingRegion = regions.get(updatedRegion.uid)
      if (existingRegion) {
        regions.set(updatedRegion.uid, {
          ...existingRegion,
          ...updatedRegion,
        })
      }
    }
  }

  const regionManager: RegionManager = createEntity({
    async init({ game }) {
      const netClient = onlyNetClient(game)
      const netServer = onlyNetServer(game)

      const spawnZombies = async (region: Region) => {
        const players = Matter.Composite.allBodies(
          game.physics.engine.world,
        ).filter(
          b =>
            b.label === 'player' &&
            isPlayerInRegion({ x: b.position.x, y: b.position.y }, region),
        )
        if (players.length === 0) {
          stopRegionInterval(region)
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
            const spawnPosition = getSpawnPositionAwayFromPlayer(
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

      const onHitServer: MessageListenerServer = async (
        { peerID },
        _,
        data,
      ) => {
        if (!netServer) throw new Error('missing network')
        const player = game.entities
          .filter(isNetPlayer)
          .find(netplayer => netplayer.peerID === peerID)
        if (!player) throw new Error('missing netplayer')
        const { uid } = data as {
          uid: string
        }
        const region = regions.get(uid)
        if (region?.spawnIntervalId) return
        const spawn = async () => {
          if (!region) return
          if (region.currentWave < region.waves) {
            await spawnZombies(region)
            region.currentWave++
          } else {
            stopRegionInterval(region)
            region.isInCooldown = true
            setTimeout(async () => {
              region.currentWave = 0
              region.isInCooldown = false
              events.emit('onRegionStart', region.uid)
            }, region.endCooldown * 1_000)
            return
          }

          const newSpawnIntervalId = setTimeout(
            spawn,
            region.waveInterval * 1_000,
          )
          region.spawnIntervalId = newSpawnIntervalId
        }

        await spawn()
      }

      const onStartRegion = async (uid: string) => {
        const region = regions.get(uid)
        if (!region) return

        if (region.isInCooldown || region.spawnIntervalId) {
          return
        }

        await netClient?.sendCustomMessage(SPAWNED_CHANNEL, { uid })
      }

      const onEndRegion = async (uid: string) => {
        const region = regions.get(uid)
        if (!region) return

        const players = Matter.Composite.allBodies(
          game.physics.engine.world,
        ).filter(
          b =>
            b.label === 'player' &&
            isPlayerInRegion({ x: b.position.x, y: b.position.y }, region),
        )
        if (players.length === 0) {
          stopRegionInterval(region)
        }
      }

      netServer?.addCustomMessageListener(SPAWNED_CHANNEL, onHitServer)

      game.events.common.addListener('onInstantiate', onInstantiateRegion)
      game.events.common.addListener('onArgsChanged', onUpdateRegion)

      events.addListener('onRegionStart', onStartRegion)
      events.addListener('onRegionEnd', onEndRegion)

      return { game, onHitServer }
    },

    async initRenderContext() {},

    teardown({ game, onHitServer }) {
      const netServer = onlyNetServer(game)
      netServer?.removeCustomMessageListener(SPAWNED_CHANNEL, onHitServer)

      game.events.common.removeListener('onInstantiate', onInstantiateRegion)
      game.events.common.removeListener('onArgsChanged', onUpdateRegion)
    },

    teardownRenderContext() {},
  })

  return regionManager
}
