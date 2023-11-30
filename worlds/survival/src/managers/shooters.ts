import type { Game } from '@dreamlab.gg/core'
import { isNetPlayer } from '@dreamlab.gg/core/dist/entities'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'
import type { MessageListenerServer } from '@dreamlab.gg/core/dist/network'
import { onlyNetClient, onlyNetServer } from '@dreamlab.gg/core/dist/network'
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
const SHOOT_CHANNEL = '@dreamlab/Projectile/fired'

export const initProjectileWeapons = (game: Game<false>) => {
  let lastSpawnedTime: number | null = null

  const netClient = onlyNetClient(game)
  const netServer = onlyNetServer(game)

  const spawnProjectile = async (
    direction: number,
    animation: string,
    position: [number, number],
    angleOffset: number,
    yOffset = Y_OFFSET_DEFAULT,
  ) => {
    const xOffsetFactor = 165
    const xOffset = direction === 1 ? xOffsetFactor : -xOffsetFactor

    let additionalOffsetX = 0
    let additionalOffsetY = 0

    if (animation === 'shoot') {
      additionalOffsetX = 0
      additionalOffsetY = -50
    }

    return game.spawn({
      entity: '@dreamlab/Projectile',
      args: { width: 50, height: 10, direction },
      transform: {
        position: {
          x: position[0] + xOffset,
          y: position[1] - yOffset + additionalOffsetY,
        },
        rotation: angleOffset,
      },
      tags: ['net/replicated', 'net/server-authoritative', 'editor/doNotSave'],
    })
  }

  const onHitServer: MessageListenerServer = async ({ peerID }, _, data) => {
    const network = netServer
    if (!network) throw new Error('missing network')

    const player = game.entities
      .filter(isNetPlayer)
      .find(netplayer => netplayer.peerID === peerID)

    if (!player) throw new Error('missing netplayer')

    const direction = data.direction as number
    const animation = data.animation as string
    const position = data.position as [number, number]
    const angle = data.angle as number
    const yOffset = data.yOffset ? (data.yOffset as number) : undefined

    await spawnProjectile(direction, animation, position, angle, yOffset)
  }

  netServer?.addCustomMessageListener(SHOOT_CHANNEL, onHitServer)

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
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })

            break

          case ProjectileTypes.DOUBLE_SHOT:
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            await delay(SHOT_DELAY)
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            break

          case ProjectileTypes.BURST_SHOT:
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            await delay(SHOT_DELAY)
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            await delay(SHOT_DELAY)
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            break

          case ProjectileTypes.SCATTER_SHOT:
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0.1,
              yOffset: 70,
            })
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: -1,
              yOffset: 80,
            })
            break

          case ProjectileTypes.DOUBLE_SCATTER_SHOT:
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0.1,
              yOffset: 70,
            })
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: -0.1,
              yOffset: 80,
            })
            await delay(SHOT_DELAY)

            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0.1,
              yOffset: 70,
            })
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: 0,
            })
            netClient?.sendCustomMessage(SHOOT_CHANNEL, {
              direction: player.facingDirection,
              animation: player.currentAnimation,
              position: [player.body.position.x, player.body.position.y],
              angle: -0.1,
              yOffset: 80,
            })
            break
          case undefined: {
            throw new Error('Not implemented yet: undefined case')
          }

          case ProjectileTypes.EXPLOSIVE_SHOT: {
            throw new Error(
              'Not implemented yet: ProjectileTypes.EXPLOSIVE_SHOT case',
            )
          }
        }
      }
    },
  )
}
