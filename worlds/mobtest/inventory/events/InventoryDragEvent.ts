export const handleInventoryDragStart = (row: number, col: number) => {
  console.log(`Started dragging from slot [${row},${col}]`)
}

export const handleInventoryDragEnd = (row: number, col: number) => {
  console.log(`Ended dragging at slot [${row},${col}]`)
}
