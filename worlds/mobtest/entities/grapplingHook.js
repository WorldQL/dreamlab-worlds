/*

W I P

*/

import { createSpawnableEntity } from '@dreamlab.gg/core'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

/**
 * Subtract two vectors.
 *
 * @typedef {object} Vector
 * @property {number} x - The X component of the vector.
 * @property {number} y - The Y component of the vector.
 * @param {Vector} v1 - First vector.
 * @param {Vector} v2 - Second vector.
 * @returns {Vector} - Resulting vector after subtraction.
 */

function subtract(v1, v2) {
  return { x: v1.x - v2.x, y: v1.y - v2.y }
}

/**
 * Calculate distance between two vectors.
 *
 * @param {Vector} v1 - First vector.
 * @param {Vector} v2 - Second vector.
 * @returns {number} - Distance between two vectors.
 */
function distance(v1, v2) {
  return Math.sqrt((v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2)
}

/**
 * @type {Vector | undefined}
 */
let cursorPosition

const onPointerOut = () => {
  cursorPosition = undefined
}

/**
 * Update cursorPosition when pointer moves.
 *
 * @param {PointerEvent} ev
 */
const onPointerMove = (
  ev,
  /** @type {import("@dreamlab.gg/core/dist/network-faff88d5").C} */ camera,
) => {
  const screenPosition = Vec.create(ev.offsetX, ev.offsetY)
  cursorPosition = camera.localToWorld(screenPosition)
}

export const createGrapplingHook = createSpawnableEntity(
  ({ tags, transform, zIndex }, spriteSource) => {
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
        const sprite =
          typeof spriteSource === 'string'
            ? createSprite(spriteSource)
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
            Matter.Body.setPosition(body, playerBody.position);
            body.render.visible = true;
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
            body.render.visible = false;
          }
      },

      onRenderFrame(
        { smooth },
        { game },
        { camera, container, gfxBounds, sprite },
      ) {
        const debug = game.debug
        const smoothed = Vec.add(body.position, Vec.mult(body.velocity, smooth))
        const pos = Vec.add(smoothed, camera.offset)

        if (body.render.visible) {
            gfxBounds.visible = true
            container.position = pos
            container.rotation = body.angle
    
            const alpha = debug.value ? 0.5 : 0
            gfxBounds.alpha = alpha
    
            if (sprite) {
              sprite.position = pos
            }
        } else {
            gfxBounds.visible = false
        }
      },
    }
  },
)
