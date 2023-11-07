import React, { useState } from 'https://esm.sh/react@18.2.0'
import { inventoryStyles as styles } from './InventoryStyle.js'
import type { InventoryItem } from './inventoryManager.js'

interface Props {
  slot: InventoryItem
}

const InventorySlot: React.FC<Props> = ({ slot }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const combinedStyles = {
    ...styles.inventorySlot,
    ...(isHovered ? styles.inventorySlotHover : {}),
    border: slot ? '2px solid #8c7ae6' : '2px solid transparent',
  }

  return (
    <div
      onDragEnd={() => setIsDragging(false)}
      onDragStart={() => setIsDragging(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={combinedStyles}
    >
      {slot?.baseItem?.textureURL && (
        <img
          alt={slot.baseItem?.displayName}
          className='inventorySprite'
          draggable
          height='50'
          src={slot.baseItem?.textureURL}
          width='50'
        />
      )}

      {isHovered && !isDragging && slot?.baseItem?.displayName && (
        <div style={styles.itemTooltip}>{slot.baseItem?.displayName}</div>
      )}
    </div>
  )
}

export default InventorySlot
