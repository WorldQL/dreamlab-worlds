import React from 'https://esm.sh/react@18.2.0'
import InventorySlot from './InventorySlot.js'
import { inventoryStyles as styles } from './InventoryStyle.js'
import { InventoryData } from './inventoryManager.js'

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

  return (
    <div style={styles.inventory}>
      <h2 style={styles.inventoryTitle}>Inventory</h2>

      {chunkedData.slice(1).map((row, rowIndex) => (
        <div key={rowIndex} style={styles.inventoryRow}>
          {row.map((slot, slotIndex) => (
            <div
              key={slotIndex}
              style={styles.inventorySlot}
              onClick={() => onClick((rowIndex + 1) * numCols + slotIndex)}
              onDragStart={e => {
                if (!slot) {
                  e.preventDefault()
                  return
                }
                onDragStart((rowIndex + 1) * numCols + slotIndex)
              }}
              onDrop={() => onDragEnd((rowIndex + 1) * numCols + slotIndex)}
              onDragOver={e => e.preventDefault()}
              draggable={!!slot}
            >
              {slot && <InventorySlot slot={slot} />}
            </div>
          ))}
        </div>
      ))}

      <div style={styles.hotbarSlots}>
        {chunkedData[0].map((slot, slotIndex) => (
          <div
            key={slotIndex}
            style={styles.inventorySlot}
            onClick={() => onClick(slotIndex)}
            onDragStart={e => {
              if (!slot) {
                e.preventDefault()
                return
              }
              onDragStart(slotIndex)
            }}
            onDrop={() => onDragEnd(slotIndex)}
            onDragOver={e => e.preventDefault()}
            draggable={!!slot}
          >
            {slot && <InventorySlot slot={slot} />}
          </div>
        ))}
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
