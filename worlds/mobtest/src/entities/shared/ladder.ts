import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

export const createLadder = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    spriteSource?: string,
  ) => {
    const { position } = transform

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
      { isStatic: true },
    )

    let isClimbing = false

    const onPlayerCollision = (
      pair: readonly [player: Player, otherBody: Matter.Body],
      eventType: 'end' | 'start',
    ) => {
      const [, bodyCollided] = pair
      if (body && bodyCollided === body) {
        isClimbing = eventType === 'start'
      }
    }

    return {
      get tags() {
        return tags
      },

      get transform() {
        return cloneTransform(transform)
      },

      isInBounds(position) {
        return Matter.Query.point([body], position).length > 0
      },

      init({ game }) {
        game.physics.register(this, body)
        game.events.common.addListener('onPlayerCollisionStart', pair =>
          onPlayerCollision(pair, 'start'),
        )
        game.events.common.addListener('onPlayerCollisionEnd', pair =>
          onPlayerCollision(pair, 'end'),
        )

        return { game, body }
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex

        const gfxBounds = new Graphics()
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
        game.events.common.removeListener('onPlayerCollisionStart', pair =>
          onPlayerCollision(pair, 'start'),
        )
        game.events.common.removeListener('onPlayerCollisionEnd', pair =>
          onPlayerCollision(pair, 'end'),
        )
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_, { game }) {
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)
        if (isClimbing) {
          const player = game.entities.find(isPlayer)
          if (player) {
            Matter.Body.applyForce(player.body, player.position, {
              x: 0,
              y: -0.2,
            })
          }
        }
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
