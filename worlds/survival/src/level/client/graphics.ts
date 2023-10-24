import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const images: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Background',
    args: {
      width: 5_760,
      height: 3_240,
      textureURL: '/worlds/mobtest/assets/img/groundbg.png',
      parallaxX: 0.1,
      parallaxY: 0.2,
    },
    transform: { position: [0, 0] },
  },
]
