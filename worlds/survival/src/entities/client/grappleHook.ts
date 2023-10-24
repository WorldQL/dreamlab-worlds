import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { Camera } from '@dreamlab.gg/core/entities'
import { cloneTransform, distance, Vec } from '@dreamlab.gg/core/math'
import type { Vector } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'

let cursorPosition: Vector | undefined

const onPointerOut = (): void => {
  cursorPosition = undefined
}

const onPointerMove = (ev: PointerEvent, camera: Camera): void => {
  const screenPosition = Vec.create(ev.offsetX, ev.offsetY)
  cursorPosition = camera.localToWorld(screenPosition)
}

const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  mustConnectWithBody: z.boolean().default(false),
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

export const createGrappleHook = createSpawnableEntity<
  typeof ArgsSchema,
  SpawnableEntity<Data, Render>,
  Data,
  Render
>(
  ArgsSchema,
  (
    { tags, transform, zIndex },
    { width, height, mustConnectWithBody, spriteSource },
  ) => {
    const { position } = transform

    const HOOK_CATEGORY = 0x0004

    const body = Matter.Bodies.circle(position.x, position.y, 10, {
      label: 'grapplingHook',
      render: { visible: false },
      collisionFilter: {
        category: HOOK_CATEGORY,
        mask: 0x0000,
      },

      frictionAir: 0.2,
    })

    let hasReachedTarget = false

    return {
      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      get zIndex() {
        return zIndex
      },

      isInBounds() {
        return false
      },

      init({ game }) {
        game.physics.register(this, body)
        game.client?.inputs.registerInput('@dreamlab/hook', 'KeyQ')

        return { game, body }
      },

      initRenderContext({ game }, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex
        const gfxBounds = new Graphics()
        gfxBounds.zIndex = zIndex
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
          gfxBounds.beginFill(0x404040)
          gfxBounds.drawCircle(0, 0, 10)
          gfxBounds.endFill()
          container.addChild(gfxBounds)
        }

        stage.addChild(container)

        game.client?.render.container.addEventListener('pointerover', ev =>
          onPointerMove(ev, camera),
        )
        game.client?.render.container.addEventListener(
          'pointerout',
          onPointerOut,
        )
        game.client?.render.container.addEventListener('pointermove', ev =>
          onPointerMove(ev, camera),
        )

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
        const playerBody = Matter.Composite.allBodies(
          game.physics.engine.world,
        ).find(b => b.label === 'player')
        if (!playerBody) return

        const inputs = game.client?.inputs
        const isCrouching = inputs?.getInput('@dreamlab/hook') ?? false

        if (isCrouching && cursorPosition) {
          if (mustConnectWithBody) {
            const bodiesAtCursor = Matter.Query.point(
              Matter.Composite.allBodies(game.physics.engine.world),
              cursorPosition,
            )

            if (bodiesAtCursor.length === 0) {
              return
            }
          }

          if (body.render.visible === false) {
            Matter.Body.setPosition(body, playerBody.position)
            body.render.visible = true
          }

          const reachedTarget = distance(body.position, cursorPosition) <= 1

          if (!reachedTarget) {
            const dir = Vec.normalise(Vec.sub(cursorPosition, body.position))
            const forceMagnitude = 0.005
            const force = Vec.mult(dir, forceMagnitude)
            Matter.Body.applyForce(body, body.position, force)
          } else {
            hasReachedTarget = true
            Matter.Body.setVelocity(body, { x: 0, y: 0 })
            const playerToHookDirection = Vec.normalise(
              Vec.sub(body.position, playerBody.position),
            )
            const pullForceMagnitude = 1.5
            const pullForce = Vec.mult(
              playerToHookDirection,
              pullForceMagnitude,
            )
            Matter.Body.applyForce(playerBody, playerBody.position, pullForce)
          }
        } else if (!isCrouching) {
          body.render.visible = false
        }
      },

      onRenderFrame(_, { game }, { camera, container, gfxBounds, sprite }) {
        if (body.render.visible) {
          const debug = game.debug
          const pos = Vec.add(body.position, camera.offset)
          gfxBounds.visible = true
          container.position = pos

          if (!hasReachedTarget && cursorPosition) {
            const dx = cursorPosition.x - body.position.x
            const dy = cursorPosition.y - body.position.y
            const angle = Math.atan2(dy, dx)
            container.rotation = angle
          } else {
            container.rotation = body.angle
          }

          const alpha = debug.value ? 0.5 : 0
          gfxBounds.alpha = alpha

          if (sprite) {
            sprite.visible = body.render.visible
          }
        } else {
          gfxBounds.visible = false
          hasReachedTarget = false
          if (sprite) {
            sprite.visible = false
          }
        }
      },
    }
  },
)
