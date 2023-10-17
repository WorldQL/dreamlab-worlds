import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const map1: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Hook',
    args: {
      width: 50,
      height: 50,
      mustConnectWithBody: true,
      spriteSource: '/worlds/mobtest/assets/img/grappleHook.png',
    },
    transform: {
      position: { x: 0, y: 0 },
      rotation: 0,
    },
  },
]
