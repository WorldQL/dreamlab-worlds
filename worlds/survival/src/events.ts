import type { Player } from '@dreamlab.gg/core/dist/entities'
import { EventEmitter } from '@dreamlab.gg/core/events'
import type { InventoryItem } from './inventory/InventoryManager'

interface Events {
  onPlayerScore: [number]
  onPlayerDamage: [number]
  onPlayerHeal: [number]
  onPlayerNearItem: [Player, InventoryItem | undefined]
  onInventoryUpdate: []
  onGoldUpdate: []
}

export const events = new EventEmitter<Events>()
