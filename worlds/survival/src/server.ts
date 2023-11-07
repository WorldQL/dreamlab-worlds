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

  let spawnInterval = 20 * 1_000
  let spawnTimeout: NodeJS.Timeout | number | string | undefined

  const zombieTypes = [
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

  const destroyAllMobs = async () => {
    clearTimeout(spawnTimeout)

    const mobs = game.entities.filter(entity => isZombie(entity))

    const destroyPromises = mobs.map(async (entity: Entity) => {
      return game.destroy(entity)
    })

    await Promise.all(destroyPromises)
  }

  const spawnZombies = async () => {
    const players = Matter.Composite.allBodies(
      game.physics.engine.world,
    ).filter(b => b.label === 'player')

    if (players.length === 0) {
      console.warn('No players found! Ending game...')
      await destroyAllMobs()
      return
    }

    const zombies = Matter.Composite.allBodies(
      game.physics.engine.world,
    ).filter(b => b.label === 'zombie')

    if (zombies.length >= 30) return

    const spawnPromises = []

    for (const player of players) {
      const playerPosition = player.position

      // Check if player's y position is greater than 3600
      if (playerPosition.y > 3_600) {
        const leftSpawnPosition: [number, number] = [
          playerPosition.x - 850,
          playerPosition.y,
        ]
        const rightSpawnPosition: [number, number] = [
          playerPosition.x + 850,
          playerPosition.y,
        ]

        // queue two zombies for each player to be spawned
        for (let index = 0; index < 2; index++) {
          const randomZombieType =
            zombieTypes[Math.floor(Math.random() * zombieTypes.length)]

          const spawnPromise = game.spawn({
            entity: '@dreamlab/ZombieMob',
            args: randomZombieType as Record<string, unknown>,
            transform: {
              position:
                index % 2 === 0 ? leftSpawnPosition : rightSpawnPosition,
            },
            tags: [
              'net/replicated',
              'net/server-authoritative',
              'editor/doNotSave',
            ],
          })

          spawnPromises.push(spawnPromise)
        }
      }
    }

    await Promise.all(spawnPromises)

    spawnInterval *= 0.9
    spawnInterval = Math.max(5 * 1_000, spawnInterval)

    spawnTimeout = setTimeout(spawnZombies, spawnInterval)
  }

  const onStartGame: MessageListenerServer = async () => {
    if (spawnTimeout) {
      return
    }

    await spawnZombies()
  }

  const onEndGame: MessageListenerServer = async () => {
    await destroyAllMobs()
  }

  netServer?.addCustomMessageListener(PLAY_CHANNEL, onStartGame)
  netServer?.addCustomMessageListener(END_CHANNEL, onEndGame)
}
