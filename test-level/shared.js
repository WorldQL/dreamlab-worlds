import { LevelSchema } from "@dreamlab.gg/core";
import TestLevel from "./test-level.json" assert { type: "json" };

export const sharedInit = async (game) => {
  await game.load(LevelSchema.parse(TestLevel));
};
