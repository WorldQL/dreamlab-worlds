import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const images: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Background',
    args: [5_760, 3_240, '/worlds/mobtest/assets/img/groundbg.png', 0.1, 0.2],
    transform: { position: [0, 0] },
  },
]
