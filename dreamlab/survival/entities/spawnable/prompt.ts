import type { SpawnableContext } from "@dreamlab.gg/core"
import type { EventHandler } from "@dreamlab.gg/core/dist/events"
import { game, events as magicEvent } from "@dreamlab.gg/core/dist/labs"
import { Solid, SolidArgs } from "@dreamlab.gg/core/entities"
import { z } from "@dreamlab.gg/core/sdk"
import { events } from "../../events.ts"

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  message: z.string().default("Default Message Text")
})

type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">
type OnPlayerCollisionEnd = EventHandler<"onPlayerCollisionEnd">

export { ArgsSchema as PromptArgs }
export class Prompt<A extends Args = Args> extends Solid<A> {
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined
  protected onPlayerCollisionEnd: OnPlayerCollisionEnd | undefined

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)

    this.body.isSensor = true
    this.body.isStatic = true
    this.body.label = "messageTrigger"

    const $game = game()

    magicEvent("client")?.addListener(
      "onPlayerCollisionStart",
      (this.onPlayerCollisionStart = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onPromptTrigger", this.args.message)
        }
      })
    )

    magicEvent("client")?.on(
      "onPlayerCollisionEnd",
      (this.onPlayerCollisionEnd = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onPromptTrigger", undefined)
        }
      })
    )
  }

  public override teardown(): void {
    super.teardown()

    magicEvent("client")?.removeListener("onPlayerCollisionStart", this.onPlayerCollisionStart)

    magicEvent("client")?.removeListener("onPlayerCollisionEnd", this.onPlayerCollisionEnd)
  }
}
