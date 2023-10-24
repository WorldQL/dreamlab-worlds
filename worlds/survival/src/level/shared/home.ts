import type { LooseSpawnableDefinition } from '@dreamlab.gg/core'

export const level: LooseSpawnableDefinition[] = [
  {
    entity: '@dreamlab/Solid', // spawn floor
    args: { width: 1_000, height: 250 },
    zIndex: 50,
    transform: {
      position: { x: 0, y: 400 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/PickupItem',
    args: {
      width: 200,
      height: 200,
      spriteSource: '/worlds/mobtest/assets/img/bow.png',
      itemDisplayName: 'Gold Bow',
      animationName: 'bow',
    },
    transform: {
      position: { x: 1_000, y: 400 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // left spawn wall
    args: { width: 250, height: 50 },
    transform: {
      position: { x: -475, y: -250 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // right spawn wall
    args: { width: 250, height: 50 },
    transform: {
      position: { x: 475, y: -250 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // right spawn wall
    args: { width: 400, height: 50 },
    transform: {
      position: { x: 475, y: -25 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/BreakableSolid', // right spawn wall
    args: { width: 400, height: 50 },
    transform: {
      position: { x: -475, y: -25 },
      rotation: 90,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn roof
    args: { width: 1_000, height: 50 },
    transform: {
      position: { x: 0, y: -350 },
      rotation: 0,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn roof left
    args: { width: 1_000, height: 50 },
    transform: {
      position: { x: -350, y: -500 },
      rotation: 135,
    },
  },
  {
    entity: '@dreamlab/Solid', // spawn roof right
    args: { width: 1_000, height: 50 },
    transform: {
      position: { x: 350, y: -500 },
      rotation: 45,
    },
  },
]
