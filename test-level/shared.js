// @ts-check
import { LevelSchema } from "@dreamlab.gg/core";
import TestLevel from "./test-level.js";

/** @type {import('@dreamlab.gg/core/dist/sdk').InitShared} */
export const sharedInit = async (game) => {
  await game.load(LevelSchema.parse(TestLevel));
};
