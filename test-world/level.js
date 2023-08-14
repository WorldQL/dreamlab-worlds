// @ts-check

/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level = [
  {
    entity: "@dreamlab/Solid",
    args: [1290, 50],
    transform: {
      position: [0, 295],
    },
  },
  {
    entity: "@dreamlab/Solid",
    args: [50, 400],
    transform: {
      position: [620, 70],
    },
  },
  {
    entity: "@dreamlab/Solid",
    args: [50, 400],
    transform: {
      position: [-620, 70],
    },
  },
  {
    entity: "@dreamlab/Solid",
    args: [100, 100],
    transform: {
      position: [-400, 120],
      rotation: 45,
    },
  },
  {
    entity: "@dreamlab/Nonsolid",
    args: [100, 100],
    transform: {
      position: [400, 120],
      rotation: -45,
    },
  },
];
