import type { RenderTime, SpawnableContext } from "@dreamlab.gg/core"
import type { EventHandler } from "@dreamlab.gg/core/dist/events"
import { camera, debug, game, events as magicEvent } from "@dreamlab.gg/core/dist/labs"
import { Solid, SolidArgs } from "@dreamlab.gg/core/entities"
import { Vec } from "@dreamlab.gg/core/math"
import { z } from "@dreamlab.gg/core/sdk"
import { events } from "../../events.ts"

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  amount: z.number().default(1)
})

type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">

export { ArgsSchema as GoldArgs }

export class Gold<A extends Args = Args> extends Solid<A> {
  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined
  private time = 0
  private floatHeight = 5
  private rotationSpeed = 0.006

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)
    this.body.isSensor = true
    this.body.isStatic = true
    this.body.label = "gold"

    const $game = game()

    if (!this.tags.includes("editor/doNotSave")) {
      this.tags.push("editor/doNotSave")
    }

    magicEvent("client")?.addListener(
      "onPlayerCollisionStart",
      (this.onPlayerCollisionStart = ([_player, other]) => {
        if (this.body && other === this.body && $game.client) {
          events.emit("onGoldPickup", this.args.amount)

          game("client")?.spawn({
            entity: "@dreamlab/Particle",
            transform: {
              position: this.transform.position
            },
            args: {
              width: 100,
              height: 100,
              direction: 1,
              emitterConfig: {
                lifetime: { min: 0.5, max: 1 },
                frequency: 0.001,
                spawnChance: 1,
                particlesPerWave: 5,
                emitterLifetime: 0.5,
                maxParticles: 10,
                addAtBack: false,
                autoUpdate: false,
                behaviors: [
                  {
                    type: "alpha",
                    config: {
                      alpha: {
                        list: [
                          { value: 1, time: 0 },
                          { value: 0, time: 1 }
                        ]
                      }
                    }
                  },
                  {
                    type: "scale",
                    config: {
                      scale: {
                        list: [
                          { value: 0.1, time: 0 },
                          { value: 0.25, time: 1 }
                        ]
                      }
                    }
                  },
                  {
                    type: "moveSpeed",
                    config: {
                      speed: {
                        list: [
                          { value: 1000, time: 0 },
                          { value: 200, time: 1 }
                        ]
                      }
                    }
                  },
                  {
                    type: "rotation",
                    config: {
                      minStart: 0,
                      maxStart: 360,
                      minSpeed: 200,
                      maxSpeed: 400
                    }
                  },
                  {
                    type: "textureSingle",
                    config: {
                      texture:
                        "https://s3-assets.dreamlab.gg/uploaded-from-editor/goldcoin-1710371567135.png"
                    }
                  }
                ]
              }
            }
          })

          game().destroy(this)
        }
      })
    )
  }

  public override teardown(): void {
    super.teardown()
    magicEvent("client")?.removeListener("onPlayerCollisionStart", this.onPlayerCollisionStart)
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
