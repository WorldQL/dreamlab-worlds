import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { EventHandler } from '@dreamlab.gg/core/dist/events'
import type { Camera } from '@dreamlab.gg/core/entities'
import { createItem } from '@dreamlab.gg/core/managers'
import type { ItemOptions } from '@dreamlab.gg/core/managers'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'
import { events } from '../../events'
import type { InventoryItem } from '../../inventory/inventoryManager'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  spriteSource: z.string(),
  itemDisplayName: z.string(),
  animationName: z.string(),
})

type OnPlayerCollisionStart = EventHandler<'onPlayerCollisionStart'>
type OnPlayerCollisionEnd = EventHandler<'onPlayerCollisionEnd'>

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onPlayerCollisionStart: OnPlayerCollisionStart
  onPlayerCollisionEnd: OnPlayerCollisionEnd
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
  sprite: Sprite | undefined
}

export const createPickupItem = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(ArgsSchema, ({ tags, transform }, args) => {
  const { position, zIndex } = transform

  const body = Matter.Bodies.rectangle(
    position.x,
    position.y,
    args.width,
    args.height,
    {
      isStatic: true,
      render: { visible: false },
      isSensor: true,
    },
  )

  let time = 0
  const floatHeight = 5
  const rotationSpeed = 0.01

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

      const onPlayerCollisionStart: OnPlayerCollisionStart = (
        [player, bodyCollided],
        _raw,
      ) => {
        if (body && bodyCollided === body && game.client) {
          const itemOptions: ItemOptions = {
            anchorX: 0.5,
            anchorY: 0.5,
            hand: 'right',
          }

          const newItem = createItem(
            args.itemDisplayName,
            args.spriteSource,
            args.animationName,
            itemOptions,
          )

          console.log(newItem)

          const inventoryItem: InventoryItem = {
            baseItem: newItem,
            damage: 1,
          }

          events.emit('onPlayerNearItem', player, inventoryItem)
        }
      }

      const onPlayerCollisionEnd: OnPlayerCollisionEnd = (
        [player, bodyCollided],
        _raw,
      ) => {
        if (body && bodyCollided === body) {
          events.emit('onPlayerNearItem', player, undefined)
        }
      }

      game.events.common.addListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )
      game.events.common.addListener(
        'onPlayerCollisionEnd',
        onPlayerCollisionEnd,
      )

      return { game, body, onPlayerCollisionStart, onPlayerCollisionEnd }
    },

    initRenderContext(_, { camera, stage }) {
      const container = new Container()
      container.sortableChildren = true
      container.zIndex = zIndex

      const gfxBounds = new Graphics()
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

    teardown({ game, onPlayerCollisionStart, onPlayerCollisionEnd }) {
      game.physics.unregister(this, body)
      game.events.common.removeListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )
      game.events.common.removeListener(
        'onPlayerCollisionEnd',
        onPlayerCollisionEnd,
      )
    },

    teardownRenderContext({ stage: container }) {
      container.destroy({ children: true })
    },

    onPhysicsStep() {
      Matter.Body.setAngle(body, 0)
      Matter.Body.setAngularVelocity(body, 0)
    },

    onRenderFrame(_, { game }, { camera, stage: container, gfx: gfxBounds }) {
      time += 0.05

      const yOffset = Math.sin(time) * floatHeight
      const pos = Vec.add(position, camera.offset)
      pos.y += yOffset

      container.rotation += rotationSpeed

      container.position = pos

      const debug = game.debug
      const alpha = debug.value ? 0.5 : 0
      gfxBounds.alpha = alpha
    },
  }
})
