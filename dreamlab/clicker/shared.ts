import type { InitShared } from "@dreamlab.gg/core/sdk"
import { Clicker, ClickerArgs } from "./clicker.ts"

export const sharedInit: InitShared = game => {
  game.register("@clicker/Clicker", Clicker, ClickerArgs)

  game.spawn({
    entity: "@clicker/Clicker",
    args: {},
    transform: { position: [0, 0] }
  })
}
