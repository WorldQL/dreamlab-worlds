import { Entity } from "@dreamlab.gg/core"
import { game } from "@dreamlab.gg/core/dist/labs"
import { MyEventHandler, events } from "../events.ts"
import PlayerManager from "../playerManager.ts"
import { isPlayer } from "@dreamlab.gg/core/dist/entities"
import { deferUntilPhysicsStep } from "@dreamlab.gg/core/dist/utils"
import Matter from "matter-js"
import InventoryManager from "../inventory/inventoryManager.ts"

type OnPlayerKill = MyEventHandler<"onPlayerKill">
type OnGoldPickup = MyEventHandler<"onGoldPickup">

const MAX_GOLD_PER_KILL = 65
const DASH_COOLDOWN = 3000 // 3 seconds

export class GameManager extends Entity {
  protected onPlayerKill: OnPlayerKill | undefined
  protected onGoldPickup: OnGoldPickup | undefined
  private dashCooldown: number = 0

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
            amount: Math.floor(Math.random() * MAX_GOLD_PER_KILL),
            spriteSource: {
              url: "https://s3-assets.dreamlab.gg/uploaded-from-editor/goldcoin-1710371567135.png"
            }
          }
        })
      })
    )

    game().client?.inputs.addListener("@player/attack", (keyDown: boolean) => {
      if (!keyDown) {
        return
      }

      if (
        InventoryManager.getInstance()
          .getItemInHand()
          ?.baseGear.displayName.includes("Portal Stone")
      ) {
        const player = game().entities.find(isPlayer)
        if (!player) {
          console.log("Player not found")
          return
        }

        game().spawn({
          entity: "@dreamlab/Particle",
          transform: {
            position: player.body.position
          },
          args: {
            width: 500,
            height: 500,
            emitterConfig: {
              lifetime: { min: 0.5, max: 2 },
              frequency: 0.02,
              spawnChance: 1,
              particlesPerWave: 100,
              emitterLifetime: 1.5,
              maxParticles: 200,
              addAtBack: false,
              autoUpdate: false,
              pos: {
                x: 0,
                y: 0
              },
              behaviors: [
                {
                  type: "alpha",
                  config: {
                    alpha: {
                      list: [
                        { value: 1, time: 0 },
                        { value: 0.8, time: 0.5 },
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
                        { value: 1, time: 0 },
                        { value: 1.5, time: 0.5 },
                        { value: 1, time: 1 }
                      ]
                    }
                  }
                },
                {
                  type: "color",
                  config: {
                    color: {
                      list: [
                        { value: "8e44ad", time: 0 },
                        { value: "9b59b6", time: 0.5 },
                        { value: "8e44ad", time: 1 }
                      ]
                    }
                  }
                },
                {
                  type: "moveSpeed",
                  config: {
                    speed: {
                      list: [
                        { value: 200, time: 0 },
                        { value: 100, time: 0.5 },
                        { value: 0, time: 1 }
                      ]
                    }
                  }
                },
                {
                  type: "rotationStatic",
                  config: {
                    min: 0,
                    max: 360
                  }
                },
                {
                  type: "textureRandom",
                  config: {
                    textures: [
                      "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
                    ]
                  }
                },
                {
                  type: "spawnShape",
                  config: {
                    type: "torus",
                    data: {
                      x: 0,
                      y: 0,
                      radius: 150,
                      innerRadius: 50,
                      affectRotation: false
                    }
                  }
                }
              ]
            }
          }
        })
        setTimeout(() => {
          player.teleport({ x: -6400, y: 385 })
        }, 1500)
      }
    })

    game().client?.inputs.addListener("@player/jog", (keyDown: boolean) => {
      if (!keyDown) {
        return
      }

      const player = game().entities.find(isPlayer)
      if (!player) {
        console.log("Player not found")
        return
      }

      const currentTime = Date.now()
      if (currentTime - this.dashCooldown < DASH_COOLDOWN) {
        return
      }
      this.dashCooldown = currentTime

      events.emit("onDashCooldownStart", DASH_COOLDOWN)

      game().spawn({
        entity: "@dreamlab/Particle",
        transform: {
          position: player.body.position
        },
        args: {
          width: 200,
          height: 200,
          emitterConfig: {
            lifetime: { min: 0.3, max: 0.6 },
            frequency: 0.005,
            spawnChance: 1,
            particlesPerWave: 20,
            emitterLifetime: 0.4,
            maxParticles: 40,
            addAtBack: false,
            autoUpdate: false,
            pos: {
              x: 0,
              y: 0
            },
            behaviors: [
              {
                type: "alpha",
                config: {
                  alpha: {
                    list: [
                      { value: 0.8, time: 0 },
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
                      { value: 1.5, time: 0 },
                      { value: 0.8, time: 1 }
                    ]
                  }
                }
              },
              {
                type: "color",
                config: {
                  color: {
                    list: [
                      { value: "ffffff", time: 0 },
                      { value: "f5d142", time: 1 }
                    ]
                  }
                }
              },
              {
                type: "moveSpeedStatic",
                config: {
                  min: 300,
                  max: 600
                }
              },
              {
                type: "rotationStatic",
                config: {
                  min: 0,
                  max: 360
                }
              },
              {
                type: "textureRandom",
                config: {
                  textures: [
                    "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
                  ]
                }
              },
              {
                type: "spawnShape",
                config: {
                  type: "torus",
                  data: {
                    x: 0,
                    y: 0,
                    radius: 20,
                    innerRadius: 0,
                    affectRotation: false
                  }
                }
              }
            ]
          }
        }
      })

      const dashForce = player.facing === "left" ? -8 : 8
      deferUntilPhysicsStep(() =>
        Matter.Body.applyForce(player.body, player.body.position, { x: dashForce, y: 0 })
      )

      setTimeout(() => {
        events.emit("onDashCooldownEnd")
      }, DASH_COOLDOWN)
    })
  }

  public override teardown(): void {
    events.removeListener("onPlayerKill", this.onPlayerKill)
    events.removeListener("onGoldPickup", this.onGoldPickup)
  }
}
