import React, { useState } from 'https://esm.sh/react@18.2.0'
import { inventoryStyles as styles } from './InventoryStyle.js'
import { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'

interface Props {
  data: PlayerInventoryItem[][]
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

      const dragImage = e.currentTarget.querySelector('.inventorySprite')
      if (dragImage) {
        e.dataTransfer.setDragImage(
          dragImage,
          dragImage.clientWidth / 2,
          dragImage.clientHeight / 2,
        )
      }
    }

  const handleSlotDragEnd = (row: number, col: number) => () => {
    onDragEnd(row, col)
  }

  const renderSlotContent = (slot: PlayerInventoryItem) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    return (
      <div
        style={{
          ...styles.inventorySlot,
          ...(isHovered ? styles.inventorySlotHover : {}),
          border: slot ? '2px solid #8c7ae6' : '2px solid transparent',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        {slot && slot.textureURL && (
          <img
            src={slot.textureURL}
            width='50'
            height='50'
            className='inventorySprite'
            draggable
            alt={slot.displayName}
          />
        )}
        {isHovered && !isDragging && slot?.displayName && (
          <div style={styles.itemTooltip}>{slot.displayName}</div>
        )}
      </div>
    )
  }

  return (
    <div style={styles.inventory}>
      <h2 style={styles.inventoryTitle}>Inventory</h2>

      {data.slice(0, -1).map((row, rowIndex) => (
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
              {slot && renderSlotContent(slot)}
            </div>
          ))}
        </div>
      ))}

      <div style={styles.weaponSlots}>
        <h2 style={styles.inventoryTitle}>Weapons</h2>
        {data[data.length - 1].slice(0, 4).map((slot, colIndex) => (
          <div
            key={colIndex}
            style={styles.inventorySlot}
            onClick={handleSlotClick(data.length - 1, colIndex)}
            onDragStart={handleSlotDragStart(data.length - 1, colIndex)}
            onDrop={handleSlotDragEnd(data.length - 1, colIndex)}
            onDragOver={e => e.preventDefault()}
            draggable={!!slot}
          >
            <div style={styles.weaponSlotNumber}>{colIndex + 1}</div>
            {slot && renderSlotContent(slot)}
          </div>
        ))}
      </div>
    </div>
  )
}
export default Inventory
