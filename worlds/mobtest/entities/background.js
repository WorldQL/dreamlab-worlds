import { createSpawnableEntity } from '@dreamlab.gg/core'
import { createSprite } from '@dreamlab.gg/core/dist/textures'
import { cloneTransform, Vec } from '@dreamlab.gg/core/math'
import { drawBox } from '@dreamlab.gg/core/utils'
import { Container, Graphics } from 'pixi.js'

export const createBackground = createSpawnableEntity(
  (
    { tags, transform, zIndex },
    width,
    height,
    textureURL,
    parallaxX,
    parallaxY,
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
        const sprite =
          typeof textureURL === 'string'
            ? createSprite(textureURL, {
                width: Number(width),
                height: Number(height),
                zIndex,
              })
            : undefined

        if (sprite) {
          container.addChild(sprite)
          console.log('sprite created')
        } else {
          drawBox(
            graphics,
            { width: Number(width), height: Number(height) },
            { stroke: '#00f' },
          )
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
        const debug = game.debug;
        
        const zoomAdjustedParallaxX = Number(parallaxX) * camera.zoomScale;
        const zoomAdjustedParallaxY = Number(parallaxY) * camera.zoomScale;
        
        const parallaxPos = Vec.create(
          position.x + (camera.offset.x * zoomAdjustedParallaxX),
          position.y + (camera.offset.y * zoomAdjustedParallaxY)
        );
    
        container.position = parallaxPos;
        
        if (sprite) {
          sprite.scale.set(1 / camera.zoomScale, 1 / camera.zoomScale);

          sprite.position = parallaxPos;
        }
    
        const alpha = debug.value ? 0.5 : 0;
        graphics.alpha = alpha;
    }
    
      
    }
  },
)
