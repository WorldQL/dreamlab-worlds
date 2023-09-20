import { createSpawnableEntity } from '@dreamlab.gg/core'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

export const createBreakableSolid = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    spriteSource?: string,
  ) => {
    const { position, rotation } = transform

    const halfWidth = width / 2

    const bodyOptions = {
      label: 'breakable_solid_piece',
      render: { visible: true },
      angle: toRadians(rotation),
      isStatic: true,
      friction: 0.5,
      restitution: 0.8,
      mass: 20,
    }

    const splitVertically =
      (rotation >= 45 && rotation < 135) || (rotation >= 225 && rotation < 315)

    const createBody = (px: number, py: number, w: number, h: number) =>
      Matter.Bodies.rectangle(px, py, w, h, bodyOptions)

    let bodyLeft: Matter.Body, bodyRight: Matter.Body

    if (splitVertically) {
      bodyLeft = createBody(position.x, position.y, halfWidth, height)
      bodyRight = createBody(
        position.x,
        position.y + halfWidth,
        halfWidth,
        height,
      )
    } else {
      bodyLeft = createBody(position.x, position.y, halfWidth, height)
      bodyRight = createBody(
        position.x + halfWidth,
        position.y,
        halfWidth,
        height,
      )
    }

    let isBroken = false

    return {
      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      isInBounds(position) {
        return (
          Matter.Query.point([bodyLeft], position).length > 0 ||
          Matter.Query.point([bodyRight], position).length > 0
        )
      },

      init({ game }) {
        game.physics.register(this, bodyLeft)
        game.physics.register(this, bodyRight)
        return { game, bodyLeft, bodyRight }
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex

        const gfxBoundsLeft = new Graphics()
        const gfxBoundsRight = new Graphics()

        if (!spriteSource) {
          drawBox(
            gfxBoundsLeft,
            { width: halfWidth, height },
            { stroke: '#964B00' },
          )
          drawBox(
            gfxBoundsRight,
            { width: halfWidth, height },
            { stroke: '#964B00' },
          )

          container.addChild(gfxBoundsLeft, gfxBoundsRight)
          stage.addChild(container)
        } else {
          // handle sprites
        }

        return {
          camera,
          container,
          gfxBoundsLeft,
          gfxBoundsRight,
        }
      },

      teardown({ game }) {
        game.physics.unregister(this, bodyLeft)
        game.physics.unregister(this, bodyRight)
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_, { game }) {
        const entitiesInAreaLeft = Matter.Query.region(
          game.physics.engine.world.bodies,
          Matter.Bounds.create([
            {
              x: bodyLeft.position.x - halfWidth / 4,
              y: bodyLeft.position.y - height / 2,
            },
            {
              x: bodyLeft.position.x + halfWidth / 4,
              y: bodyLeft.position.y + height / 2,
            },
          ]),
        )

        const entitiesInAreaRight = Matter.Query.region(
          game.physics.engine.world.bodies,
          Matter.Bounds.create([
            {
              x: bodyRight.position.x - halfWidth / 4,
              y: bodyRight.position.y - height / 2,
            },
            {
              x: bodyRight.position.x + halfWidth / 4,
              y: bodyRight.position.y + height / 2,
            },
          ]),
        )

        const attackerLeft = entitiesInAreaLeft.find(
          ev => ev.label === 'player' || ev.label === 'weapon',
        )
        const attackerRight = entitiesInAreaRight.find(
          ev => ev.label === 'player' || ev.label === 'weapon',
        )

        if ((attackerLeft || attackerRight) && !isBroken) {
          isBroken = true

          Matter.Body.setStatic(bodyLeft, false)
          Matter.Body.setStatic(bodyRight, false)
          Matter.Body.applyForce(
            bodyLeft,
            { x: bodyLeft.position.x - halfWidth / 2, y: bodyLeft.position.y },
            { x: -0.05, y: 0 },
          )
          Matter.Body.applyForce(
            bodyRight,
            {
              x: bodyRight.position.x + halfWidth / 2,
              y: bodyRight.position.y,
            },
            { x: 0.05, y: 0 },
          )
        }
      },

      onRenderFrame(_, { game }, { camera, gfxBoundsLeft, gfxBoundsRight }) {
        const debug = game.debug
        const posLeft = Vec.add(bodyLeft.position, camera.offset)
        const posRight = Vec.add(bodyRight.position, camera.offset)

        gfxBoundsLeft.position = posLeft
        gfxBoundsRight.position = posRight

        gfxBoundsLeft.rotation = bodyLeft.angle
        gfxBoundsRight.rotation = bodyRight.angle

        const alpha = debug.value ? 0.5 : 0
        gfxBoundsLeft.alpha = alpha
        gfxBoundsRight.alpha = alpha
      },
    }
  },
)
