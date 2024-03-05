import type {
  InventoryDragEndEvent,
  InventoryDragStartEvent
} from "../events/inventoryDragEvent.ts"
import InventoryManager from "../inventoryManager.ts"

export const handleInventoryDragStart = (event: InventoryDragStartEvent) => {
  console.log(`Started dragging from slot [${event.cursorSlot}]`)
  event.setSourceSlot(event.cursorSlot)
}

export const handleInventoryDragEnd = (event: InventoryDragEndEvent) => {
  const invData = InventoryManager.getInstance().getInventoryData()
  console.log(`Ended dragging from slot [${event.sourceSlot}] to slot [${event.targetSlot}]`)

  if (!event.player) return

  if (event.activeSlot === event.sourceSlot) {
    event.player.gear = invData[event.sourceSlot]?.baseGear
  } else if (event.activeSlot === event.targetSlot) {
    event.player.gear = invData[event.targetSlot]?.baseGear
  }
}
