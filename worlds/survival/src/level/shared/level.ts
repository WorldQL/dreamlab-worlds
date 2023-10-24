import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const level: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Solid', // spawn land
    args: { width: 10_000, height: 150 },
    transform: {
      position: { x: 0, y: 600 },
      rotation: 0,
    },
  },
]
