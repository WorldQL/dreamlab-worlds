import { createSpawnableEntity } from '@dreamlab.gg/core'
import { cloneTransform } from '@dreamlab.gg/core/math'
import { syncedValue } from '@dreamlab.gg/core/network'
import { z } from '@dreamlab.gg/core/sdk'
import { createDebugText } from '@dreamlab.gg/core/utils'

/** @type {import('@dreamlab.gg/core').LooseSpawnableDefinition[]} */
export const level = [
  {
    entity: '@dreamlab/Solid',
    args: { width: 5000, height: 50 },
    transform: {
      position: { x: 0, y: 295 },
      rotation: 0,
    },
  },
]

const createServerTime = createSpawnableEntity(
  z.object({}),
  ({ uid, transform, tags }) => {
    return {
      get transform() {
        return cloneTransform(transform)
      },

      get tags() {
        return tags
      },

      isPointInside() {
        return false;
      },

      isInBounds() {
        return false
      },

      init({ game }) {
        return {
          game,
          serverTime: syncedValue(game, uid, 'serverTime', '0'),
        }
      },

      initRenderContext(_, { stage, camera }) {
        const text = createDebugText(4)
        stage.addChild(text.gfx)

        return { camera, text }
      },

      teardown() {
        // No-op
      },

      teardownRenderContext({ text }) {
        text.gfx.destroy()
      },

      onPhysicsStep({ time }, { game, serverTime }) {
        if (game.server) serverTime.value = time.toFixed(0)
      },

      onRenderFrame(_, { serverTime }, { camera, text }) {
        text.update(`server time: ${serverTime.value}`)
        text.render(camera.scale, true)
      },
    }
  },
)

/** @type {import('@dreamlab.gg/core/sdk').InitShared} */
export const sharedInit = async game => {
  game.register('@dreamlab/ServerTime', createServerTime)

  await game.spawnMany(...level)
}
