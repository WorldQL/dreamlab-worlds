import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { EventHandler } from '@dreamlab.gg/core/dist/events'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import type { Debug } from '@dreamlab.gg/core/utils'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import type { Container } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { events } from '../../events'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(1_000),
  height: z.number().positive().min(1).default(1_000),
  zombieTypes: z
    .array(
      z.object({
        width: z.number(),
        height: z.number(),
        maxHealth: z.number(),
        speed: z.number(),
        knockback: z.number(),
      }),
    )
    .default([
      {
        width: 80,
        height: 185,
        maxHealth: 8,
        speed: 3,
        knockback: 1.5,
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
  waves: z.number().default(3),
  waveInterval: z.number().default(2),
  endCooldown: z.number().default(15),
})

interface Data {
  game: Game<false>
  debug: Debug
  onPlayerCollisionStart: EventHandler<'onPlayerCollisionStart'>
  onPlayerCollisionEnd: EventHandler<'onPlayerCollisionEnd'>
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
>(ArgsSchema, ({ uid, tags, transform }, args) => {
  const trigger = Matter.Bodies.rectangle(
    transform.position.x,
    transform.position.y,
    args.width,
    args.height,
    {
      label: 'region_trigger',
      render: { visible: false },
      angle: toRadians(transform.rotation),

      isStatic: true,
      isSensor: true,
    },
  )

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
      return Matter.Query.point([trigger], position).length > 0
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

    init({ game, physics }) {
      physics.register(this, trigger)
      physics.linkTransform(trigger, transform)

      const onPlayerCollisionStart: EventHandler<
        'onPlayerCollisionStart'
      > = async ([_player, other]) => {
        if (other !== trigger) return
        events.emit('onRegionStart', uid)
      }

      const onPlayerCollisionEnd: EventHandler<
        'onPlayerCollisionEnd'
      > = async ([_player, other]) => {
        if (other !== trigger) return
        events.emit('onRegionEnd', uid)
      }

      game.events.client?.addListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )

      game.events.client?.addListener(
        'onPlayerCollisionEnd',
        onPlayerCollisionEnd,
      )

      return {
        game,
        debug: game.debug,
        onPlayerCollisionStart,
        onPlayerCollisionEnd,
      }
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

    teardown({ game, onPlayerCollisionStart, onPlayerCollisionEnd }) {
      game.events.client?.removeListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )

      game.events.client?.removeListener(
        'onPlayerCollisionEnd',
        onPlayerCollisionEnd,
      )
    },

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
