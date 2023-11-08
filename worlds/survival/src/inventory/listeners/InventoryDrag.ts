import InventoryManager from '../InventoryManager'
import type {
  InventoryDragEndEvent,
  InventoryDragStartEvent,
} from '../events/InventoryDragEvent'

export const handleInventoryDragStart = (event: InventoryDragStartEvent) => {
  console.log(`Started dragging from slot [${event.cursorSlot}]`)
  event.setSourceSlot(event.cursorSlot)
}

export const handleInventoryDragEnd = (event: InventoryDragEndEvent) => {
  const inventoryManager = InventoryManager.getInstance()
  console.log(
    `Ended dragging from slot [${event.sourceSlot}] to slot [${event.targetSlot}]`,
  )

  inventoryManager.swapItems(event.sourceSlot, event.targetSlot)
  const newData = inventoryManager.getInventoryData()

  if (event.activeSlot === event.sourceSlot) {
    event.player.setItemInHand(newData[event.sourceSlot]?.baseItem)
  } else if (event.activeSlot === event.targetSlot) {
    event.player.setItemInHand(newData[event.targetSlot]?.baseItem)
  }
}
