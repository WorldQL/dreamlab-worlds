import type { InventoryEvent } from './inventoryEvent'

export interface InventoryDragStartEvent extends InventoryEvent {
  setSourceSlot(cursorSlot: number | null): void
}

export interface InventoryDragEndEvent extends InventoryEvent {
  sourceSlot: number
  targetSlot: number
}
