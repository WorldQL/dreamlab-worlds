import type { Player } from '@dreamlab.gg/core/dist/entities'
import type { InventoryEvent } from './inventoryEvent'

export interface InventoryDragStartEvent extends InventoryEvent {
  setSourceSlot: (cursorSlot: number | null) => void
}

export interface InventoryDragEndEvent extends InventoryEvent {
  player: Player
  sourceSlot: number
  targetSlot: number
}
