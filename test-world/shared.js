// @ts-check
import { level } from "./level.js";

/** @type {import('@dreamlab.gg/core/dist/sdk').InitShared} */
export const sharedInit = async (game) => {
  await game.spawnMany(...level);
};
