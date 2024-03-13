import {
  SpawnableEntity,
  SpawnableContext,
  ArgsPath,
  PreviousArgs,
  updateSpriteWidthHeight,
  updateSpriteSource,
  RenderTime
} from "@dreamlab.gg/core"
import type { Sprite } from "pixi.js"
import { Container } from "pixi.js"
import { game, stage, camera, debug } from "@dreamlab.gg/core/dist/labs"
import { Bounds, Vector, simpleBoundsTest, Vec } from "@dreamlab.gg/core/dist/math"
import { z } from "@dreamlab.gg/core/dist/sdk"
import { SpriteSourceSchema, createSprite } from "@dreamlab.gg/core/dist/textures"
import { BoxGraphics, drawBox } from "@dreamlab.gg/core/dist/utils"

type Args = typeof ArgsSchema

const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(100),
  height: z.number().positive().min(1).default(100),
  spriteSource: z.array(SpriteSourceSchema).default([]),
  spriteInterval: z.number().positive().default(1000)
})

export { ArgsSchema as AnimatedNonSolidArgs }

export class AnimatedNonSolid<A extends Args = Args> extends SpawnableEntity<A> {
  protected readonly container: Container | undefined
  protected readonly gfx: BoxGraphics | undefined
  protected sprite: Sprite | undefined
  private currentSpriteIndex = 0
  private lastSpriteChangeTime = 0

  public constructor(ctx: SpawnableContext<A>, { stroke = "blue" }: { stroke?: string } = {}) {
    super(ctx)
    const $game = game("client")
    if ($game) {
      const { width, height, spriteSource: spriteSources, spriteInterval } = this.args
      this.container = new Container()
      this.container.sortableChildren = true
      this.container.zIndex = this.transform.zIndex
      this.gfx = drawBox({ width, height }, { stroke })
      this.gfx.zIndex = 100
      this.sprite = spriteSources?.[0]
        ? createSprite(spriteSources[0], { width, height })
        : undefined
      this.container.addChild(this.gfx)
      if (this.sprite) this.container.addChild(this.sprite)
      stage().addChild(this.container)
      this.transform.addZIndexListener(() => {
        if (this.container) this.container.zIndex = this.transform.zIndex
      })
      this.lastSpriteChangeTime = Date.now()
      if (spriteSources.length > 1) {
        setInterval(this.switchSprite.bind(this), spriteInterval)
      }
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
    updateSpriteWidthHeight(path, this?.sprite, this.args)
    if (this.gfx && (path === "width" || path === "height")) {
      this.gfx.redraw(this.args)
    }
    this.sprite = updateSpriteSource(
      path,
      "spriteSources",
      this.container,
      this.sprite,
      this.args.spriteSource?.[this.currentSpriteIndex],
      this.args
    )
  }

  public override onResize(bounds: Bounds): void {
    this.args.width = bounds.width
    this.args.height = bounds.height
  }

  public override teardown(): void {
    this.container?.destroy({ children: true })
  }

  public override onRenderFrame(_: RenderTime): void {
    const pos = Vec.add(this.transform.position, camera().offset)
    if (this.container) {
      this.container.position = pos
      this.container.angle = this.transform.rotation
    }
    if (this.gfx) this.gfx.alpha = debug() ? 0.5 : 0
    if (this.args.spriteSource.length > 1) {
      this.switchSprite()
    }
  }

  private switchSprite() {
    const now = Date.now()
    const { spriteSource: spriteSources, spriteInterval } = this.args
    if (
      spriteSources &&
      spriteSources.length > 1 &&
      now - this.lastSpriteChangeTime > spriteInterval
    ) {
      this.currentSpriteIndex = (this.currentSpriteIndex + 1) % spriteSources.length
      this.sprite = updateSpriteSource(
        "spriteSources",
        "spriteSources",
        this.container,
        this.sprite,
        spriteSources[this.currentSpriteIndex],
        this.args
      )
      this.lastSpriteChangeTime = now
    }
  }
}
