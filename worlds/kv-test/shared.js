export const level = [
  {
    entity: '@dreamlab/Solid',
    args: [5_000, 50],
    transform: {
      position: { x: 0, y: 295 },
      rotation: 0,
    },
  },
]

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  await game.spawnMany(...level)
}
