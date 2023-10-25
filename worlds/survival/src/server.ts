import type { Entity } from '@dreamlab.gg/core'
import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetServer } from '@dreamlab.gg/core/dist/network'
import type { InitServer } from '@dreamlab.gg/core/sdk'
import Matter from 'matter-js'
import { isZombie } from './entities/shared/mobs/zombie.js'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)

  const PLAY_CHANNEL = 'game/start'
  const END_CHANNEL = 'game/end'
  const netServer = onlyNetServer(game)

  let spawnInterval = 30 * 1_000
  let spawnTimeout: NodeJS.Timeout | number | string | undefined

  const zombieTypes = [
    {
      width: 80,
      height: 100,
      maxHealth: 2,
      speed: 5,
    }, // babyZombie
    {
      width: 80,
      height: 260,
      maxHealth: 1,
      speed: 2,
    }, // weakZombie
    {
      width: 130,
      height: 260,
      maxHealth: 4,
      speed: 3,
    }, // zombie
    {
      width: 130,
      height: 380,
      maxHealth: 10,
      speed: 2,
    }, // strongZombie
  ]

  const destroyAllMobs = async () => {
    clearTimeout(spawnTimeout)

    const mobs = game.entities.filter(entity => isZombie(entity))

    const destroyPromises = mobs.map(async (entity: Entity) => {
      return game.destroy(entity)
    })

    await Promise.all(destroyPromises)
  }

  const spawnZombies = async () => {
    const player = Matter.Composite.allBodies(game.physics.engine.world).find(
      b => b.label === 'player',
    )

    if (!player) {
      console.warn(
        "No player found! Zombies can't be spawned relative to the player.",
      )
      return
    }

    const playerPosition = player.position
    const leftSpawnPosition: [number, number] = [
      playerPosition.x - 800,
      playerPosition.y,
    ]
    const rightSpawnPosition: [number, number] = [
      playerPosition.x + 800,
      playerPosition.y,
    ]

    await game.spawn({
      entity: '@dreamlab/ZombieMob',
      args: zombieTypes[
        Math.floor(Math.random() * zombieTypes.length)
      ] as Record<string, unknown>,
      transform: { position: leftSpawnPosition },
      tags: ['net/replicated', 'net/server-authoritative'],
    })

    await game.spawn({
      entity: '@dreamlab/ZombieMob',
      args: zombieTypes[
        Math.floor(Math.random() * zombieTypes.length)
      ] as Record<string, unknown>,
      transform: { position: rightSpawnPosition },
      tags: ['net/replicated', 'net/server-authoritative'],
    })

    spawnInterval *= 0.9
    spawnInterval = Math.max(5 * 1_000, spawnInterval)

    spawnTimeout = setTimeout(spawnZombies, spawnInterval)
  }

  const onStartGame: MessageListenerServer = async () => {
    await spawnZombies()
  }

  const onEndGame: MessageListenerServer = async () => {
    await destroyAllMobs()
  }

  netServer?.addCustomMessageListener(PLAY_CHANNEL, onStartGame)
  netServer?.addCustomMessageListener(END_CHANNEL, onEndGame)
}
