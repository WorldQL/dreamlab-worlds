import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'
import InventoryManager, {
  ProjectileTypes,
} from '../inventory/InventoryManager'

const delay = async (ms: number | undefined) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const Y_OFFSET_DEFAULT = 75
const ATTACK_COOLDOWN = 250
const SHOT_DELAY = 100

export const initProjectileWeapons = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  const spawnProjectile = async (
    player: Player,
    gear: PlayerItem,
    angleOffset: number,
    yOffset = Y_OFFSET_DEFAULT,
  ) => {
    const xOffsetFactor = gear?.texture ? gear.texture.width / 1.5 : 165
    const xOffset =
      player.facingDirection === 1 ? xOffsetFactor : -xOffsetFactor

    console.log(xOffset)

    return game.spawn({
      entity: '@dreamlab/Projectile',
      args: { width: 50, height: 10, direction: player.facingDirection },
      transform: {
        position: {
          x: player.body.position.x + xOffset,
          y: player.body.position.y - yOffset,
        },
        rotation: angleOffset,
      },
      tags: ['net/replicated'],
    })
  }

  game.events.common.addListener(
    'onPlayerAttack',
    async (player: Player, gear: PlayerItem) => {
      if (
        player.currentAnimation === 'bow' ||
        player.currentAnimation === 'shoot'
      ) {
        const currentTime = Date.now()
        if (
          !lastSpawnedTime ||
          currentTime - lastSpawnedTime > ATTACK_COOLDOWN
        ) {
          lastSpawnedTime = currentTime
        } else {
          return
        }

        const invItem = InventoryManager.getInstance().getItemFromItem(gear)

        switch (invItem?.projectileType) {
          case ProjectileTypes.SINGLE_SHOT:
            await spawnProjectile(player, gear, 0)
            break

          case ProjectileTypes.DOUBLE_SHOT:
            await spawnProjectile(player, gear, 0)
            await delay(SHOT_DELAY)
            await spawnProjectile(player, gear, 0)
            break

          case ProjectileTypes.BURST_SHOT:
            await spawnProjectile(player, gear, 0)
            await delay(SHOT_DELAY)
            await spawnProjectile(player, gear, 0)
            await delay(SHOT_DELAY)
            await spawnProjectile(player, gear, 0)
            break

          case ProjectileTypes.SCATTER_SHOT:
            await spawnProjectile(player, gear, 0.1, 70)
            await spawnProjectile(player, gear, 0)
            await spawnProjectile(player, gear, -0.1, 80)
            break

          case ProjectileTypes.DOUBLE_SCATTER_SHOT:
            await spawnProjectile(player, gear, 0.1, 70)
            await spawnProjectile(player, gear, 0)
            await spawnProjectile(player, gear, -0.1, 80)
            await delay(SHOT_DELAY)

            await spawnProjectile(player, gear, 0.1, 70)
            await spawnProjectile(player, gear, 0)
            await spawnProjectile(player, gear, -0.1, 80)
            break

          default:
            await spawnProjectile(player, gear, 0)
        }
      }
    },
  )
}
