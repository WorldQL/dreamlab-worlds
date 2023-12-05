import type { Level } from '@dreamlab.gg/core/sdk'

export const level: Level = [
  {
    entity: '@dreamlab/Solid', // spawn land
    args: { width: 3_000, height: 150 },
    transform: {
      position: { x: 800, y: 600 },
      rotation: 0,
    },
    tags: ['editorLocked'],
  },
  {
    entity: '@dreamlab/Solid', // large right wall
    args: { width: 3_000, height: 500 },
    transform: {
      position: { x: 2_550, y: -825 },
      rotation: 90,
    },
    tags: ['editorLocked'],
  },
  {
    entity: '@dreamlab/Solid', // right well stand
    args: { width: 100, height: 150 },
    transform: {
      position: { x: -625, y: 475 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // left well stand
    args: { width: 100, height: 150 },
    transform: {
      position: { x: -1_025, y: 475 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // left well floor
    args: { width: 1_000, height: 150 },
    transform: {
      position: { x: -1_450, y: 600 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well left pillar
    args: { width: 500, height: 25 },
    transform: {
      position: { x: -1_025, y: 175 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well right pillar
    args: { width: 500, height: 25 },
    transform: {
      position: { x: -625, y: 175 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // well top
    args: { width: 500, height: 100 },
    transform: {
      position: { x: -825, y: -125 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // well wooden planks
    args: { width: 265, height: 50 },
    transform: {
      position: { x: -890, y: 450 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // well left down
    args: { width: 3_000, height: 100 },
    transform: {
      position: { x: -1_000, y: 2_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // well right down
    args: { width: 3_000, height: 100 },
    transform: {
      position: { x: -650, y: 2_170 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // large left wall
    args: { width: 3_000, height: 500 },
    transform: {
      position: { x: -2_200, y: -825 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // weapon 1 pillar
    args: { width: 200, height: 100 },
    transform: {
      position: { x: 800, y: 475 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // weapon 2 pillar
    args: { width: 200, height: 100 },
    transform: {
      position: { x: 1_300, y: 475 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Nonsolid', // weapon 3 pillar
    args: { width: 200, height: 100 },
    transform: {
      position: { x: 1_800, y: 475 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/InventoryItem', // weapon 1
    args: {
      width: 200,
      height: 200,
      spriteSource: '/worlds/survival/assets/items/bow.png',
      displayName: 'Basic Bow',
      lore: "Once wielded by 'Sharp-Eye' Sam, the fastest archer in the West, this bow's arrows are said to whistle with the winds of the prairie and never miss a zombie's heart.",
      animationName: 'bow',
      projectileType: 'SINGLE_SHOT',
    },
    transform: {
      position: { x: 800, y: 300 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/InventoryItem', // weapon 2
    args: {
      width: 200,
      height: 200,
      bone: 'handLeft',
      anchorX: 0.29,
      anchorY: 0.58,
      rotation: 45,
      spriteSource: '/worlds/survival/assets/items/hand_cannon.png',
      displayName: 'Scatter Shot Shotgun',
      lore: "Forged in a lawless frontier town, this shotgun's scatter shot was the bane of undead hordes, turning any cowboy into a one-person army against the zombie outbreak.",
      animationName: 'shoot',
      projectileType: 'SCATTER_SHOT',
    },
    transform: {
      position: { x: 1_300, y: 300 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/InventoryItem', // weapon 3
    args: {
      width: 200,
      height: 200,
      bone: 'handLeft',
      anchorX: 0.24,
      anchorY: 0.6,
      rotation: 60,
      spriteSource: '/worlds/survival/assets/items/classic_revolver.png',
      displayName: 'Burst Revolver',
      lore: "Crafted by the legendary gunsmith 'Bullseye' Betty, this revolver's rapid bursts made it a favorite among cowboys holding the line in the great zombie sieges of the Old West.",
      animationName: 'shoot',
      projectileType: 'BURST_SHOT',
    },
    transform: {
      position: { x: 1_800, y: 300 },
      rotation: 0,
    },
  },
  // MOBS
  {
    entity: '@dreamlab/Solid', // floor
    args: { width: 25_000, height: 200 },
    transform: {
      position: { x: 550, y: 4_620 },
      rotation: 0,
    },
  },
]
