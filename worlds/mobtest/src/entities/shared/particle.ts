import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'

const ParticleArgsSchema = z.object({
  radius: z.number().positive().min(1),
  spriteSource: SpriteSourceSchema.optional(),
})

interface ParticleData {
  game: Game<boolean>
  body: Matter.Body
}

interface ParticleRender {
  camera: Camera
  container: Container
  gfxCircle: Graphics
  sprite: Sprite | undefined
}

export const createParticle = createSpawnableEntity<
  typeof ParticleArgsSchema,
  SpawnableEntity<ParticleData, ParticleRender>,
  ParticleData,
  ParticleRender
>(
  ParticleArgsSchema,
  ({ tags, transform, zIndex }, { radius, spriteSource }) => {
    const { position } = transform

    const randomDirection = Math.random() * 2 * Math.PI
    const randomSpeed = Math.random() * 9 + 1

    const body = Matter.Bodies.circle(position.x, position.y, radius, {
      label: 'particle',
      render: { visible: false },
      density: 0.001,
      frictionAir: 0,
      friction: 0.1,
      restitution: 0.7,
    })

    return {
      tags,
      transform: cloneTransform(transform),

      isInBounds(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)
        return { game, body }
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex

        const gfxCircle = new Graphics()
        const sprite = spriteSource
          ? createSprite(spriteSource, {
              width: radius * 2,
              height: radius * 2,
              zIndex,
            })
          : undefined

        if (sprite) {
          container.addChild(sprite)
        } else {
          gfxCircle.beginFill(0xff0000)
          gfxCircle.drawCircle(0, 0, radius)
          gfxCircle.endFill()
          container.addChild(gfxCircle)
        }

        stage.addChild(container)

        return { camera, container, gfxCircle, sprite }
      },

      teardown({ game }) {
        game.physics.unregister(this, body)
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_, { body }) {
        const velocity = {
          x: randomSpeed * Math.cos(randomDirection),
          y: randomSpeed * Math.sin(randomDirection),
        }
        Matter.Body.setVelocity(body, velocity)
      },

      onRenderFrame(_, { game }, { camera, container, gfxCircle }) {
        const debug = game.debug
        const pos = Vec.add(body.position, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 1
        gfxCircle.alpha = alpha
      },
    }
  },
)
