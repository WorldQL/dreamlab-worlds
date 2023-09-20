/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level = [
  {
    entity: '@dreamlab/Solid', // spawn floor
    args: [1_000, 250],
    zIndex: 50,
    transform: {
      position: { x: 0, y: 400 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // left spawn wall
    args: [250, 50],
    transform: {
      position: { x: -475, y: -250 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // right spawn wall
    args: [250, 50],
    transform: {
      position: { x: 475, y: -250 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // right spawn wall
    args: [400, 50],
    transform: {
      position: { x: 475, y: -25 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // right spawn wall
    args: [400, 50],
    transform: {
      position: { x: -475, y: -25 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn roof
    args: [1_000, 50],
    transform: {
      position: { x: 0, y: -350 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn roof left
    args: [1_000, 50],
    transform: {
      position: { x: -350, y: -500 },
      rotation: 135,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn roof right
    args: [1_000, 50],
    transform: {
      position: { x: 350, y: -500 },
      rotation: 45,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn land
    args: [3_000, 150],
    transform: {
      position: { x: 0, y: 600 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Ladder', // right spawn ladder
    args: [100, 1_000],
    transform: { 
        position: [1_450, 25], 
        rotation: 0 
    },
  },
  {
    entity: '@dreamlab/Solid', // right well stand
    args: [100, 150],
    transform: {
      position: { x: -1_425, y: 475 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // left well stand
    args: [100, 150],
    transform: {
      position: { x: -1_825, y: 475 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid',   // left well floor
    args: [1_000, 150],
    transform: {
      position: { x: -2_250, y: 600 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well left pillar
    args: [500, 25],
    transform: {
      position: { x: -1_825, y: 175 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well right pillar
    args: [500, 25],
    transform: {
      position: { x: -1_425, y: 175 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well top
    args: [500, 100],
    transform: {
      position: { x: -1_625, y: -125 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // well wooden planks
    args: [265, 50],
    transform: {
      position: { x: -1_690, y: 450 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid',   // well left down
    args: [3_000, 100],
    transform: {
      position: { x: -1_800, y: 2_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid',   // well right down
    args: [3_000, 100],
    transform: {
      position: { x: -1_450, y: 2_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid',   // large left wall
    args: [3_000, 500],
    transform: {
      position: { x: -3_000, y: -825 },
      rotation: 90,
    },
  },
  // BOSS LEVEL BELOW
  {
    entity: '@dreamlab/Solid',   // left wall
    args: [1_000, 100],
    transform: {
      position: { x: -1_800, y: 4_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid',   // floor
    args: [3_000, 100],
    transform: {
      position: { x: -250, y: 4_620 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid',   // right wall
    args: [1_000, 100],
    transform: {
      position: { x: 1_300, y: 4_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid',   // ceiling
    args: [2_750, 100],
    transform: {
      position: { x: -25, y: 3_620 },
      rotation: 0,
    },
  },
]
