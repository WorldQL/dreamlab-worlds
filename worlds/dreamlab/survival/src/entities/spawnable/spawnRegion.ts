import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { EventHandler } from '@dreamlab.gg/core/dist/events'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import type { SyncedValue } from '@dreamlab.gg/core/network'
import { syncedValue } from '@dreamlab.gg/core/network'
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
        width: 100,
        height: 200,
        maxHealth: 10,
        speed: 3,
        knockback: 1.25,
      },
    ]),
  zombiesPerWave: z.number().default(1),
  waves: z.number().default(3),
  waveInterval: z.number().default(25),
  endCooldown: z.number().default(15),
})

type zombiePosition = { x: number; y: number }[] | undefined

interface RegionData {
  isCooldown: number
  waveStarted: number
  regionActive: number
  positions: zombiePosition
}

interface Data {
  game: Game<false>
  debug: Debug
  body: Matter.Body
  regionData: SyncedValue<RegionData>
  onPlayerCollisionStart: EventHandler<'onPlayerCollisionStart'>
  onPlayerCollisionEnd: EventHandler<'onPlayerCollisionEnd'>
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
  gfxCircle: Graphics
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

    init({ game, physics }) {
      physics.register(this, trigger)
      physics.linkTransform(trigger, transform)

      const regionData = syncedValue(game, uid, 'regionData', {
        isCooldown: 0,
        waveStarted: 0,
        regionActive: 0,
        positions: undefined as zombiePosition,
      })

      const onPlayerCollisionStart: EventHandler<
        'onPlayerCollisionStart'
      > = async ([_player, other]) => {
        if (other !== trigger) return
        events.emit('onEnterRegion', uid)
      }

      const onPlayerCollisionEnd: EventHandler<
        'onPlayerCollisionEnd'
      > = async ([_player, other]) => {
        if (other !== trigger) return
        events.emit('onExitRegion', uid)
      }

      events.on('onRegionZombieSpawning', positions => {
        regionData.value.positions = Array.isArray(positions)
          ? positions
          : undefined

        setTimeout(() => {
          regionData.value.positions = undefined
        }, 3_000)
      })

      events.on('onRegionCooldownStart', regionId => {
        if (uid === regionId) {
          regionData.value.isCooldown = 1
        }
      })

      events.on('onRegionCooldownEnd', regionId => {
        if (uid === regionId) {
          regionData.value.isCooldown = 0
        }
      })

      events.on('onRegionWaveStart', regionId => {
        if (uid === regionId) {
          regionData.value.waveStarted = 1
          setTimeout(() => {
            regionData.value.waveStarted = 0
          }, 2_000)
        }
      })

      events.on('onRegionStart', regionId => {
        if (uid === regionId) {
          regionData.value.regionActive = 1
        }
      })

      events.on('onRegionEnd', regionId => {
        if (uid === regionId) {
          regionData.value.regionActive = 0
        }
      })

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
        body: trigger,
        regionData,
        onPlayerCollisionStart,
        onPlayerCollisionEnd,
      }
    },

    initRenderContext(_, { stage, camera }) {
      const { width, height } = args

      const gfx = new Graphics()
      gfx.zIndex = transform.zIndex
      drawBox(gfx, { width, height }, { stroke: 'black' })

      const gfxCircle = new Graphics()
      gfxCircle.zIndex = transform.zIndex

      stage.addChild(gfx)
      stage.addChild(gfxCircle)

      transform.addZIndexListener(() => {
        gfx.zIndex = transform.zIndex
        gfxCircle.zIndex = transform.zIndex
      })

      return { camera, stage, gfx, gfxCircle }
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

    onArgsUpdate(path, previous, data, render) {
      if (path === 'width' || path === 'height') {
        const { width: originalWidth, height: originalHeight } = previous
        const { width, height } = args

        const scaleX = width / originalWidth
        const scaleY = height / originalHeight

        Matter.Body.setAngle(data.body, 0)
        Matter.Body.scale(data.body, scaleX, scaleY)
        Matter.Body.setAngle(trigger, toRadians(transform.rotation))

        if (render) {
          drawBox(render.gfx, { width, height }, { stroke: 'black' })
        }
      }
    },

    onResize({ width, height }) {
      args.width = width
      args.height = height
    },

    onRenderFrame(_, { debug, regionData }, { camera, gfx, gfxCircle }) {
      const pos = Vec.add(transform.position, camera.offset)

      gfx.clear()
      gfxCircle.clear()

      let fill = 0x0
      let fillAlpha = 0
      let stroke = regionData.value.regionActive === 1 ? 0x38761d : 0x0
      const strokeWidth = 8
      let strokeAlpha = 1

      if (regionData.value.isCooldown === 1) {
        fill = 0x85c1e9
        fillAlpha = 0.5
        stroke = 0x3498db
        strokeAlpha = 1
      }

      if (regionData.value.waveStarted === 1) {
        fill = 0x0
        fillAlpha = 0
        stroke = 0x9b0000
        strokeAlpha = 1
      }

      drawBox(
        gfx,
        { width: args.width, height: args.height },
        {
          fill,
          fillAlpha,
          stroke,
          strokeWidth,
          strokeAlpha,
        },
      )
      const pulseColors = [0xff0000, 0xd10000]
      const timeBasedIndex = Math.floor(Date.now() / 250) % pulseColors.length
      const currentColor = pulseColors[timeBasedIndex]

      if (regionData.value.positions) {
        for (const { x, y } of Object.values(regionData.value.positions)) {
          const adjustedX = x + camera.offset.x
          const adjustedY = y + camera.offset.y

          gfxCircle.beginFill(currentColor)
          gfxCircle.drawCircle(adjustedX, adjustedY, 75)
          gfxCircle.alpha = 0.5
          gfxCircle.endFill()
        }
      }

      gfx.position.set(pos.x, pos.y)
      gfx.rotation = toRadians(transform.rotation)
      gfx.alpha = debug.value ? 0.5 : 0
    },
  }
})
