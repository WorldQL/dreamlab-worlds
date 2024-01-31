import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'
import type { InitShared } from '@dreamlab.gg/core/sdk'

export const level: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Solid',
    args: { width: 5_000, height: 50 },
    transform: {
      position: { x: 0, y: 295 },
      rotation: 0,
    },
  },
]

export const sharedInit: InitShared = async game => {
  // Register custom spawnable entities here

  await game.spawnMany(...level)
}
