import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const level: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Solid', // spawn land
    args: { width: 3_000, height: 150 },
    transform: {
      position: { x: 0, y: 600 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Ladder', // right spawn ladder
    args: { width: 100, height: 1_000 },
    transform: {
      position: [1_450, 25],
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // right well stand
    args: { width: 100, height: 150 },
    transform: {
      position: { x: -1_425, y: 475 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // left well stand
    args: { width: 100, height: 150 },
    transform: {
      position: { x: -1_825, y: 475 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // left well floor
    args: { width: 1_000, height: 150 },
    transform: {
      position: { x: -2_250, y: 600 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well left pillar
    args: { width: 500, height: 25 },
    transform: {
      position: { x: -1_825, y: 175 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well right pillar
    args: { width: 500, height: 25 },
    transform: {
      position: { x: -1_425, y: 175 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well top
    args: { width: 500, height: 100 },
    transform: {
      position: { x: -1_625, y: -125 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // well wooden planks
    args: { width: 265, height: 50 },
    transform: {
      position: { x: -1_690, y: 450 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // well left down
    args: { width: 3_000, height: 100 },
    transform: {
      position: { x: -1_800, y: 2_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // well right down
    args: { width: 3_000, height: 100 },
    transform: {
      position: { x: -1_450, y: 2_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // large left wall
    args: { width: 3_000, height: 500 },
    transform: {
      position: { x: -3_000, y: -825 },
      rotation: 90,
    },
  },
  // BOSS LEVEL BELOW
  {
    entity: '@dreamlab/Solid', // left wall
    args: { width: 1_000, height: 100 },
    transform: {
      position: { x: -1_800, y: 4_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // floor
    args: { width: 3_000, height: 100 },
    transform: {
      position: { x: -250, y: 4_620 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // right wall
    args: { width: 1_000, height: 100 },
    transform: {
      position: { x: 1_300, y: 4_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // ceiling
    args: { width: 2_750, height: 100 },
    transform: {
      position: { x: -25, y: 3_620 },
      rotation: 0,
    },
  },
]
