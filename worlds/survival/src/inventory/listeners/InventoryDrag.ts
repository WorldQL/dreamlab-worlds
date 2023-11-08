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
  const invData = InventoryManager.getInstance().getInventoryData()
  console.log(
    `Ended dragging from slot [${event.sourceSlot}] to slot [${event.targetSlot}]`,
  )

  if (event.activeSlot === event.sourceSlot) {
    event.player.setItemInHand(invData[event.sourceSlot]?.baseItem)
  } else if (event.activeSlot === event.targetSlot) {
    event.player.setItemInHand(invData[event.targetSlot]?.baseItem)
  }
}
