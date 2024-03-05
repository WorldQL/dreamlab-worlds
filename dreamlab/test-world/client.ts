import type { Game } from "@dreamlab.gg/core"
import { isEntity } from "@dreamlab.gg/core"

import { AssertionError } from "https://deno.land/std@0.213.0/assert/assertion_error.ts"

import { myUtilFunction, utilThrowAnError } from "./util.ts"
import { waitForPlayer } from "@dreamlab.gg/core/utils"

export const init = async (_game: Game<false>) => {
  console.log("Hello from init()!")
  myUtilFunction()

  const player = await waitForPlayer()
  if (!isEntity(player)) throw new AssertionError("player is somehow not an entity")
  console.log("got player!!")

  console.log("Here comes an error:")
  utilThrowAnError()
}
