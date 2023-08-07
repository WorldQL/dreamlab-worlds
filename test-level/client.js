import { sharedInit } from "./shared.js";

export const init = async (game) => {
  await sharedInit(game);

  // TODO: register custom packet handlers, etc
};
