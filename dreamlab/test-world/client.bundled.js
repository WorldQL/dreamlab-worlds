// runtime/worlds/dreamlab/test-world/client.ts
import { isEntity } from "@dreamlab.gg/core";

// https://deno.land/std@0.213.0/assert/assertion_error.ts
var AssertionError = class extends Error {
  /** Constructs a new instance. */
  constructor(message) {
    super(message);
    this.name = "AssertionError";
  }
};

// runtime/worlds/dreamlab/test-world/util.ts
var myUtilFunction = () => {
  console.log("hello from the util function");
};
var utilThrowAnError = () => {
  throw new Error("this is an error from the util module");
};

// runtime/worlds/dreamlab/test-world/client.ts
import { waitForPlayer } from "@dreamlab.gg/core/utils";
var init = async (_game) => {
  console.log("Hello from init()!");
  myUtilFunction();
  const player = await waitForPlayer();
  if (!isEntity(player))
    throw new AssertionError("player is somehow not an entity");
  console.log("got player!!");
  console.log("Here comes an error:");
  utilThrowAnError();
};
export {
  init
};
//# sourceMappingURL=client.bundled.js.map
