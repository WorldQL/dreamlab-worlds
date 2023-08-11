// @ts-check
import Level from "./level.js";

/** @type {import('@dreamlab.gg/core/dist/sdk').InitShared} */
export const sharedInit = async (game) => {
  await game.spawnMany(Level);
};
