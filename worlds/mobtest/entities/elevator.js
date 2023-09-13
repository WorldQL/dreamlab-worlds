import { createSpawnableEntity } from '@dreamlab.gg/core'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

export const createElevator = createSpawnableEntity(
  ({ tags, transform, zIndex }) => {
    const { position } = transform

    const width = 150
    const height = 1_000
    const body = Matter.Bodies.rectangle(
        position.x,
        position.y,
        width,
        height,
        {
          label: 'solid',
          render: { visible: false },
  
          isStatic: true,
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
        drawBox(gfxBounds, { width, height }, { stroke: '#00f' })

        container.addChild(gfxBounds)
        stage.addChild(container)

        return {
          camera,
          container,
          gfxBounds,
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

        const entitiesInArea = Matter.Query.region(
          game.physics.engine.world.bodies,
          Matter.Bounds.create([
            {
              x: body.position.x - width / 2,
              y: body.position.y - height / 2,
            },
            {
              x: body.position.x + width / 2,
              y: body.position.y + height / 2,
            },
          ]),
        )

        const player = entitiesInArea.find(ev => ev.label === 'player')
        if (player) {
            Matter.Body.applyForce(player, player.position, { x: 0, y: -0.5 });
        }
      },

      onRenderFrame({ smooth }, { game }, { camera, container, gfxBounds }) {
        const debug = game.debug
        const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
        const pos = Vec.add(smoothed, camera.offset)

        container.position = pos
        container.rotation = body.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
      },
    }
  },
)
