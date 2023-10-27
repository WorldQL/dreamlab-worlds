import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { EventEmitter } from '@dreamlab.gg/core/events'

interface Events {
  onPlayerKill: []
  onPlayerDamage: []
  onPlayerNearItem: [Player, PlayerInventoryItem | undefined]
  onPlayerAttemptPickup: [Player, PlayerInventoryItem]
}

export const events = new EventEmitter<Events>()
