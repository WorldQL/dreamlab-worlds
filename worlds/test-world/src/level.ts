import { Level } from '@dreamlab.gg/core/sdk'

export const level: Level = [
  {
    entity: '@dreamlab/Solid',
    args: { width: 1_290, height: 50 },
    transform: {
      position: [0, 295],
    },
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 50, height: 400 },
    transform: {
      position: [620, 70],
    },
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 50, height: 400 },
    transform: {
      position: [-620, 70],
    },
  },
  {
    entity: '@dreamlab/Solid',
    args: { width: 100, height: 100 },
    transform: {
      position: [-400, 120],
      rotation: 45,
    },
  },
  {
    entity: '@dreamlab/Nonsolid',
    args: { width: 100, height: 100 },
    transform: {
      position: [400, 120],
      rotation: -45,
    },
  },
]
