import type { Game } from '@dreamlab.gg/core'

export const initBow = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  game.events.common.addListener(
    'onPlayerAttack',
    async (body: Matter.Body, animation: string, direction: number) => {
      if (animation !== 'bow') return

      const currentTime = Date.now()

      if (!lastSpawnedTime || currentTime - lastSpawnedTime > 1_000) {
        lastSpawnedTime = currentTime
      } else {
        return
      }

      const xOffset = direction === 1 ? 150 : -150
      const yOffset = 75

      await game.spawn({
        entity: '@dreamlab/Projectile',
        args: { width: 50, height: 10, direction },
        transform: {
          position: {
            x: body.position.x + xOffset,
            y: body.position.y - yOffset,
          },
          rotation: 0,
        },
      })
    },
  )
}
