import type { SpawnableContext } from "@dreamlab.gg/core"
import type { EventHandler } from "@dreamlab.gg/core/dist/events"
import { game, events as magicEvent } from "@dreamlab.gg/core/dist/labs"
import { Solid, SolidArgs } from "@dreamlab.gg/core/entities"
import { z } from "@dreamlab.gg/core/sdk"
import { events } from "../../events.ts"

export type QuestType = "reachGold" | "reachKills" | "gatherPart"

export type QuestGoal =
  | { type: "reachGold"; amount: number }
  | { type: "reachKills"; amount: number }
  | { type: "gatherPart"; partName: string }

export class Quest {
  constructor(
    public title: string,
    public description: string,
    public goal: QuestGoal,
    public goldReward: number,
    public completed: boolean = false
  ) {}
}

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  questTitle: z.string().default("Default Quest"),
  questDescription: z.string().default("Default Quest Description"),
  goldReward: z.number().default(0),
  reachGold: z.boolean().default(false),
  reachKills: z.boolean().default(false),
  gatherPart: z.boolean().default(false),
  goldAmount: z.number().default(0),
  killCount: z.number().default(0),
  partName: z.string().default("")
})

type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">
type OnPlayerCollisionEnd = EventHandler<"onPlayerCollisionEnd">

export { ArgsSchema as QuestArgs }

export class QuestEntity<A extends Args = Args> extends Solid<A> {
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined
  protected onPlayerCollisionEnd: OnPlayerCollisionEnd | undefined

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)
    this.body.isSensor = true
    this.body.isStatic = true
    this.body.label = "questTrigger"

    const $game = game()
    magicEvent("client")?.addListener(
      "onPlayerCollisionStart",
      (this.onPlayerCollisionStart = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          let questType: "reachGold" | "reachKills" | "gatherPart"
          let questGoal:
            | { type: "reachGold"; amount: number }
            | { type: "reachKills"; amount: number }
            | { type: "gatherPart"; partName: string }

          if (this.args.reachGold) {
            questType = "reachGold"
            questGoal = { type: "reachGold", amount: this.args.goldAmount }
          } else if (this.args.reachKills) {
            questType = "reachKills"
            questGoal = { type: "reachKills", amount: this.args.killCount }
          } else if (this.args.gatherPart) {
            questType = "gatherPart"
            questGoal = { type: "gatherPart", partName: this.args.partName }
          } else {
            throw new Error("Invalid quest type")
          }

          events.emit(
            "onQuestTrigger",
            this.args.questTitle,
            this.args.questDescription,
            this.args.goldReward,
            questType,
            questGoal
          )
        }
      })
    )

    magicEvent("client")?.on(
      "onPlayerCollisionEnd",
      (this.onPlayerCollisionEnd = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onQuestTrigger", undefined, undefined, undefined, undefined, undefined)
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
