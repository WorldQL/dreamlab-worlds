import type { LooseSpawnableDefinition, RenderTime, SpawnableContext } from "@dreamlab.gg/core"
import type { EventHandler } from "@dreamlab.gg/core/dist/events"
import { camera, debug, game, events as magicEvents } from "@dreamlab.gg/core/dist/labs"
import type { CircleGraphics } from "@dreamlab.gg/core/dist/utils"
import { drawCircle } from "@dreamlab.gg/core/dist/utils"
import { Solid, SolidArgs } from "@dreamlab.gg/core/entities"
import type { SyncedValue } from "@dreamlab.gg/core/network"
import { syncedValue } from "@dreamlab.gg/core/network"
import { z } from "@dreamlab.gg/core/sdk"
import type { MyEventHandler } from "../../events.ts"
import { events } from "../../events.ts"

type Args = typeof ArgsSchema
const ArgsSchema = SolidArgs.extend({
  zombieTypes: z
    .array(
      z.object({
        width: z.number(),
        height: z.number(),
        maxHealth: z.number(),
        speed: z.number(),
        knockback: z.number()
      })
    )
    .default([
      {
        width: 100,
        height: 200,
        maxHealth: 10,
        speed: 3,
        knockback: 1.25
      }
    ]),
  zombiesPerWave: z.number().default(1),
  waves: z.number().default(3),
  waveInterval: z.number().default(25),
  endCooldown: z.number().default(15)
})

type OnPlayerCollisionStart = EventHandler<"onPlayerCollisionStart">
type OnPlayerCollisionEnd = EventHandler<"onPlayerCollisionEnd">
type OnRegionZombieSpawning = MyEventHandler<"onRegionZombieSpawning">
type OnRegionCooldownStart = MyEventHandler<"onRegionCooldownStart">
type OnRegionCooldownEnd = MyEventHandler<"onRegionCooldownEnd">
type OnRegionWaveStart = MyEventHandler<"onRegionWaveStart">
type OnRegionStart = MyEventHandler<"onRegionStart">
type OnRegionEnd = MyEventHandler<"onRegionEnd">

type zombiePosition = { x: number; y: number }[] | undefined
interface RegionData {
  isCooldown: boolean
  waveStarted: boolean
  regionActive: boolean
  positions: zombiePosition
}

export { ArgsSchema as SpawnRegionArgs }
export class SpawnRegion<A extends Args = Args> extends Solid<A> {
  protected gfxCircle: CircleGraphics | undefined
  private regionData: SyncedValue<RegionData> = syncedValue(this.uid, "regionData", {
    isCooldown: false as boolean,
    waveStarted: false as boolean,
    regionActive: false as boolean,
    positions: undefined as zombiePosition
  })

  private readonly zombieSpawnParticleDefinition = {
    entity: "@dreamlab/Particle",
    transform: {
      position: {
        x: 0,
        y: 0
      }
    },
    args: {
      width: 300,
      height: 300,
      direction: 1,
      emitterConfig: {
        lifetime: { min: 0.5, max: 1 },
        frequency: 0.001,
        spawnChance: 1,
        particlesPerWave: 10,
        emitterLifetime: 1,
        maxParticles: 50,
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
                  { value: 0.05, time: 0 },
                  { value: 0.25, time: 1 }
                ]
              }
            }
          },
          {
            type: "color",
            config: {
              color: {
                list: [
                  { value: "00ff00", time: 0 },
                  { value: "008000", time: 1 }
                ]
              }
            }
          },
          {
            type: "moveSpeed",
            config: {
              speed: {
                list: [
                  { value: 500, time: 0 },
                  { value: 50, time: 1 }
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
            type: "shape",
            config: {
              type: "circle"
            }
          },
          {
            type: "textureSingle",
            config: {
              texture:
                "https://s3-assets.dreamlab.gg/uploaded-from-editor/zombiecube-1707083464199.png"
            }
          }
        ]
      }
    }
  } as LooseSpawnableDefinition

  protected onPlayerCollisionStart: OnPlayerCollisionStart | undefined
  protected onPlayerCollisionEnd: OnPlayerCollisionEnd | undefined
  protected onRegionZombieSpawning: OnRegionZombieSpawning | undefined
  protected onRegionCooldownStart: OnRegionCooldownStart | undefined
  protected onRegionCooldownEnd: OnRegionCooldownEnd | undefined
  protected onRegionWaveStart: OnRegionWaveStart | undefined
  protected onRegionStart: OnRegionStart | undefined
  protected onRegionEnd: OnRegionEnd | undefined

  public constructor(ctx: SpawnableContext<A>) {
    super(ctx)
    this.body.isSensor = true
    this.body.label = "spawnRegion"

    magicEvents("client")?.addListener(
      "onPlayerCollisionStart",
      (this.onPlayerCollisionStart = ([_player, other]) => {
        if (other.id === this.body.id) {
          events.emit("onEnterRegion", this.uid)
        }
      })
    )

    magicEvents("client")?.on(
      "onPlayerCollisionEnd",
      (this.onPlayerCollisionEnd = ([_player, other]) => {
        if (other.id === this.body.id) {
          events.emit("onExitRegion", this.uid)
        }
      })
    )

    events.addListener(
      "onRegionZombieSpawning",
      (this.onRegionZombieSpawning = positions => {
        this.regionData.value.positions = Array.isArray(positions) ? positions : undefined

        setTimeout(() => {
          this.regionData.value.positions = undefined
        }, 3_000)
      })
    )

    events.addListener(
      "onRegionCooldownStart",
      (this.onRegionCooldownStart = regionId => {
        if (this.uid === regionId) {
          this.regionData.value.isCooldown = true
        }
      })
    )

    events.addListener(
      "onRegionCooldownEnd",
      (this.onRegionCooldownEnd = regionId => {
        if (this.uid === regionId) {
          this.regionData.value.isCooldown = false
        }
      })
    )

    events.addListener(
      "onRegionWaveStart",
      (this.onRegionWaveStart = regionId => {
        if (this.uid === regionId) {
          this.regionData.value.waveStarted = true
          setTimeout(() => {
            this.regionData.value.waveStarted = false
          }, 3_000)
        }
      })
    )

    events.addListener(
      "onRegionStart",
      (this.onRegionStart = regionId => {
        if (this.uid === regionId) {
          this.regionData.value.regionActive = true
        }
      })
    )

    events.addListener(
      "onRegionEnd",
      (this.onRegionEnd = regionId => {
        if (this.uid === regionId) {
          this.regionData.value.regionActive = false
        }
      })
    )

    const $game = game("client")
    if ($game) {
      this.gfxCircle = drawCircle({ radius: 75 })
      this.gfxCircle.zIndex = -1

      this.container?.addChild(this.gfxCircle)
    }
  }

  public override teardown(): void {
    super.teardown()

    magicEvents("client")?.removeListener("onPlayerCollisionStart", this.onPlayerCollisionStart)

    magicEvents("client")?.removeListener("onPlayerCollisionEnd", this.onPlayerCollisionEnd)

    events.removeListener("onRegionZombieSpawning", this.onRegionZombieSpawning)
    events.removeListener("onRegionCooldownStart", this.onRegionCooldownStart)
    events.removeListener("onRegionCooldownEnd", this.onRegionCooldownEnd)
    events.removeListener("onRegionWaveStart", this.onRegionWaveStart)
    events.removeListener("onRegionStart", this.onRegionStart)
    events.removeListener("onRegionEnd", this.onRegionEnd)
  }

  public override onRenderFrame(time: RenderTime) {
    super.onRenderFrame(time)

    this.gfx!.clear()
    this.gfxCircle!.clear()

    let fillAlpha = 0
    let fillColor = 0x0
    const strokeAlpha = 1
    let strokeColor = 0x0
    const strokeWidth = 8

    if (this.regionData.value.regionActive) strokeColor = 0x38761d
    if (this.regionData.value.isCooldown) {
      fillColor = 0x85c1e9
      fillAlpha = 0.5
      strokeColor = 0x3498db
    }

    if (this.regionData.value.waveStarted) {
      fillColor = 0x0
      fillAlpha = 0
      strokeColor = 0x9b0000
    }

    this.gfx?.redraw(
      { width: this.args.width, height: this.args.height },
      {
        fill: fillColor,
        fillAlpha,
        stroke: strokeColor,
        strokeWidth,
        strokeAlpha
      }
    )

    const pulseColors = [0xff0000, 0xd10000]
    const timeBasedIndex = Math.floor(Date.now() / 250) % pulseColors.length
    const currentColor = pulseColors[timeBasedIndex]

    if (this.regionData.value.positions) {
      for (const { x, y } of Object.values(this.regionData.value.positions)) {
        const adjustedX = x + camera().offset.x - this.container!.position.x
        const adjustedY = y + camera().offset.y - this.container!.position.y

        this.gfxCircle!.redraw(
          { radius: 75 },
          {
            fill: currentColor,
            fillAlpha: 0.5
          }
        )

        this.gfxCircle!.position.set(adjustedX, adjustedY)

        this.zombieSpawnParticleDefinition.transform.position = { x, y }
        game("client")?.spawn(this.zombieSpawnParticleDefinition)
      }
    }

    if (this.gfxCircle) this.gfxCircle.alpha = debug() ? 1 : 0
  }
}
