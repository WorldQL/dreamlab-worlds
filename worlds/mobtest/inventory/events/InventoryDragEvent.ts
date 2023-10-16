import type { InventoryEvent } from './InventoryEvent'

export interface InventoryDragStartEvent extends InventoryEvent {
  setSourceSlot(cursorSlot: number | null): void
  setData(data: any[]): void
}

export interface InventoryDragEndEvent extends InventoryEvent {
  sourceSlot: number
  targetSlot: number
  setData(data: any[]): void
}
