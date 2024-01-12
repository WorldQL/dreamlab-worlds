import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, simpleBoundsTest, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import type { Debug } from '@dreamlab.gg/core/utils'
import { drawBox } from '@dreamlab.gg/core/utils'
import type { Container } from 'pixi.js'
import { Graphics } from 'pixi.js'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(1_000),
  height: z.number().positive().min(1).default(1_000),
  zombieTypes: z
    .array(
      z.object({
        width: z.number().default(80),
        height: z.number().default(185),
        maxHealth: z.number().default(5),
        speed: z.number().default(5),
        knockback: z.number().default(2),
      }),
    )
    .default([
      {
        width: 80,
        height: 185,
        maxHealth: 5,
        speed: 5,
        knockback: 2,
      },
    ]),
  bounds: z
    .object({
      width: z.number(),
      height: z.number(),
    })
    .default({ width: 1_000, height: 1_000 }),
  center: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .default({ x: 0, y: 0 }),
  difficulty: z.number().default(1),
  waves: z.number().default(1),
  waveInterval: z.number().default(5),
  endCooldown: z.number().default(60),
})

interface Data {
  debug: Debug
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
}

export const createSpawnRegion = createSpawnableEntity<
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
      if (render && (path === 'width' || path === 'height')) {
        const { width, height } = args
        drawBox(render.gfx, { width, height }, { stroke: 'blue' })
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
      const { width, height } = args

      const gfx = new Graphics()
      gfx.zIndex = transform.zIndex
      drawBox(gfx, { width, height }, { stroke: 'green' })

      stage.addChild(gfx)

      transform.addZIndexListener(() => {
        gfx.zIndex = transform.zIndex
      })

      return { camera, stage, gfx }
    },

    teardown(_) {},

    teardownRenderContext({ gfx }) {
      gfx.destroy()
    },

    onRenderFrame(_, { debug }, { camera, gfx }) {
      const pos = Vec.add(transform.position, camera.offset)

      gfx.position = pos
      gfx.angle = transform.rotation
      gfx.alpha = debug.value ? 0.5 : 0
    },
  }
})
