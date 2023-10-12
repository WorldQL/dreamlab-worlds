import { createSpawnableEntity } from '@dreamlab.gg/core'
import { createSprite } from '@dreamlab.gg/core/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import { Container, Graphics } from 'pixi.js'

export const createFreeform = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    spriteSource: string,
  ) => {
    const { position, rotation } = transform

    return {
      get position() {
        return Vec.create(position.x, position.y)
      },

      get tags() {
        return tags
      },

      get body() {
        return undefined
      },

      get transform() {
        return cloneTransform(transform)
      },

      isInBounds() {
        return false
      },

      init({ game }) {
        return { game }
      },

      initRenderContext(_, { camera, stage }) {
        const container = new Container()
        container.sortableChildren = true
        container.zIndex = zIndex
        const graphics = new Graphics()
        graphics.zIndex = zIndex
        const sprite = createSprite(spriteSource, {
          width,
          height,
          zIndex,
        })

        if (sprite) {
          container.addChild(sprite)
        } else {
          drawBox(graphics, { width, height }, { stroke: '#00f' })
          container.addChild(graphics)
        }

        stage.addChild(container)
        return {
          camera,
          container,
          graphics,
          sprite,
        }
      },

      teardown() {},

      teardownRenderContext({ container }) {
        container.destroy({ children: true })
      },

      onPhysicsStep() {},

      onRenderFrame(_, { game }, { camera, container }) {
        const debug = game.debug
        const pos = Vec.add(position, camera.offset)

        container.position = pos
        container.angle = rotation
        container.alpha = debug.value ? 0.5 : 0
      },
    }
  },
)
