import {
  SpawnableContext,
  RenderTime,
  ArgsPath,
  PreviousArgs,
  SpawnableEntity
} from "@dreamlab.gg/core"
import { game, stage, camera, debug } from "@dreamlab.gg/core/dist/labs"
import { Bounds, Vec, Vector, simpleBoundsTest } from "@dreamlab.gg/core/dist/math"
import { z } from "@dreamlab.gg/core/dist/sdk"
import { SpriteSourceSchema } from "@dreamlab.gg/core/dist/textures"
import { BoxGraphics, drawBox, particles } from "@dreamlab.gg/core/dist/utils"
import { ParticleContainer } from "pixi.js"
import { Container } from "pixi.js"

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(100),
  height: z.number().positive().min(1).default(100),
  spriteSource: z.array(SpriteSourceSchema).default([]),
  lifetime: z
    .object({
      min: z.number(),
      max: z.number()
    })
    .default({ min: 2, max: 4 }),
  frequency: z.number().default(0.1),
  emitterLifetime: z.number().default(-1),
  spawnChance: z.number().default(0.6),
  particlesPerWave: z.number().default(3),
  maxParticles: z.number().default(100),
  alpha: z
    .object({
      start: z.number(),
      end: z.number()
    })
    .default({ start: 0.7, end: 0 }),
  scale: z
    .object({
      start: z.number(),
      end: z.number()
    })
    .default({ start: 0.05, end: 0.25 }),
  rotation: z
    .object({
      min: z.number(),
      max: z.number()
    })
    .default({ min: 0, max: 360 }),
  color: z
    .object({
      start: z.string(),
      mid: z.string(),
      end: z.string()
    })
    .default({ start: "#ffffff", mid: "#ffffff", end: "#ffffff" }),
  path: z.string().default("sin(x/10) * 10"),
  speedList: z
    .array(
      z.object({
        value: z.number(),
        time: z.number()
      })
    )
    .default([
      { value: 10, time: 0 },
      { value: 100, time: 0.25 },
      { value: 0, time: 1 }
    ]),
  minMult: z.number().default(0.8)
})

export { ArgsSchema as EnvironmentParticleArgs }
export class EnvironmentParticle<A extends Args = Args> extends SpawnableEntity<A> {
  protected particleContainer: ParticleContainer | undefined
  protected emitter: particles.Emitter | undefined

  protected readonly container: Container | undefined
  protected readonly gfx: BoxGraphics | undefined

  public constructor(ctx: SpawnableContext<A>, { stroke = "purple" }: { stroke?: string } = {}) {
    super(ctx)

    const $game = game("client")
    if ($game) {
      this.particleContainer = new ParticleContainer()
      stage().addChild(this.particleContainer)

      this.transform.addZIndexListener(() => {
        if (this.particleContainer) this.particleContainer.zIndex = this.transform.zIndex
      })

      this.createEmitter()

      const { width, height } = this.args

      this.container = new Container()
      this.container.sortableChildren = true
      this.container.zIndex = this.transform.zIndex

      this.gfx = drawBox({ width, height }, { stroke })
      this.gfx.zIndex = 100

      this.container.addChild(this.gfx)
      stage().addChild(this.container)

      this.transform.addZIndexListener(() => {
        if (this.container) this.container.zIndex = this.transform.zIndex
      })
    }
  }

  private createEmitter(): void {
    if (this.particleContainer) {
      const {
        width,
        height,
        spriteSource,
        lifetime,
        frequency,
        emitterLifetime,
        spawnChance,
        particlesPerWave,
        maxParticles,
        alpha,
        scale,
        rotation,
        path,
        speedList,
        minMult,
        color
      } = this.args

      const emitterConfig: particles.EmitterConfigV3 = {
        lifetime: { min: lifetime.min, max: lifetime.max },
        frequency,
        emitterLifetime,
        spawnChance,
        particlesPerWave,
        maxParticles,
        addAtBack: false,
        autoUpdate: false,
        pos: { x: this.transform.position.x, y: this.transform.position.y },
        behaviors: [
          {
            type: "alpha",
            config: {
              alpha: {
                list: [
                  { value: alpha.start, time: 0 },
                  { value: alpha.end, time: 1 }
                ]
              }
            }
          },
          {
            type: "scale",
            config: {
              scale: {
                list: [
                  { value: scale.start, time: 0 },
                  { value: scale.end, time: 1 }
                ]
              }
            }
          },
          {
            type: "rotationStatic",
            config: {
              min: rotation.min,
              max: rotation.max
            }
          },
          {
            type: "movePath",
            config: {
              path,
              speed: {
                list: speedList
              },
              minMult
            }
          },
          {
            type: "color",
            config: {
              color: {
                list: [
                  { value: color.start, time: 0 },
                  { value: color.mid, time: 0.5 },
                  { value: color.end, time: 1 }
                ]
              }
            }
          },
          {
            type: "spawnShape",
            config: {
              type: "rect",
              data: {
                x: -width / 2,
                y: -height / 2,
                w: width,
                h: height
              }
            }
          }
        ]
      }

      if (spriteSource.length > 0) {
        emitterConfig.behaviors.push({
          type: "textureRandom",
          config: {
            textures: spriteSource.map(source => source.url)
          }
        })
      }

      this.emitter = new particles.Emitter(this.particleContainer, emitterConfig)
    }
  }

  public override bounds(): Bounds | undefined {
    const { width, height } = this.args
    return { width, height }
  }

  public override isPointInside(point: Vector): boolean {
    const { width, height } = this.args
    return simpleBoundsTest({ width, height }, this.transform, point)
  }

  public override onArgsUpdate(path: ArgsPath<Args>, _: PreviousArgs<Args>): void {
    this.emitter?.destroy()
    this.createEmitter()

    if (this.gfx && (path === "width" || path === "height")) {
      this.gfx.redraw(this.args)
    }
  }

  public override onResize(bounds: Bounds): void {
    this.args.width = bounds.width
    this.args.height = bounds.height
  }

  public override teardown(): void {
    this.particleContainer?.destroy()
    this.emitter?.destroy()

    this.container?.destroy({ children: true })
  }

  public override onRenderFrame(time: RenderTime): void {
    const pos = Vec.add(this.transform.position, camera().offset)

    if (this.container) {
      this.container.position = pos
      this.container.angle = this.transform.rotation
    }

    if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0

    if (!this.emitter?.emit) {
      game().destroy(this)
      return
    }

    if (this.particleContainer && this.emitter) {
      this.emitter.update(time.delta)
      this.particleContainer.position = camera().offset
      this.emitter.resetPositionTracking()
      this.emitter.updateSpawnPos(this.transform.position.x, this.transform.position.y)
    }
  }
}
