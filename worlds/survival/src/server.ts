import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetServer } from '@dreamlab.gg/core/dist/network'
import type { InitServer } from '@dreamlab.gg/core/sdk'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)

  const PLAY_CHANNEL = 'game/start'

  const netServer = onlyNetServer(game)

  const onStartGame: MessageListenerServer = async () => {
    await game.spawn({
      entity: '@dreamlab/ArcherMob',
      args: {},
      transform: { position: [-1_250, 300] },
      tags: ['net/replicated'],
    })
    await game.spawn({
      entity: '@dreamlab/ArcherMob',
      args: {},
      transform: { position: [1_000, 300] },
      tags: ['net/replicated'],
    })
  }

  netServer?.addCustomMessageListener(PLAY_CHANNEL, onStartGame)
}
