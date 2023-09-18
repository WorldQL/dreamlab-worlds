/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const images = [
  {
    entity: '@dreamlab/Background',
    args: [5_760, 3_240, '/worlds/mobtest/assets/img/groundbg.png', 0.1, 0.2],
    transform: { position: [0, 0] },
  },
  {
    entity: '@dreamlab/Freeform', // ball bottom floor
    args: [5_000, 500, '/worlds/mobtest/assets/img/platform11.png'],
    transform: {
      position: { x: 0, y: 2_050 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Freeform', // spawn floor
    args: [1_000, 250, '/worlds/mobtest/assets/img/platform5.png'],
    zIndex: 50,
    transform: {
      position: { x: 0, y: 395 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Freeform', // bottom mob floor
    args: [3_000, 500, '/worlds/mobtest/assets/img/platform5.png'],
    transform: {
      position: { x: 0, y: 1_200 },
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
    entity: '@dreamlab/Freeform', // spawn floor 3 (left) image
    args: [1_000, 1_000, '/worlds/mobtest/assets/img/platform20.png'],
    transform: {
      position: { x: -1_200, y: 295 },
      rotation: 0,
    },
  },
]
