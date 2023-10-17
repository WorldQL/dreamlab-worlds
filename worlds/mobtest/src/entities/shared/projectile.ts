import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'

const ArgsSchema = z.object({
  radius: z.number().positive().min(1),
  direction: z.number(),
  spriteSource: SpriteSourceSchema,
})

interface Data {
  game: Game<boolean>
  body: Matter.Body
}

interface Render {
  camera: Camera
  container: Container
  gfxBounds: Graphics
  sprite: Sprite | undefined
}

export const createProjectile = createSpawnableEntity<
  typeof ArgsSchema,
  SpawnableEntity<Data, Render>,
  Data,
  Render
>(
  ArgsSchema,
  ({ tags, transform, zIndex }, { radius, direction, spriteSource }) => {
    const { position } = transform

    const body = Matter.Bodies.circle(position.x, position.y, radius, {
      isStatic: false,
      label: 'projectile',
      render: { visible: false },
      density: 0.001,
      frictionAir: 0,
      friction: 1,
      restitution: 0,
    })

    const speed = 2
    const velocity = { x: direction * speed, y: 0 }

    return {
      tags,

      transform: cloneTransform(transform),

      isInBounds(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)
        Matter.Body.setVelocity(body, velocity)
        return { game, body }
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex

        const gfxBounds = new Graphics()
        const sprite = spriteSource
          ? createSprite(spriteSource, {
              width: radius / 2,
              height: radius / 2,
              zIndex,
            })
          : undefined

        if (sprite) {
          container.addChild(sprite)
        } else {
          drawBox(
            gfxBounds,
            { width: radius / 2, height: radius / 2 },
            { stroke: '#00f' },
          )
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

      teardown({ game }) {
        game.physics.unregister(this, body)
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)
      },

      onRenderFrame(_, { game }, { camera, container, gfxBounds }) {
        const debug = game.debug
        const pos = Vec.add(position, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
      },
    }
  },
)
