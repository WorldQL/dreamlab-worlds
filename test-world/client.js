// @ts-check
import { sharedInit } from "./shared.js";

/** @type {import('@dreamlab.gg/core/dist/sdk').InitClient} */
export const init = async (game) => {
  await sharedInit(game);

  // TODO: register custom packet handlers, etc
};
