import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import type { EventHandler } from '@dreamlab.gg/core/events'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
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
  direction: z.number(),
  spriteSource: SpriteSourceSchema.optional(),
})

type OnCollisionStart = EventHandler<'onCollisionStart'>

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onCollisionStart: OnCollisionStart
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  sprite: Sprite | undefined
}

export const createProjectile = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(
  ArgsSchema,
  ({ uid, tags, transform }, { width, height, direction, spriteSource }) => {
    const { position, rotation, zIndex } = transform

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
      {
        label: 'Projectile',
        render: { visible: false },
        density: 0.001,
        frictionAir: 0,
        friction: 1,
        restitution: 0,
      },
    )

    return {
      get tags() {
        return [...tags, 'Projectile']
      },

      transform: cloneTransform(transform),

      rectangleBounds() {
        return { width, height }
      },

      isPointInside(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)

        const onCollisionStart: OnCollisionStart = async ([a, b]) => {
          if (a.uid === uid || b.uid === uid) {
            const other = a.uid === uid ? b : a

            if (!other.tags.includes('Projectile')) {
              await game.destroy(this as SpawnableEntity)
            }
          }
        }

        game.events.common.addListener('onCollisionStart', onCollisionStart)

        return { game, body, onCollisionStart }
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

      teardown({ game, onCollisionStart }) {
        game.physics.unregister(this, body)
        game.events.common.removeListener('onCollisionStart', onCollisionStart)
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_) {
        Matter.Body.setAngle(body, rotation)

        const speed = 50
        const velocity = {
          x: speed * Math.cos(rotation) * direction,
          y: speed * Math.sin(rotation),
        }
        Matter.Body.setVelocity(body, velocity)
      },

      onRenderFrame(_, { game }, { camera, container, gfxBounds }) {
        const debug = game.debug
        const pos = Vec.add(body.position, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
      },
    }
  },
)
