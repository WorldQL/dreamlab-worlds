/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const balls = [
  {
    entity: '@dreamlab/Solid', // bottom floor
    args: [5_000, 50],
    transform: {
      position: { x: 0, y: 2_000 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Freeform', // bottom floor
    args: [5_000, 500, "/worlds/mobtest/assets/img/platform11.png"],
    transform: {
      position: { x: 0, y: 2_050 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // bottom mob floor wall left
    args: [300, 50],
    transform: {
      position: { x: -1_500, y: 2_000 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // bottom mob floor wall right
    args: [300, 50],
    transform: {
      position: { x: 1_500, y: 2_000 },
      rotation: 90,
    },
  },
  ...Array.from({ length: 50 })
    .fill(null)
    .map(() => ({
      entity: '@dreamlab/BouncyBall',
      args: [50],
      transform: {
        position: { x: 0, y: 1_750 },
        rotation: 90,
      },
    })),
]
