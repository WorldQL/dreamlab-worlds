import React, { useState } from 'https://esm.sh/react@18.2.0'
import type { InventoryItem } from './InventoryManager.js'
import { inventoryStyles as styles } from './InventoryStyle.js'

interface Props {
  slot: InventoryItem
}

const InventorySlot: React.FC<Props> = ({ slot }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const combinedStyles = {
    ...styles.inventorySlot,
    ...(isHovered ? styles.inventorySlotHover : {}),
    border: slot ? '2px solid #9e8a7c' : '2px solid transparent',
  }

  const renderTooltipContent = () => {
    if (!slot?.baseGear) return null

    const { baseGear: baseItem, damage, projectileType } = slot
    const { displayName, speedMultiplier } = baseItem

    return (
      <div>
        <div>{displayName}</div>
        <div>Damage: {damage}</div>
        <div>Attack Speed: {speedMultiplier ?? 1}</div>
        {projectileType && <div>Barrel: {projectileType}</div>}
      </div>
    )
  }

  return (
    <div
      onDragEnd={() => setIsDragging(false)}
      onDragStart={() => setIsDragging(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={combinedStyles}
    >
      {slot?.baseGear?.textureURL && (
        <img
          alt={slot.baseGear?.displayName}
          className='inventorySprite'
          draggable
          height='50'
          src={slot.baseGear?.textureURL}
          width='50'
        />
      )}
      {isHovered && !isDragging && (
        <div style={{ ...styles.itemTooltip, opacity: 1 }}>
          {renderTooltipContent()}
        </div>
      )}
    </div>
  )
}

export default InventorySlot
