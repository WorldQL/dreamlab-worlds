import {
  InventoryDragStartEvent,
  InventoryDragEndEvent,
} from '../events/inventoryDragEvent'

export const handleInventoryDragStart = (event: InventoryDragStartEvent) => {
  console.log(`Started dragging from slot [${event.cursorSlot}]`)
  event.setSourceSlot(event.cursorSlot)
}

export const handleInventoryDragEnd = (event: InventoryDragEndEvent) => {
  console.log(
    `Ended dragging from slot [${event.sourceSlot}] to slot [${event.targetSlot}]`,
  )

  // swap item to new slot
  const newData = [...event.data]
  ;[newData[event.sourceSlot], newData[event.targetSlot]] = [
    newData[event.targetSlot],
    newData[event.sourceSlot],
  ]

  // change item in hand if active slot is changed
  if (event.activeSlot === event.sourceSlot) {
    event.player.inventory.setItemInHand(newData[event.sourceSlot])
  } else if (event.activeSlot === event.targetSlot) {
    event.player.inventory.setItemInHand(newData[event.targetSlot])
  }

  // update inventory data
  event.setData(newData)
}
