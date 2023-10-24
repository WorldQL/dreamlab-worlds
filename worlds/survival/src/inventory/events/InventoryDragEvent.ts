import type { InventoryData } from '../inventoryManager'
import type { InventoryEvent } from './inventoryEvent'

export interface InventoryDragStartEvent extends InventoryEvent {
  setSourceSlot(cursorSlot: number | null): void
  setData(data: InventoryData): void
}

export interface InventoryDragEndEvent extends InventoryEvent {
  sourceSlot: number
  targetSlot: number
  setData(data: InventoryData): void
}
