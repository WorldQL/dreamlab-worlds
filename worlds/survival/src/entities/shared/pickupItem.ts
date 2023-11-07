import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { EventHandler } from '@dreamlab.gg/core/dist/events'
import type { Camera } from '@dreamlab.gg/core/entities'
import type { ItemOptions } from '@dreamlab.gg/core/managers'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'
import { events } from '../../events'

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
  container: Container
  gfxBounds: Graphics | Sprite
  sprite: Sprite | undefined
}

export const createPickupItem = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(
  ArgsSchema,
  (
    { tags, transform },
    { width, height, spriteSource, itemDisplayName, animationName },
  ) => {
    const { position, zIndex } = transform

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
      { isStatic: true, render: { visible: false }, isSensor: true },
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
        return { width, height }
      },

      isPointInside(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)

        const onPlayerCollisionStart: OnPlayerCollisionStart = (
          [player, bodyCollided],
          _raw,
        ) => {
          if (body && bodyCollided === body && game.client) {
            const inventory = player.inventory

            const itemOptions: ItemOptions = {
              anchorX: 0.5,
              anchorY: 0.5,
              hand: 'right',
            }

            const newItem = inventory.createNewItem(
              itemDisplayName,
              spriteSource,
              animationName,
              itemOptions,
            )
            events.emit('onPlayerNearItem', player, newItem)
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
        const sprite = spriteSource
          ? createSprite(spriteSource, {
              width,
              height,
              zIndex,
            })
          : undefined

        if (sprite) {
          container.addChild(sprite)
        } else {
          drawBox(gfxBounds, { width, height }, { stroke: '#00f' })
          container.addChild(gfxBounds)
        }

        stage.addChild(container)

        return {
          camera,
          container,
          gfxBounds,
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

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep() {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)
      },

      onRenderFrame(_, { game }, { camera, container, gfxBounds }) {
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
  },
)
