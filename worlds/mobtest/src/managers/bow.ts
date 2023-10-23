import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'

export const initBow = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  game.events.common.addListener(
    'onPlayerAttack',
    async (player: Player, _item: PlayerInventoryItem) => {
      if (player.currentAnimation !== 'bow') return

      const currentTime = Date.now()

      if (!lastSpawnedTime || currentTime - lastSpawnedTime > 1_000) {
        lastSpawnedTime = currentTime
      } else {
        return
      }

      const xOffset = player.facingDirection === 1 ? 150 : -150
      const yOffset = 75

      await game.spawn({
        entity: '@dreamlab/Projectile',
        args: { width: 50, height: 10, direction: player.facingDirection },
        transform: {
          position: {
            x: player.body.position.x + xOffset,
            y: player.body.position.y - yOffset,
          },
          rotation: 0,
        },
      })
    },
  )
}
