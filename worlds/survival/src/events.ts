import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import { EventEmitter } from '@dreamlab.gg/core/events'

interface Events {
  onPlayerKill: []
  onPlayerDamage: [number]
  onPlayerHeal: [number]
  onPlayerNearItem: [Player, PlayerInventoryItem | undefined]
}

export const events = new EventEmitter<Events>()
