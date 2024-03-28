import type { Game } from "@dreamlab.gg/core"
import { isNetPlayer } from "@dreamlab.gg/core/entities"
import type { InitServer } from "@dreamlab.gg/core/sdk"
import pThrottle from "npm:p-throttle@6.1.0"
import type { LoadToClientData } from "./network.ts"
import {
  LOAD_CHANNEL,
  SYNC_HIGH_SCORES_CHANNEL,
  SYNC_POINTS_CHANNEL,
  SYNC_UPGRADES_CHANNEL,
  SyncHighScoresToClientData,
  SyncUpgradesToServerSchema,
  SyncPointsToServerSchema
} from "./network.ts"
import { sharedInit } from "./shared.ts"

export const init: InitServer = async game => {
  await sharedInit(game)

  // Track player names and IDs
  const players = new Map<string, [playerId: string, name: string]>()
  //                        ^ connectionId

  game.events.common.addListener("onPlayerJoin", player => {
    players.set(player.connectionId, [player.playerId, player.nickname])

    // We dont refresh scoreboard here yet because the connecting player hasn't loaded
    // We do it in the LOAD_CHANNEL handler below
  })

  game.events.common.addListener("onPlayerLeave", player => {
    players.delete(player.connectionId)

    // Refresh scoreboard if player leaves
    syncHighScores(game, players)
  })

  const network = game.server.network
  if (!network) throw new Error("no server networking")

  network.addCustomMessageListener(LOAD_CHANNEL, async ({ connectionId, playerId }) => {
    const kv = game.server.kv.player(playerId)
    const points = Number.parseInt((await kv.get("points")) ?? "0", 10)
    const upgrades = Number.parseInt((await kv.get("upgrades")) ?? "0", 10)

    const payload: LoadToClientData = { points, upgrades }
    network.sendCustomMessage(connectionId, LOAD_CHANNEL, payload)

    syncHighScores(game, players)
  })

  network.addCustomMessageListener(
    SYNC_POINTS_CHANNEL,
    async ({ connectionId, playerId }, _, payload) => {
      const resp = SyncPointsToServerSchema.safeParse(payload)
      if (!resp.success) return
      const data = resp.data

      const kv = game.server.kv.player(playerId)
      await kv.set("points", data.points.toString())

      throttledSyncHighScores(game, players)
    }
  )

  network.addCustomMessageListener(
    SYNC_UPGRADES_CHANNEL,
    async ({ connectionId, playerId }, _, payload) => {
      const resp = SyncUpgradesToServerSchema.safeParse(payload)
      if (!resp.success) return
      const data = resp.data

      const kv = game.server.kv.player(playerId)
      await kv.set("upgrades", data.upgrades.toString())
    }
  )
}

const syncHighScores = async (
  game: Game<true>,
  players: Map<string, [playerId: string, name: string]>
) => {
  // TODO: Cache this maybe
  const jobs = [...players.entries()].map(async ([connectionId, [playerId, name]]) => {
    const kv = game.server.kv.player(playerId)
    const points = Number.parseInt((await kv.get("points")) ?? "0", 10)

    return { id: playerId, points, name }
  })

  const scores = await Promise.all(jobs)
  scores.sort((a, b) => b.points - a.points)

  const payload: SyncHighScoresToClientData = { scores }
  const network = game.server.network!

  network.broadcastCustomMessage(SYNC_HIGH_SCORES_CHANNEL, payload)
}

const throttledSyncHighScores = pThrottle({ limit: 1, interval: 1000 })(syncHighScores)
