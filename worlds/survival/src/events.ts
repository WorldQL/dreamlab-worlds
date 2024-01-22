import type { Player } from '@dreamlab.gg/core/dist/entities'
import { EventEmitter } from '@dreamlab.gg/core/events'
import type { InventoryItem } from './inventory/inventoryManager'

interface Events {
  onPlayerScore: [number]
  onPlayerDamage: [number]
  onPlayerHeal: [number]
  onPlayerNearItem: [Player, InventoryItem | undefined]
  onInventoryUpdate: []
  onGoldUpdate: []

  onRegionStart: string
  onRegionEnd: string
}

export const events = new EventEmitter<Events>()
