export const handleInventoryDragStart = (slot: number) => {
  console.log(`Started dragging from slot [${slot}]`)
}

export const handleInventoryDragEnd = (slot: number) => {
  console.log(`Ended dragging at slot [${slot}]`)
}
