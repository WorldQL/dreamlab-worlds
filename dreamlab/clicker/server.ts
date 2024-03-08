import type { InitServer } from "@dreamlab.gg/core/sdk"
import { isNetPlayer } from "@dreamlab.gg/core/entities"
import { sharedInit } from "./shared.ts"

export const init: InitServer = async game => {
  await sharedInit(game)

  // Destroy all networked players
  game.events.common.addListener("onInstantiate", entity => {
    if (isNetPlayer(entity)) game.destroy(entity)
  })
}
