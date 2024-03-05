import { Entity } from "@dreamlab.gg/core"
import { isNetPlayer } from "@dreamlab.gg/core/entities"
import { game, events as magicEvents } from "@dreamlab.gg/core/labs"
import type { MessageListenerServer } from "@dreamlab.gg/core/network"
import { onlyNetClient, onlyNetServer } from "@dreamlab.gg/core/network"
import InventoryManager, { ProjectileTypes } from "../inventory/inventoryManager.ts"

const delay = async (ms: number | undefined) =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

const SPAWNED_CHANNEL = "@cvz/Projectile/Spawned"
const ATTACK_COOLDOWN = 250
const Y_OFFSET_DEFAULT = 75
const SHOT_DELAY = 100

export class ProjectileSpawner extends Entity {
  private lastSpawnedTime: number | null = null

  public constructor() {
    super()

    const netClient = onlyNetClient(game())
    const netServer = onlyNetServer(game())

    const spawnProjectile = async (
      direction: number,
      animation: string,
      position: [number, number],
      angleOffset: number,
      yOffset = Y_OFFSET_DEFAULT
    ) => {
      const xOffset = direction === 1 ? 165 : -165
      const additionalOffsetY = animation === "shoot" ? -50 : 0

      return game().spawn({
        entity: "@cvz/Projectile",
        args: { width: 50, height: 10, direction },
        transform: {
          position: [position[0] + xOffset, position[1] - yOffset + additionalOffsetY],
          zIndex: 100_000,
          rotation: angleOffset
        },
        tags: ["net/replicated", "net/server-authoritative", "editor/doNotSave"]
      })
    }

    const onHitServer: MessageListenerServer = async ({ peerID }, _, data) => {
      if (!netServer) throw new Error("missing network")
      const player = game()
        .entities.filter(isNetPlayer)
        .find(netplayer => netplayer.connectionId === peerID)
      if (!player) throw new Error("missing netplayer")
      const { direction, animation, position, angle, yOffset } = data as {
        direction: number
        animation: string
        position: [number, number]
        angle: number
        yOffset?: number
      }
      await spawnProjectile(direction, animation, position, angle, yOffset)
    }

    magicEvents("common")?.on("onPlayerAttack", async (player, gear) => {
      if (player.currentAnimation === "bow" || player.currentAnimation === "shoot") {
        if (!gear || Date.now() - (this.lastSpawnedTime || 0) <= ATTACK_COOLDOWN) return
        this.lastSpawnedTime = Date.now()

        const invItem = InventoryManager.getInstance().getInventoryItemFromBaseGear(gear)

        const sendProjectileMessage = (angle: number, yOffset?: number) =>
          void netClient?.sendCustomMessage(SPAWNED_CHANNEL, {
            direction: player.facing === "left" ? -1 : 1,
            animation: player.currentAnimation,
            position: [player.body.position.x, player.body.position.y],
            angle,
            yOffset
          })

        switch (invItem?.projectileType) {
          case ProjectileTypes.SINGLE_SHOT:
          case ProjectileTypes.DOUBLE_SHOT:
          case ProjectileTypes.BURST_SHOT:
            for (
              let idx = 0;
              idx <
              (invItem.projectileType === ProjectileTypes.SINGLE_SHOT
                ? 1
                : invItem.projectileType === ProjectileTypes.DOUBLE_SHOT
                ? 2
                : 3);
              idx++
            ) {
              sendProjectileMessage(0)
              // eslint-disable-next-line no-await-in-loop
              if (idx < 2) await delay(SHOT_DELAY)
            }

            break
          case ProjectileTypes.SCATTER_SHOT:
          case ProjectileTypes.DOUBLE_SCATTER_SHOT: {
            const scatterShots = invItem.projectileType === ProjectileTypes.SCATTER_SHOT ? 1 : 2
            for (let idx = 0; idx < scatterShots; idx++) {
              sendProjectileMessage(0.1, 70)
              sendProjectileMessage(0)
              sendProjectileMessage(-0.1, 80)
              // eslint-disable-next-line no-await-in-loop
              if (idx < 1) await delay(SHOT_DELAY)
            }

            break
          }

          case undefined:
            throw new Error("Not implemented yet: undefined case")
          case ProjectileTypes.NONE:
            break
        }
      }
    })

    netServer?.addCustomMessageListener(SPAWNED_CHANNEL, onHitServer)
  }

  public override teardown(): void {
    // TODO: implement
  }
}
