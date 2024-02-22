import type {
  ArgsPath,
  Game,
  PreviousArgs,
  RenderTime,
  SpawnableContext,
} from '@dreamlab.gg/core'
import {
  createSpawnableEntity,
  isEntity,
  SpawnableEntity,
  updateSpriteSource,
  updateSpriteWidthHeight,
} from '@dreamlab.gg/core'
import { camera, game, physics, stage } from '@dreamlab.gg/core/dist/labs'
import { z } from '@dreamlab.gg/core/dist/sdk'
import {
  createSprite,
  SpriteSourceSchema,
} from '@dreamlab.gg/core/dist/textures'
import type { Camera } from '@dreamlab.gg/core/entities'
import { isNetPlayer } from '@dreamlab.gg/core/entities'
import type { EventHandler } from '@dreamlab.gg/core/events'
import type { Vector } from '@dreamlab.gg/core/math'
import {
  cloneTransform,
  simpleBoundsTest,
  toRadians,
  Vec,
} from '@dreamlab.gg/core/math'
import {
  onlyNetClient,
  onlyNetServer,
  syncedValue,
} from '@dreamlab.gg/core/network'
import type {
  MessageListenerServer,
  NetClient,
  NetServer,
  SyncedValue,
} from '@dreamlab.gg/core/network'
import type { BoxGraphics, CircleGraphics } from '@dreamlab.gg/core/utils'
import {
  deferUntilPhysicsStep,
  drawBox,
  drawCircle,
} from '@dreamlab.gg/core/utils'
import debug from 'debug'
import Matter from 'matter-js'
import type { Bounds, Resource, Sprite, Texture } from 'pixi.js'
import { AnimatedSprite, Container, Graphics } from 'pixi.js'
import { getPreloadedAssets } from '../../assetLoader'
import { events } from '../../events'
import InventoryManager from '../../inventory/inventoryManager'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(200),
  height: z.number().positive().min(1).default(200),
  spriteSource: SpriteSourceSchema.optional(),
  maxHealth: z.number().positive().min(1).default(10),
  speed: z.number().positive().min(1).default(1),
  knockback: z.number().positive().min(0).default(2),
})

export { ArgsSchema as ZombieArgs }
export class Zombie<A extends Args = Args> extends SpawnableEntity<A> {
  protected readonly body: Matter.Body
  protected sprite: AnimatedSprite | undefined

  protected readonly container: Container | undefined
  protected readonly healthContainer: Container | undefined
  protected readonly gfx: BoxGraphics | undefined
  protected readonly gfxHitBox: CircleGraphics | undefined
  protected readonly gfxHealthBorder: BoxGraphics | undefined
  protected readonly gfxHealthAmount: BoxGraphics | undefined

  private zombieAnimations: Record<string, Texture<Resource>[]> = {}

  public constructor(
    ctx: SpawnableContext<A>,
    { stroke = 'green' }: { stroke?: string } = {},
  ) {
    super(ctx)

    this.body = Matter.Bodies.rectangle(
      this.transform.position.x,
      this.transform.position.y,
      this.args.width,
      this.args.height,
      {
        label: 'zombie',
        inertia: Number.POSITIVE_INFINITY,
      },
    )

    physics().register(this, this.body)
    physics().linkTransform(this.body, this.transform)

    const $game = game('client')
    if ($game) {
      const assets = getPreloadedAssets()
      this.zombieAnimations.walk = assets.walkTextures
      this.zombieAnimations.recoil = assets.recoilTextures
      this.zombieAnimations.punch = assets.punchTextures
      this.sprite = new AnimatedSprite(this.zombieAnimations.walk!)
      this.sprite.gotoAndPlay(0)
      this.sprite.anchor.set(0.45, 0.535)

      const originalWidth = this.sprite.texture.width
      const originalHeight = this.sprite.texture.height
      const scaleX = (this.args.width * 1.5) / originalWidth
      const scaleY = (this.args.height * 1.5) / originalHeight
      const uniformScale = Math.max(scaleX, scaleY)

      this.sprite.scale.set(uniformScale, uniformScale)

      this.container = new Container()
      this.container.sortableChildren = true
      this.container.zIndex = this.transform.zIndex

      this.healthContainer = new Container()
      this.healthContainer.sortableChildren = true

      this.gfxHitBox!.zIndex = -1
      this.healthContainer.zIndex = 1
      this.healthContainer.position.y = -this.args.height / 2 - 30

      this.gfx = drawBox(
        { width: this.args.width, height: this.args.height },
        { stroke },
      )

      this.gfxHitBox = drawCircle(
        { radius: this.args.width / 2 + 120 },
        { fill: 'red', fillAlpha: 1, strokeAlpha: 0 },
      )

      const gfxHealthBorder = new Graphics()
      const gfxHealthAmount = new Graphics()

      this.gfxHealthBorder = drawBox(
        { width: this.args.width + 50, height: 20 },
        {
          fill: 'white',
          stroke: 'black',
          fillAlpha: 1,
          strokeAlign: 1,
          strokeWidth: 4,
        },
      )

      this.healthContainer.addChild(gfxHealthBorder)
      this.healthContainer.addChild(gfxHealthAmount)

      this.container.addChild(this.gfx)
      this.container.addChild(this.gfxHitBox)
      this.container.addChild(this.healthContainer)
      stage().addChild(this.container)

      this.transform.addZIndexListener(() => {
        if (this.container) this.container.zIndex = this.transform.zIndex
      })
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

  public override onArgsUpdate(
    path: ArgsPath<Args>,
    _: PreviousArgs<Args>,
  ): void {
    updateSpriteWidthHeight(path, this?.sprite, this.args)

    if (this.gfx && (path === 'width' || path === 'height')) {
      this.gfx.redraw(this.args)
    }

    this.sprite = updateSpriteSource(
      path,
      'spriteSource',
      this.container,
      this.sprite,
      this.args.spriteSource,
      this.args,
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
  }
}
