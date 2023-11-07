import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { PlayerItem } from '@dreamlab.gg/core/dist/managers'
import { EventEmitter } from '@dreamlab.gg/core/events'

interface Events {
  onPlayerScore: [number]
  onPlayerDamage: [number]
  onPlayerHeal: [number]
  onPlayerNearItem: [Player, PlayerItem | undefined]
  onInventoryAdd: [PlayerItem]
}

export const events = new EventEmitter<Events>()
