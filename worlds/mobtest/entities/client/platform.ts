// WIP
import { createSpawnableEntity } from '@dreamlab.gg/core'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/dist/math'
import { drawBox } from '@dreamlab.gg/core/dist/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

export const createPlatform = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    spriteSource: string,
  ) => {
    const { position } = transform

    const PLAYER_CATEGORY = 0x0001
    const PLATFORM_CATEGORY = 0x0002

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
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

    return {
      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      isInBounds() {
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
        const gfxBounds = new Graphics()
        gfxBounds.zIndex = zIndex
        const sprite = createSprite(spriteSource, {
          width,
          height,
          zIndex,
        })

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

      teardown({ game }) {
        game.physics.unregister(this, body)
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_, { game }) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)

        const playerBody = Matter.Composite.allBodies(
          game.physics.engine.world,
        ).find(b => b.label === 'player')

        if (!playerBody) return

        const collisions = Matter.Query.collides(body, [playerBody])

        const inputs = game.client?.inputs
        const isCrouching = inputs?.getInput('@player/crouch') ?? false

        body.collisionFilter.mask =
          collisions.length > 0 && isCrouching ? 0x0000 : PLAYER_CATEGORY

        body.isSensor = Boolean(collisions.length > 0 && isCrouching)
      },

      onRenderFrame(
        { smooth },
        { game },
        { camera, container, gfxBounds, sprite },
      ) {
        const debug = game.debug
        const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
        const pos = Vec.add(smoothed, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha

        if (sprite) {
          sprite.position = pos
        }
      },
    }
  },
)
