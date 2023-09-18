/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level2 = [
  {
    entity: '@dreamlab/Solid', // spawn floor 2 (right)
    args: [650, 50],
    transform: {
      position: { x: 1_200, y: 295 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Freeform', // spawn floor 2 (right) image
    args: [1_000, 1_000, '/worlds/mobtest/assets/img/platform23.png'],
    transform: {
      position: { x: 1_000, y: 295 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn floor 3 (left)
    args: [1_000, 50],
    transform: {
      position: { x: -1_200, y: 295 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Freeform', // spawn floor 3 (left) image
    args: [1_000, 1_000, '/worlds/mobtest/assets/img/platform20.png'],
    transform: {
      position: { x: -1_200, y: 295 },
      rotation: 0,
    },
  },
]
