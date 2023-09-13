/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level2 = [
    {
      entity: '@dreamlab/Solid', // spawn floor 2 (right)
      args: [1_000, 50],
      transform: {
        position: { x: 1_200, y: 295 },
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
  ]
  