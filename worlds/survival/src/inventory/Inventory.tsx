import React from 'https://esm.sh/react@18.2.0'
import InventorySlot from './InventorySlot.js'
import { inventoryStyles as styles } from './InventoryStyle.js'
import type { InventoryData, InventoryItem } from './inventoryManager.js'

interface Props {
  data: InventoryData
  onClick(slotIndex: number): void
  onDragStart(slotIndex: number): void
  onDragEnd(slotIndex: number): void
}

const chunkArray = (array: InventoryData, size: number) => {
  const result = []
  for (let index = 0; index < array.length; index += size) {
    result.push(array.slice(index, index + size))
  }

  return result
}

const Inventory: React.FC<Props> = ({
  data,
  onClick,
  onDragStart,
  onDragEnd,
}) => {
  const numCols = 9
  const chunkedData = chunkArray(data, numCols)

  const createSlot = (
    slot: InventoryItem | undefined,
    slotIndex: number,
    offset = 0,
  ) => {
    const index = offset + slotIndex
    return (
      <div
        draggable={Boolean(slot)}
        key={slotIndex}
        onClick={() => onClick(index)}
        onDragOver={ev => ev.preventDefault()}
        onDragStart={ev => {
          if (!slot) {
            ev.preventDefault()
            return
          }

          onDragStart(index)
        }}
        onDrop={() => onDragEnd(index)}
        style={styles.inventorySlot}
      >
        {slot && <InventorySlot slot={slot} />}
      </div>
    )
  }

  return (
    <div style={styles.inventory}>
      <h2 style={styles.inventoryTitle}>Inventory</h2>
      {chunkedData.slice(1).map((row, rowIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={rowIndex} style={styles.inventoryRow}>
          {row.map((slot, slotIndex) =>
            createSlot(slot, slotIndex, (rowIndex + 1) * numCols),
          )}
        </div>
      ))}
      <div style={styles.hotbarSlots}>
        {chunkedData[0]?.map((slot, slotIndex) => createSlot(slot, slotIndex))}
      </div>
    </div>
  )
}

export default Inventory
