import type { InitClient } from "@dreamlab.gg/core/sdk"
import { isPlayer, isNetPlayer } from "@dreamlab.gg/core/entities"
import { sharedInit } from "./shared.ts"
import { ClickerUi } from "./ui.tsx"

export const init: InitClient = async game => {
  await sharedInit(game)

  // Destroy all players and networked players
  game.events.common.addListener("onInstantiate", entity => {
    if (isNetPlayer(entity)) game.destroy(entity)
    if (isPlayer(entity)) {
      game.destroy(entity)
      game.client.render.camera.clearTarget()
    }
  })

  game.instantiate(new ClickerUi())
}
