import type { LooseSpawnableDefinition } from "@dreamlab.gg/core"
import { Entity } from "@dreamlab.gg/core"
import { game, events as magicEvents, physics } from "@dreamlab.gg/core/dist/labs"
import { onlyNetClient } from "@dreamlab.gg/core/dist/network"
import type { Vector } from "matter-js"
import Matter from "matter-js"
import InventoryManager from "../inventory/inventoryManager.ts"
import { events } from "../events.ts"

const ATTACK_COOLDOWN = 250

export class ParticleSpawner extends Entity {
  private lastSpawnedTime: number | null = null
  private attackPosition: Vector | undefined = undefined
  private direction = 0

  private readonly bulletDefinition = (rotation: number) => {
    return {
      entity: "@dreamlab/Particle",
      transform: {
        position: {
          x: 0,
          y: 0
        }
      },
      args: {
        width: 100,
        height: 100,
        direction: 1,
        emitterConfig: {
          lifetime: { min: 1, max: 1 },
          frequency: 0.001,
          spawnChance: 1,
          particlesPerWave: 2,
          emitterLifetime: 0.8,
          maxParticles: 150,
          addAtBack: false,
          autoUpdate: false,
          behaviors: [
            {
              type: "alpha",
              config: {
                alpha: {
                  list: [
                    { value: 2, time: 0 },
                    { value: 0.5, time: 1 }
                  ]
                }
              }
            },
            {
              type: "scale",
              config: {
                scale: {
                  list: [
                    { value: 0.8, time: 0 },
                    { value: 0.3, time: 1 }
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
                    { value: "ff4d4d", time: 1 }
                  ]
                }
              }
            },
            {
              type: "rotationStatic",
              config: {
                min: rotation,
                max: rotation
              }
            },
            {
              type: "moveSpeed",
              config: {
                speed: {
                  list: [
                    { value: 10_000, time: 0 },
                    { value: 9_999, time: 1 }
                  ]
                }
              }
            },
            {
              type: "textureSingle",
              config: {
                texture:
                  "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
              }
            }
          ]
        }
      }
    }
  }

  private muzzleFlashDefinition = {
    entity: "@dreamlab/Particle",
    transform: {
      position: {
        x: 0,
        y: 0
      }
    },
    args: {
      width: 200,
      height: 200,
      direction: 1,
      emitterConfig: {
        lifetime: { min: 0.05, max: 0.1 },
        frequency: 0.001,
        spawnChance: 1,
        particlesPerWave: 10,
        emitterLifetime: 0.1,
        maxParticles: 20,
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
                  { value: 2, time: 0 },
                  { value: 0.5, time: 1 }
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
                  { value: "ffff00", time: 0.5 },
                  { value: "ff8000", time: 1 }
                ]
              }
            }
          },
          {
            type: "moveSpeed",
            config: {
              speed: {
                list: [
                  { value: 2000, time: 0 },
                  { value: 0, time: 1 }
                ]
              }
            }
          },
          {
            type: "rotation",
            config: {
              minStart: 0,
              maxStart: 360,
              minSpeed: 0,
              maxSpeed: 0
            }
          },
          {
            type: "textureSingle",
            config: {
              texture: "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
            }
          }
        ]
      }
    }
  } as LooseSpawnableDefinition

  private smokeDefinition = {
    entity: "@dreamlab/Particle",
    transform: {
      position: {
        x: 0,
        y: 0
      }
    },
    args: {
      width: 200,
      height: 200,
      direction: 1,
      emitterConfig: {
        lifetime: { min: 0.5, max: 1 },
        frequency: 0.001,
        spawnChance: 1,
        particlesPerWave: 5,
        emitterLifetime: 0.2,
        maxParticles: 20,
        addAtBack: false,
        autoUpdate: false,
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
                  { value: 0.5, time: 0 },
                  { value: 2, time: 1 }
                ]
              }
            }
          },
          {
            type: "color",
            config: {
              color: {
                list: [
                  { value: "888888", time: 0 },
                  { value: "444444", time: 1 }
                ]
              }
            }
          },
          {
            type: "moveSpeed",
            config: {
              speed: {
                list: [
                  { value: 300, time: 0 },
                  { value: 50, time: 1 }
                ]
              }
            }
          },
          {
            type: "rotation",
            config: {
              minStart: 0,
              maxStart: 360,
              minSpeed: 20,
              maxSpeed: 50
            }
          },
          {
            type: "textureSingle",
            config: {
              texture: "https://s3-assets.dreamlab.gg/uploaded-from-editor/Sparks-1709669482539.png"
            }
          }
        ]
      }
    }
  } as LooseSpawnableDefinition

  public constructor() {
    super()

    const netClient = onlyNetClient(game())

    magicEvents("common")?.on("onPlayerAttack", async (player, gear) => {
      if (player.currentAnimation !== "bow" && player.currentAnimation !== "shoot") return
      if (!gear || Date.now() - (this.lastSpawnedTime || 0) <= ATTACK_COOLDOWN) return

      this.lastSpawnedTime = Date.now()
      const invItem = InventoryManager.getInstance().getInventoryItemFromBaseGear(gear)

      this.direction = player.facing === "left" ? -1 : 1
      const xOffset =
        player.currentAnimation === "shoot" ? this.direction * 245 : this.direction * 165
      const yOffset = player.currentAnimation === "shoot" ? 125 : 75

      this.attackPosition = {
        x: player.body.position.x + xOffset,
        y: player.body.position.y - yOffset
      } as Vector

      const newBullet = this.bulletDefinition(this.direction === 1 ? 0 : 180)

      newBullet.transform.position = this.attackPosition
      game("client")?.spawn(newBullet)

      this.muzzleFlashDefinition.transform.position = this.attackPosition
      game("client")?.spawn(this.muzzleFlashDefinition)

      this.smokeDefinition.transform.position = this.attackPosition
      game("client")?.spawn(this.smokeDefinition)

      const startPoint = Matter.Vector.create(player.position.x, player.position.y)
      const endPoint = Matter.Vector.create(
        startPoint.x + 4_000 * Math.cos(this.direction === 1 ? 0 : Math.PI),
        startPoint.y + 4_000 * Math.sin(this.direction === 1 ? 0 : Math.PI)
      )

      const collisions = Matter.Query.ray(
        game().physics.engine.world.bodies,
        startPoint,
        endPoint,
        50
      ).filter(
        collision => collision.parentB.label === "solid" || collision.parentB.label === "zombie"
      )

      collisions.sort((a, b) =>
        this.direction === 1
          ? a.parentB.position.x - b.parentB.position.x
          : b.parentB.position.x - a.parentB.position.x
      )

      for (const collision of collisions) {
        if (collision.parentB.label === "solid") break

        if (collision.parentB.label === "zombie") {
          const targetZombie = collision.parentB
          const entity = physics().getEntity(targetZombie)
          if (entity) {
            void netClient?.sendCustomMessage("@cvz/Hittable/hit", {
              uid: entity.uid,
              damage: invItem ? invItem.damage : 1,
              direction: this.direction
            })
            entity.args.health -= invItem ? invItem.damage : 1
            if (entity.args.health <= 0) {
              events.emit("onPlayerKill", entity.transform.position)
            }
          }

          break
        }
      }
    })
  }

  public override teardown(): void {
    // TODO: implement
  }
}
