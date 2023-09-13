/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level = [
    {
      entity: '@dreamlab/Solid', // spawn floor
      args: [1_000, 50],
      transform: {
        position: { x: 0, y: 295 },
        rotation: 0,
      },
    },
    {
      entity: '@dreamlab/Solid', // left wall
      args: [5_000, 50],
      transform: {
        position: { x: -2_500, y: 295 },
        rotation: 90,
      },
    },
    {
      entity: '@dreamlab/Solid', // right wall
      args: [5_000, 50],
      transform: {
        position: { x: 2_500, y: 295 },
        rotation: 90,
      },
    },
    {
      entity: '@dreamlab/Solid', // bottom mob floor
      args: [3_000, 50],
      transform: {
        position: { x: 0, y: 1_000 },
        rotation: 0,
      },
    },
    {
      entity: '@dreamlab/Solid', // bottom mob floor wall left
      args: [100, 50],
      transform: {
        position: { x: -1_500, y: 1_000 },
        rotation: 90,
      },
    },
    {
      entity: '@dreamlab/Solid', // bottom mob floor wall right
      args: [100, 50],
      transform: {
        position: { x: 1_500, y: 1_000 },
        rotation: 90,
      },
    },
  ]
  