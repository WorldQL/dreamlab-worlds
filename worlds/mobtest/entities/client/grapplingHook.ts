// wip
// - sprites are in wrong position, show be same position as the graphic
import { createSpawnableEntity } from '@dreamlab.gg/core'
import { Camera } from '@dreamlab.gg/core/entities'
import { createSprite } from '@dreamlab.gg/core/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

interface Vector {
  x: number
  y: number
}

const subtract = (v1: Vector, v2: Vector): Vector => {
  return { x: v1.x - v2.x, y: v1.y - v2.y }
}

const distance = (v1: Vector, v2: Vector): number => {
  return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}

let cursorPosition: Vector | undefined

const onPointerOut = (): void => {
  cursorPosition = undefined
}

const onPointerMove = (ev: PointerEvent, camera: Camera): void => {
  const screenPosition = Vec.create(ev.offsetX, ev.offsetY)
  cursorPosition = camera.localToWorld(screenPosition)
}

export const createGrapplingHook = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    spriteSource?: string,
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
        game.client?.inputs.registerInput('@dreamlab/hook', 'ShiftLeft')

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
          gfxBounds.beginFill(0xffffff)
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
          if (body.render.visible === false) {
            Matter.Body.setPosition(body, playerBody.position)
            body.render.visible = true
          }

          const reachedTarget = distance(body.position, cursorPosition) <= 1

          if (!reachedTarget) {
            const dir = Vec.normalise(subtract(cursorPosition, body.position))
            const forceMagnitude = 0.005
            const force = Vec.mult(dir, forceMagnitude)
            Matter.Body.applyForce(body, body.position, force)
          } else {
            Matter.Body.setVelocity(body, { x: 0, y: 0 })
            const playerToHookDirection = Vec.normalise(
              subtract(body.position, playerBody.position),
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
          container.rotation = body.angle

          const alpha = debug.value ? 0.5 : 0
          gfxBounds.alpha = alpha

          if (sprite) {
            gfxBounds.visible = false

            sprite.visible = true
            sprite.position = pos
            sprite.rotation = body.angle
          }
        } else {
          gfxBounds.visible = false
          if (sprite) {
            sprite.visible = false
          }
        }
      },
    }
  },
)
