import { Entity } from "@dreamlab.gg/core"
import { game } from "@dreamlab.gg/core/dist/labs"
import { MyEventHandler, events } from "../events"
import PlayerManager from "../playerManager"

type OnPlayerKill = MyEventHandler<"onPlayerKill">
type OnGoldPickup = MyEventHandler<"onGoldPickup">

const MAX_GOLD_PER_KILL = 65

export class GameManager extends Entity {
  protected onPlayerKill: OnPlayerKill | undefined
  protected onGoldPickup: OnGoldPickup | undefined
  protected onDashed: any

  public constructor() {
    super()

    events.addListener(
      "onGoldPickup",
      (this.onGoldPickup = gold => {
        PlayerManager.getInstance().addGold(gold)
      })
    )

    events.addListener(
      "onPlayerKill",
      (this.onPlayerKill = position => {
        PlayerManager.getInstance().addKills(1)

        game().spawn({
          entity: "@cvz/Gold",
          transform: {
            position: {
              x: position.x,
              y: position.y
            }
          },
          args: {
            width: 150,
            height: 150,
            amount: Math.floor(Math.random() * MAX_GOLD_PER_KILL)
          }
        })
      })
    )

    game().client?.inputs.addListener(
      "@cvz/dash",
      (this.onDashed = () => {
        //TODO: implement dash
      })
    )
  }

  public override teardown(): void {
    events.removeListener("onPlayerKill", this.onPlayerKill)
    events.removeListener("onGoldPickup", this.onGoldPickup)
    game().client?.inputs.removeListener("@cvz/dash", this.onDashed)
  }
}
