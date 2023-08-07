import { sharedInit } from "./shared.js";

export const init = async (game) => {
  await sharedInit(game);

  await game.spawn({
    entityFn: "createBouncyBall",
    args: [50], // radius
    transform: { position: [-375, -300] },
    tags: ["net/replicated"],
  });

  // since this is replicated it will get auto-spawned on clients as they join
};
