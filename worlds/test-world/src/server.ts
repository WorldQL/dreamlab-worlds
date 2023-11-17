import type { InitServer } from '@dreamlab.gg/core/sdk'

export const init: InitServer = async game => {
  // since this is replicated it will get auto-spawned on clients as they join
  await game.spawn({
    entity: '@dreamlab/BouncyBall',
    args: { radius: 50 },
    transform: { position: [-375, -300] },
    tags: ['net/replicated'],
  })
}
