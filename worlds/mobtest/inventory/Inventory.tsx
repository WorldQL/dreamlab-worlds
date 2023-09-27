import React from 'https://esm.sh/react@18.2.0'
import { InventoryData } from './types'
import InventorySlot from './InventorySlot.js'
import { inventoryStyles as styles } from './InventoryStyle.js'

interface Props {
  data: InventoryData
  onClick: (row: number, col: number) => void
  onDragStart: (row: number, col: number) => void
  onDragEnd: (row: number, col: number) => void
}

const Inventory: React.FC<Props> = ({
  data,
  onClick,
  onDragStart,
  onDragEnd,
}) => {
  const handleSlotClick = (row: number, col: number) => () => {
    onClick(row, col)
  }

  const handleSlotDragStart =
    (row: number, col: number) => (e: React.DragEvent) => {
      if (!data[row][col]) {
        e.preventDefault()
        return
      }
      onDragStart(row, col)
    }

  const handleSlotDragEnd = (row: number, col: number) => () => {
    onDragEnd(row, col)
  }

  return (
    <div style={styles.inventory}>
      {data.map((row, rowIndex) => (
        <div key={rowIndex} style={styles.inventoryRow}>
          {row.map((slot, colIndex) => (
            <div
              key={colIndex}
              style={styles.inventorySlot}
              onClick={handleSlotClick(rowIndex, colIndex)}
              onDragStart={handleSlotDragStart(rowIndex, colIndex)}
              onDrop={handleSlotDragEnd(rowIndex, colIndex)}
              onDragOver={e => e.preventDefault()}
              draggable={!!slot}
            >
              {slot && <InventorySlot slot={slot} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Inventory
