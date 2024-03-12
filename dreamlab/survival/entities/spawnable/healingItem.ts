// HealingItem.ts
import type { RenderTime, SpawnableContext } from "@dreamlab.gg/core"
import type { EventHandler } from "@dreamlab.gg/core/dist/events"
import { camera, debug, game, events as magicEvent } from "@dreamlab.gg/core/dist/labs"
import { Solid, SolidArgs } from "@dreamlab.gg/core/entities"
import { Vec } from "@dreamlab.gg/core/math"
import { z } from "@dreamlab.gg/core/sdk"
import { events } from "../../events.ts"

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  healAmount: z.number().default(1)
})

type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">
type OnPlayerCollisionEnd = EventHandler<"onPlayerCollisionEnd">

export { ArgsSchema as HealingItemArgs }

export class HealingItem<A extends Args = Args> extends Solid<A> {
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined
  protected onPlayerCollisionEnd: OnPlayerCollisionEnd | undefined
  private time = 0
  private floatHeight = 5
  private rotationSpeed = 0.006

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)
    this.body.isSensor = true
    this.body.isStatic = true
    this.body.label = "healingItem"

    const $game = game()
    magicEvent("client")?.addListener(
      "onPlayerCollisionStart",
      (this.onPlayerCollisionStart = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onPlayerNearHealingItem", this.args.healAmount)
        }
      })
    )

    magicEvent("client")?.on(
      "onPlayerCollisionEnd",
      (this.onPlayerCollisionEnd = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onPlayerNearHealingItem", undefined)
        }
      })
    )
  }

  public override teardown(): void {
    super.teardown()
    magicEvent("client")?.removeListener("onPlayerCollisionStart", this.onPlayerCollisionStart)
    magicEvent("client")?.removeListener("onPlayerCollisionEnd", this.onPlayerCollisionEnd)
  }

  public override onRenderFrame(_time: RenderTime) {
    this.time += 0.05
    const yOffset = Math.sin(this.time) * this.floatHeight
    const pos = Vec.add(this.transform.position, camera().offset)
    pos.y += yOffset
    this.container!.rotation += this.rotationSpeed
    this.container!.position = pos
    if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0
  }
}
