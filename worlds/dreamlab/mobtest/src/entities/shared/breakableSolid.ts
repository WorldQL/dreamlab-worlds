import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, toRadians, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'

const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  spriteSource: SpriteSourceSchema,
})

interface Data {
  game: Game<boolean>
  bodyLeft: Matter.Body
  bodyRight: Matter.Body
}

interface Render {
  camera: Camera
  container: Container
  gfxBoundsLeft: Graphics | Sprite
  gfxBoundsRight: Graphics | Sprite
}

export const createBreakableSolid = createSpawnableEntity<
  typeof ArgsSchema,
  SpawnableEntity<Data, Render>,
  Data,
  Render
>(
  ArgsSchema,
  ({ tags, transform, zIndex }, { width, height, spriteSource }) => {
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

    const createBody = (px: number, py: number, wd: number, ht: number) =>
      Matter.Bodies.rectangle(px, py, wd, ht, bodyOptions)

    let bodyLeft: Matter.Body
    let bodyRight: Matter.Body

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

    const hasAttacker = (entities: Matter.Body[]) => {
      return entities.some(
        (ev: { label: string }) => ev.label === 'player' || ev.label === 'item',
      )
    }

    return {
      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      rectangleBounds() {
        // TODO
        return undefined
      },

      isPointInside(position) {
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

        let gfxBoundsLeft
        let gfxBoundsRight

        if (spriteSource) {
          gfxBoundsLeft = createSprite(spriteSource, {
            width: halfWidth,
            height,
          })
          gfxBoundsRight = createSprite(spriteSource, {
            width: halfWidth,
            height,
          })

          gfxBoundsLeft.anchor.set(0.5, 0.5)
          gfxBoundsRight.anchor.set(0.5, 0.5)
        } else {
          gfxBoundsLeft = new Graphics()
          gfxBoundsRight = new Graphics()
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
        }

        container.addChild(gfxBoundsLeft, gfxBoundsRight)
        stage.addChild(container)

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
        const getEntitiesInAreaOfBody = (
          body: Matter.Body,
          halfW: number,
          ht: number,
        ) => {
          return Matter.Query.region(
            game.physics.engine.world.bodies,
            Matter.Bounds.create([
              { x: body.position.x - halfW / 4, y: body.position.y - ht / 2 },
              { x: body.position.x + halfW / 4, y: body.position.y + ht / 2 },
            ]),
          )
        }

        const entitiesInAreaLeft = getEntitiesInAreaOfBody(
          bodyLeft,
          halfWidth,
          height,
        )
        const entitiesInAreaRight = getEntitiesInAreaOfBody(
          bodyRight,
          halfWidth,
          height,
        )

        if (
          (hasAttacker(entitiesInAreaLeft) ||
            hasAttacker(entitiesInAreaRight)) &&
          !isBroken
        ) {
          isBroken = true
          for (const body of [bodyLeft, bodyRight]) {
            Matter.Body.setStatic(body, false)
            const forceDirection = body === bodyLeft ? -0.05 : 0.05
            Matter.Body.applyForce(
              body,
              {
                x: body.position.x + halfWidth * forceDirection,
                y: body.position.y,
              },
              { x: forceDirection, y: 0 },
            )
          }
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

        if (!spriteSource) {
          const alpha = debug.value ? 0.5 : 0
          gfxBoundsLeft.alpha = alpha
          gfxBoundsRight.alpha = alpha
        }
      },
    }
  },
)
