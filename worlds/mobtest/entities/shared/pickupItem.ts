import { createSpawnableEntity } from '@dreamlab.gg/core'
import { Player } from '@dreamlab.gg/core/dist/entities'
import { ItemOptions } from '@dreamlab.gg/core/dist/managers'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import Matter from 'matter-js'
import { Container, Graphics } from 'pixi.js'

export const createPickupItem = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    spriteSource: string,
    itemDisplayName: string,
    animationName: string,
  ) => {
    const { position } = transform

    const body = Matter.Bodies.rectangle(
      position.x,
      position.y,
      width,
      height,
      { isStatic: true, render: { visible: false }, isSensor: true },
    )

    let pickedUp = false
    let time = 0
    const floatHeight = 5
    const rotationSpeed = 0.01

    const onPlayerCollision = (
      pair: readonly [player: Player, otherBody: Matter.Body],
    ) => {
      const [player, bodyCollided] = pair
      if (body && bodyCollided === body) {
        const inventory = player.inventory

        // Create a new item with the following structure:
        // - displayName: string
        // - textureURL: string
        // - animationName: string (See KnownAnimation from '@dreamlab.gg/core/dist/entities')
        // - itemOptions?: ItemOptions
        const itemOptions: ItemOptions = {
          anchorX: 0.5,
          anchorY: 0.5,
          hand: 'right',
        }

        const newItem = inventory.createNewItem(
          itemDisplayName,
          spriteSource,
          animationName,
          itemOptions,
        )

        inventory.addItem(newItem)
        pickedUp = true
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
        game.events.common.addListener(
          'onPlayerCollisionStart',
          onPlayerCollision,
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
        game.events.common.removeListener(
          'onPlayerCollisionStart',
          onPlayerCollision,
        )
      },

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep(_, { game }) {
        if (pickedUp) {
          Matter.World.remove(game.physics.engine.world, body)
          return
        }
        Matter.Body.setAngle(body, 0)
        Matter.Body.setAngularVelocity(body, 0)
      },

      onRenderFrame(_, { game }, { camera, container, gfxBounds, sprite }) {
        if (pickedUp) {
          if (gfxBounds.visible) gfxBounds.visible = false
          if (sprite) sprite.visible = false
          return
        }

        time += 0.05

        const yOffset = Math.sin(time) * floatHeight
        const pos = Vec.add(position, camera.offset)
        pos.y += yOffset

        container.rotation += rotationSpeed

        container.position = pos

        const debug = game.debug
        const alpha = debug.value ? 0.5 : 0
        gfxBounds.alpha = alpha
      },
    }
  },
)
