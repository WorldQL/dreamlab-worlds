import { createSpawnableEntity } from '@dreamlab.gg/core'
import type { Game, SpawnableEntity } from '@dreamlab.gg/core'
import type { EventHandler } from '@dreamlab.gg/core/dist/events'
import type { Camera } from '@dreamlab.gg/core/entities'
import { createGear } from '@dreamlab.gg/core/managers'
import { Vec } from '@dreamlab.gg/core/math'
import { z } from '@dreamlab.gg/core/sdk'
import { createSprite } from '@dreamlab.gg/core/textures'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'
import type { Sprite } from 'pixi.js'
import { events } from '../events'
import { ProjectileTypes } from '../inventory/inventoryManager'
import type { InventoryItem } from '../inventory/inventoryManager'

const projectileTypeValues = Object.values(ProjectileTypes).filter(
  value => typeof value === 'string',
) as [string, ...string[]]

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  width: z.number().positive().min(1).default(200),
  height: z.number().positive().min(1).default(200),
  displayName: z.string().default('Default Item'),
  animationName: z
    .enum(['bow', 'shoot', 'greatsword', 'idle', 'jump', 'jog', 'walk'])
    .default('shoot'),
  spriteSource: z.string().default(''),
  damage: z.number().default(1),
  lore: z.string().default('Default Item Lore'),
  bone: z.enum(['handLeft', 'handRight']).default('handRight'),
  anchorX: z.number().default(0.5),
  anchorY: z.number().default(0.5),
  rotation: z.number().default(0),
  speedMultiplier: z.number().optional().default(1),
  projectileType: z.enum(projectileTypeValues).optional(),
})

type OnPlayerCollisionStart = EventHandler<'onPlayerCollisionStart'>
type OnPlayerCollisionEnd = EventHandler<'onPlayerCollisionEnd'>

interface Data {
  game: Game<boolean>
  body: Matter.Body
  onPlayerCollisionStart: OnPlayerCollisionStart
  onPlayerCollisionEnd: OnPlayerCollisionEnd
}

interface Render {
  camera: Camera
  stage: Container
  gfx: Graphics
  sprite: Sprite | undefined
}

export const createInventoryItem = createSpawnableEntity<
  Args,
  SpawnableEntity<Data, Render, Args>,
  Data,
  Render
>(ArgsSchema, ({ tags, transform }, args) => {
  const body = Matter.Bodies.rectangle(
    transform.position.x,
    transform.position.y,
    args.width,
    args.height,
    {
      label: 'inventoryItem',
      isStatic: true,
      render: { visible: false },
      isSensor: true,
    },
  )

  let time = 0
  const floatHeight = 5
  const rotationSpeed = 0.01

  return {
    get tags() {
      return tags
    },

    rectangleBounds() {
      return { width: args.width, height: args.height }
    },

    isPointInside(position) {
      return Matter.Query.point([body], position).length > 0
    },

    init({ game }) {
      game.physics.register(this, body)
      game.physics.linkTransform(body, transform)

      const onPlayerCollisionStart: OnPlayerCollisionStart = (
        [player, bodyCollided],
        _raw,
      ) => {
        if (body && bodyCollided === body && game.client) {
          const baseGear = {
            displayName: args.displayName,
            textureURL: args.spriteSource,
            animationName: args.animationName,
            anchor: { x: args.anchorX, y: args.anchorY },
            rotation: args.rotation,
            bone: args.bone,
            speedMultiplier: args.speedMultiplier,
          }

          const newItem = createGear(baseGear)

          const inventoryItem: InventoryItem = {
            baseGear: newItem,
            lore: args.lore,
            damage: args.damage,
            value: 100,
            projectileType:
              ProjectileTypes[
                args.projectileType as keyof typeof ProjectileTypes
              ],
          }

          events.emit('onPlayerNearItem', player, inventoryItem)
        }
      }

      const onPlayerCollisionEnd: OnPlayerCollisionEnd = (
        [player, bodyCollided],
        _raw,
      ) => {
        if (body && bodyCollided === body) {
          events.emit('onPlayerNearItem', player, undefined)
        }
      }

      game.events.client?.addListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )
      game.events.client?.addListener(
        'onPlayerCollisionEnd',
        onPlayerCollisionEnd,
      )

      return { game, body, onPlayerCollisionStart, onPlayerCollisionEnd }
    },

    initRenderContext(_, { camera, stage }) {
      const container = new Container()
      container.sortableChildren = true
      container.zIndex = transform.zIndex

      const gfxBounds = new Graphics()
      const sprite = args.spriteSource
        ? createSprite(
            { url: args.spriteSource },
            {
              width: args.width,
              height: args.height,
              zIndex: transform.zIndex,
            },
          )
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

    onArgsUpdate(path, _previous, _data, render) {
      if (render && path === 'spriteSource') {
        const { width, height, spriteSource } = args

        render.sprite?.destroy()
        render.sprite = spriteSource
          ? createSprite(
              { url: spriteSource },
              {
                width,
                height,
                zIndex: transform.zIndex,
              },
            )
          : undefined

        if (render.sprite) render.stage.addChild(render.sprite)
      }
    },

    onResize({ width, height }) {
      args.width = width
      args.height = height
    },

    teardown({ game, onPlayerCollisionStart, onPlayerCollisionEnd }) {
      game.physics.unregister(this, body)
      game.events.client?.removeListener(
        'onPlayerCollisionStart',
        onPlayerCollisionStart,
      )
      game.events.client?.removeListener(
        'onPlayerCollisionEnd',
        onPlayerCollisionEnd,
      )
    },

    teardownRenderContext({ stage }) {
      stage.destroy({ children: true })
    },

    onPhysicsStep() {
      Matter.Body.setAngle(body, 0)
      Matter.Body.setAngularVelocity(body, 0)
    },

    onRenderFrame(_, { game }, { camera, stage, gfx: gfxBounds }) {
      time += 0.05

      const yOffset = Math.sin(time) * floatHeight
      const pos = Vec.add(transform.position, camera.offset)
      pos.y += yOffset

      stage.rotation += rotationSpeed

      stage.position = pos

      const debug = game.debug
      const alpha = debug.value ? 0.5 : 0
      gfxBounds.alpha = alpha
    },
  }
})
