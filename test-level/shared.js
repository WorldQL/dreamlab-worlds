import { LevelSchema } from "@dreamlab.gg/core";
import TestLevel from "./test-level.js";

export const sharedInit = async (game) => {
  await game.load(LevelSchema.parse(TestLevel));
};
