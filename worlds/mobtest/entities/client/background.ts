import { createSpawnableEntity } from '@dreamlab.gg/core'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/dist/math'
import { drawBox } from '@dreamlab.gg/core/dist/utils'
import { Container, Graphics } from 'pixi.js'

export const createBackground = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width: number,
    height: number,
    textureURL: string,
    parallaxX: number,
    parallaxY: number,
  ) => {
    const { position } = transform

    return {
      get position() {
        return Vec.create(position.x, position.y)
      },

      get tags() {
        return tags
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
        const sprite = createSprite(textureURL, {
          width: width,
          height: height,
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

      onRenderFrame(_, { game }, { camera, container, graphics, sprite }) {
        const debug = game.debug

        const zoomAdjustedParallaxX = parallaxX * camera.zoomScale
        const zoomAdjustedParallaxY = parallaxY * camera.zoomScale

        const parallaxPos = Vec.create(
          position.x + camera.offset.x * zoomAdjustedParallaxX,
          position.y + camera.offset.y * zoomAdjustedParallaxY,
        )

        container.position = parallaxPos

        if (sprite) {
          sprite.scale.set(1 / camera.zoomScale, 1 / camera.zoomScale)

          sprite.position = parallaxPos
        }

        const alpha = debug.value ? 0.5 : 0
        graphics.alpha = alpha
      },
    }
  },
)
