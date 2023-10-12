import { createSpawnableEntity } from '@dreamlab.gg/core'
import { toDegrees, toRadians, Vec } from '@dreamlab.gg/core/math'
import { drawCircle } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Graphics } from 'pixi.js'

export const createTestBall = createSpawnableEntity(
  ({ transform, zIndex, tags, preview }, radius) => {
    // Every object gets a transform automatically, this hold position and rotation information.
    const { position, rotation } = transform

    const mass = 20

    // Create our bouncy ball's physics body.
    const body = Matter.Bodies.circle(position.x, position.y, radius, {
      label: 'testBall',
      render: { visible: false },
      angle: toRadians(rotation),
      // the "preview" variable is true if the object isn't placed in the world yet but is a floating preview.
      // This is used to make your object compatible with the in-game level editor, so it doesn't collide while a preview.
      isStatic: preview,
      isSensor: preview,

      mass,
      inverseMass: 1 / mass,
      // The bounciness of the ball.
      restitution: 0.95,

      // You can also set initial inertia but we don't for this example.
      // inertia: Number.POSITIVE_INFINITY,
      // inverseInertia: 0,
    })

    return {
      get transform() {
        return {
          position: Vec.clone(body.position),
          rotation: toDegrees(body.angle),
        }
      },

      // Tags are used to identify certain entity types. For example, "enemy", "hpPowerUp", etc.
      // these are similar to Tags in Unity
      get tags() {
        return tags
      },

      // Determine whether the camera should render this entity.
      isInBounds(position) {
        return Matter.Query.point([body], position).length > 0
      },

      // Run when the entity is first initialized on the client or the server.
      init({ game, physics }) {
        const debug = game.debug
        physics.register(this, body)

        return { debug, physics, body }
      },

      // Run when the entity is initialized ONLY on the client.
      initRenderContext(_, { stage, camera }) {
        const gfx = new Graphics()
        gfx.zIndex = zIndex + 1
        drawCircle(gfx, { radius })

        stage.addChild(gfx)

        return { camera, gfx }
      },

      // Run when entity is destroyed.
      teardown({ physics, body }) {
        physics.unregister(this, body)
      },
      // Run when entity is destroyed, only run on client.
      teardownRenderContext({ gfx }) {
        gfx.destroy()
      },

      onRenderFrame(_, { body }, { camera, gfx }) {
        // Get the position of the entity relative to the camera.
        const pos = Vec.add(body.position, camera.offset)
        // update the position and rotation in screen space terms.
        gfx.position = pos
        gfx.rotation = body.angle
        gfx.alpha = 1
      },
    }
  },
)
