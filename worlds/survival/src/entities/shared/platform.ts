import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  spriteSource: SpriteSourceSchema.optional(),
})

interface Data {
  game: Game<boolean>
  body: Matter.Body
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
  sprite: Sprite | undefined
}

export const createPlatform = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(ArgsSchema, ({ tags, transform }, args) => {
  const { position, zIndex } = transform

  const PLAYER_CATEGORY = 0x0001
  const PLATFORM_CATEGORY = 0x0002

  const body = Matter.Bodies.rectangle(
    position.x,
    position.y,
    args.width,
    args.height,
    {
      label: 'platform',
      render: { visible: true },
      isStatic: true,
      collisionFilter: {
        category: PLATFORM_CATEGORY,
        mask: PLAYER_CATEGORY,
      },
      friction: 0,
    },
  )

  let isPlatformActive = false

  return {
    get tags() {
      return tags
    },

    get transform() {
      return cloneTransform(transform)
    },

    rectangleBounds() {
      return { width: args.width, height: args.height }
    },

    isPointInside(position) {
      return Matter.Query.point([body], position).length > 0
    },

    onArgsUpdate(path, _data, render) {
      if (render && path === 'spriteSource') {
        const { width, height, spriteSource } = args

        render.sprite?.destroy()
        render.sprite = spriteSource
          ? createSprite(spriteSource, {
              width,
              height,
              zIndex: transform.zIndex,
            })
          : undefined

        if (render.sprite) render.stage.addChild(render.sprite)
      }
    },

    onResize({ width, height }, data, render) {
      const originalWidth = args.width
      const originalHeight = args.height

      args.width = width
      args.height = height

      const scaleX = width / originalWidth
      const scaleY = height / originalHeight

      Matter.Body.setAngle(data.body, 0)
      Matter.Body.scale(data.body, scaleX, scaleY)
      Matter.Body.setAngle(body, toRadians(transform.rotation))

      if (!render) return
      drawBox(render.gfx, { width, height })
      if (render.sprite) {
        render.sprite.width = width
        render.sprite.height = height
      }
    },

    init({ game }) {
      game.physics.register(this, body)

      return { game, body }
    },

    initRenderContext(_, { camera, stage }) {
      const container = new Container()
      container.sortableChildren = true
      container.zIndex = zIndex
      const gfxBounds = new Graphics()
      gfxBounds.zIndex = zIndex
      const sprite = args.spriteSource
        ? createSprite(args.spriteSource, {
            width: args.width,
            height: args.height,
            zIndex,
          })
        : undefined

      if (sprite) {
        container.addChild(sprite)
      } else {
        drawBox(
          gfxBounds,
          { width: args.width, height: args.height },
          { stroke: '#00f' },
        )
        container.addChild(gfxBounds)
      }

      stage.addChild(container)

      return {
        camera,
        stage: container,
        gfx: gfxBounds,
        sprite,
      }
    },

    teardown({ game }) {
      game.physics.unregister(this, body)
    },

    teardownRenderContext({ stage: container }) {
      container.destroy({ children: true })
    },

    onPhysicsStep(_, { game }) {
      Matter.Body.setAngle(body, 0)
      Matter.Body.setAngularVelocity(body, 0)

      const playerBody = Matter.Composite.allBodies(
        game.physics.engine.world,
      ).find(b => b.label === 'player')

      if (!playerBody) return

      const inputs = game.client?.inputs
      const isCrouching = inputs?.getInput('@player/crouch') ?? false

      if (isPlatformActive) {
        if (isCrouching) {
          isPlatformActive = false
        }
      } else if (
        Matter.Query.collides(body, [playerBody]).length > 0 &&
        !isCrouching
      ) {
        const playerHeight = 370 // need to add player.height to the player entity
        const playerAbovePlatform =
          playerBody.position.y + playerHeight / 2 <
          (body.position.y + body.bounds.min.y) / 2

        const playerMovingDownward = playerBody.velocity.y > 0

        isPlatformActive = Boolean(playerAbovePlatform && playerMovingDownward)
      }

      body.collisionFilter.mask = isPlatformActive ? PLAYER_CATEGORY : 0x0000
      body.isSensor = !isPlatformActive
    },

    onRenderFrame(
      { smooth },
      { game },
      { camera, stage: container, gfx: gfxBounds, sprite },
    ) {
      const debug = game.debug
      const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
      const pos = Vec.add(smoothed, camera.offset)

      container.position = pos
      container.rotation = body.angle

      const activeAlpha = 1
      const inactiveAlpha = 0.5

      const platformAlpha = isPlatformActive ? activeAlpha : inactiveAlpha
      gfxBounds.alpha = platformAlpha

      if (sprite) {
        sprite.alpha = platformAlpha
      }

      const debugAlpha = debug.value ? 0.5 : 0
      gfxBounds.alpha = debug.value ? debugAlpha : platformAlpha
    },
  }
})
