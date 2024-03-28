import { z } from "@dreamlab.gg/core/sdk"

// #region Load
export const LOAD_CHANNEL = "@clicker/load"

export type LoadToClientData = z.infer<typeof LoadToClientSchema>
export const LoadToClientSchema = z.object({
  points: z.number().min(0),
  upgrades: z.number().min(0)
})
// #endregion

// #region Sync State
export const SYNC_POINTS_CHANNEL = "@clicker/sync-points"
export const SYNC_UPGRADES_CHANNEL = "@clicker/sync-upgrades"

export type SyncPointsToServerData = z.infer<typeof SyncPointsToServerSchema>
export const SyncPointsToServerSchema = z.object({
  points: z.number().min(0)
})

export type SyncUpgradesToServerData = z.infer<typeof SyncUpgradesToServerSchema>
export const SyncUpgradesToServerSchema = z.object({
  upgrades: z.number().min(0)
})
// #endregion

// #region High Scores
export const SYNC_HIGH_SCORES_CHANNEL = "@clicker/sync-high-scores"

export type SyncHighScoresToClientData = z.infer<typeof SyncHighScoresToClientSchema>
export const SyncHighScoresToClientSchema = z.object({
  scores: z.object({ id: z.string(), name: z.string(), points: z.number().min(0) }).array()
})
// #endregion
