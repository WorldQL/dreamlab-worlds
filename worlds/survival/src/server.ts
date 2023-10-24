import type { InitServer } from '@dreamlab.gg/core/sdk'
import { sharedInit } from './shared.js'

export const init: InitServer = async game => {
  await sharedInit(game)

  await game.spawn({
    entity: '@dreamlab/ArcherMob',
    args: {},
    transform: { position: [-1_250, 300] },
    tags: ['net/replicated'],
  })
}
