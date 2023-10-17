import type { PlayerInventoryItem } from '@dreamlab.gg/core/dist/managers'
import React, { useState } from 'https://esm.sh/react@18.2.0'
import { inventoryStyles as styles } from './InventoryStyle.js'

interface Props {
  slot: PlayerInventoryItem
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
      style={combinedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {slot?.textureURL && (
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

export default InventorySlot
