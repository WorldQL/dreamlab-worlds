import React from 'https://esm.sh/react@18.2.0'
import InventorySlot from './InventorySlot.js'
import { inventoryStyles as styles } from './InventoryStyle.js'
import { InventoryData } from './inventoryManager.js'
import { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'

interface Props {
  data: InventoryData
  onClick: (slotIndex: number) => void
  onDragStart: (slotIndex: number) => void
  onDragEnd: (slotIndex: number) => void
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
    slot: PlayerInventoryItem,
    slotIndex: number,
    offset: number = 0,
  ) => {
    const index = offset + slotIndex
    return (
      <div
        key={slotIndex}
        style={styles.inventorySlot}
        onClick={() => onClick(index)}
        onDragStart={e => {
          if (!slot) {
            e.preventDefault()
            return
          }
          onDragStart(index)
        }}
        onDrop={() => onDragEnd(index)}
        onDragOver={e => e.preventDefault()}
        draggable={!!slot}
      >
        {slot && <InventorySlot slot={slot} />}
      </div>
    )
  }

  return (
    <div style={styles.inventory}>
      <h2 style={styles.inventoryTitle}>Inventory</h2>
      {chunkedData.slice(1).map((row, rowIndex) => (
        <div key={rowIndex} style={styles.inventoryRow}>
          {row.map((slot, slotIndex) =>
            createSlot(slot, slotIndex, (rowIndex + 1) * numCols),
          )}
        </div>
      ))}
      <div style={styles.hotbarSlots}>
        {chunkedData[0].map((slot, slotIndex) => createSlot(slot, slotIndex))}
      </div>
    </div>
  )
}

const chunkArray = (array: any[], size: number) => {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

export default Inventory
