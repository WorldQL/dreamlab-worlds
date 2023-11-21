import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import { isPlayer } from '@dreamlab.gg/core/entities'
import type { Camera, Player } from '@dreamlab.gg/core/entities'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite, SpriteSourceSchema } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import type { Sprite } from 'pixi.js'
import { Container, Graphics } from 'pixi.js'

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1),
  height: z.number().positive().min(1),
  spriteSource: SpriteSourceSchema.optional(),
})

interface Data {
  game: Game<boolean>
  body: Matter.Body
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
  sprite: Sprite | undefined
}

export const createLadder = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(ArgsSchema, ({ tags, transform }, args) => {
  const { position, zIndex } = transform

  const body = Matter.Bodies.rectangle(
    position.x,
    position.y,
    args.width,
    args.height,
    {
      isStatic: true,
    },
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

    rectangleBounds() {
      return { width: args.width, height: args.height }
    },

    isPointInside(position) {
      return Matter.Query.point([body], position).length > 0
    },

    onArgsUpdate(path, _previous, _data, render) {
      if (render && path === 'spriteSource') {
        const { width, height, spriteSource } = args

        render.sprite?.destroy()
        render.sprite = spriteSource
          ? createSprite(spriteSource, {
              width,
              height,
              zIndex: transform.zIndex,
            })
          : undefined

        if (render.sprite) render.stage.addChild(render.sprite)
      }
    },

    onResize({ width, height }) {
      args.width = width
      args.height = height
    },

    init({ game }) {
      game.physics.register(this, body)
      game.events.client?.addListener('onPlayerCollisionStart', pair =>
        onPlayerCollision(pair, 'start'),
      )
      game.events.client?.addListener('onPlayerCollisionEnd', pair =>
        onPlayerCollision(pair, 'end'),
      )

      return { game, body }
    },

    initRenderContext(_, { camera, stage }) {
      const container = new Container()
      container.sortableChildren = true
      container.zIndex = zIndex

      const gfxBounds = new Graphics()
      const sprite = args.spriteSource
        ? createSprite(args.spriteSource, {
            width: args.width,
            height: args.height,
            zIndex,
          })
        : undefined

      if (sprite) {
        container.addChild(sprite)
      } else {
        drawBox(
          gfxBounds,
          { width: args.width, height: args.height },
          { stroke: '#00f' },
        )
        container.addChild(gfxBounds)
      }

      stage.addChild(container)

      return {
        camera,
        stage: container,
        gfx: gfxBounds,
        sprite,
      }
    },

    teardown({ game }) {
      game.physics.unregister(this, body)
      game.events.client?.removeListener('onPlayerCollisionStart', pair =>
        onPlayerCollision(pair, 'start'),
      )
      game.events.client?.removeListener('onPlayerCollisionEnd', pair =>
        onPlayerCollision(pair, 'end'),
      )
    },

    teardownRenderContext({ stage: container }) {
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

    onRenderFrame(_, { game }, { camera, stage: container, gfx: gfxBounds }) {
      const debug = game.debug
      const pos = Vec.add(position, camera.offset)

      container.position = pos
      container.rotation = body.angle

      const alpha = debug.value ? 0.5 : 0
      gfxBounds.alpha = alpha
    },
  }
})
