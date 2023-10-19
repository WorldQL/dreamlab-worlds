import type { Game } from '@dreamlab.gg/core'

export const initBow = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  game.events.common.addListener(
    'onPlayerAttack',
    async (body: Matter.Body, animation: string) => {
      if (animation === 'bow') {
        const currentTime = Date.now()

        if (!lastSpawnedTime || currentTime - lastSpawnedTime > 1_000) {
          lastSpawnedTime = currentTime
        } else {
          return
        }

        const direction = body.velocity.x > 0 ? 1 : -1

        await game.spawn({
          entity: '@dreamlab/Projectile',
          args: { radius: 50, direction },
          transform: {
            position: { x: body.position.x, y: body.position.y },
            rotation: 0,
          },
        })
      }
    },
  )
}
