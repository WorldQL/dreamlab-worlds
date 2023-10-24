import type { Entity } from '@dreamlab.gg/core'
import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetServer } from '@dreamlab.gg/core/dist/network'
import type { InitServer } from '@dreamlab.gg/core/sdk'
import { isZombie } from './entities/shared/mobs/zombie.js'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)

  const PLAY_CHANNEL = 'game/start'
  const END_CHANNEL = 'game/end'
  const netServer = onlyNetServer(game)

  let spawnInterval = 30 * 1_000
  let spawnTimeout: NodeJS.Timeout | number | string | undefined

  const destroyAllMobs = async () => {
    clearTimeout(spawnTimeout)

    const mobs = game.entities.filter(entity => isZombie(entity))

    const destroyPromises = mobs.map(async (entity: Entity) => {
      return game.destroy(entity)
    })

    await Promise.all(destroyPromises)
  }

  const spawnZombies = async () => {
    await game.spawn({
      entity: '@dreamlab/ZombieMob',
      args: {},
      transform: { position: [-1_250, 300] },
      tags: ['net/replicated'],
    })

    await game.spawn({
      entity: '@dreamlab/ZombieMob',
      args: {},
      transform: { position: [1_000, 300] },
      tags: ['net/replicated'],
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
