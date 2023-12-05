import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, simpleBoundsTest, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import type { Debug } from '@dreamlab.gg/core/utils'
import { drawBox } from '@dreamlab.gg/core/utils'
import type { Container, Sprite } from 'pixi.js'
import { Graphics } from 'pixi.js'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  spriteSource: SpriteSourceSchema.optional(),
})

interface Data {
  debug: Debug
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
  sprite: Sprite | undefined
}

export const createRegion = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(ArgsSchema, ({ tags, transform }, args) => {
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

    isPointInside(point) {
      return simpleBoundsTest(
        { width: args.width, height: args.height },
        transform,
        point,
      )
    },

    onArgsUpdate(path, _previous, _data, render) {
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

    onResize({ width, height }) {
      args.width = width
      args.height = height
    },

    init({ game }) {
      return { debug: game.debug }
    },

    initRenderContext(_, { stage, camera }) {
      const { width, height, spriteSource } = args

      const gfx = new Graphics()
      gfx.zIndex = transform.zIndex + 1
      drawBox(gfx, { width, height }, { stroke: 'green' })

      const sprite = spriteSource
        ? createSprite(spriteSource, {
            width,
            height,
            zIndex: transform.zIndex,
          })
        : undefined

      stage.addChild(gfx)
      if (sprite) stage.addChild(sprite)

      transform.addZIndexListener(() => {
        gfx.zIndex = transform.zIndex + 1
        if (sprite) sprite.zIndex = transform.zIndex
      })

      return { camera, stage, gfx, sprite }
    },

    teardown(_) {},

    teardownRenderContext({ gfx, sprite }) {
      gfx.destroy()
      sprite?.destroy()
    },

    onRenderFrame(_, { debug }, { camera, gfx, sprite }) {
      const pos = Vec.add(transform.position, camera.offset)

      gfx.position = pos
      gfx.angle = transform.rotation
      gfx.alpha = debug.value ? 0.5 : 0

      if (sprite) {
        sprite.position = pos
        sprite.angle = transform.rotation
      }
    },
  }
})
