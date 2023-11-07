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

  const renderTooltipContent = () => {
    if (!slot?.baseItem) return null

    const { baseItem, damage, projectileOptions } = slot
    const { displayName, itemOptions } = baseItem

    return (
      <div>
        <div>{displayName}</div>
        <div>Damage: {damage}</div>
        <div>Attack Speed: {itemOptions?.speedMultiplier ?? 1}</div>
        {projectileOptions && (
          <>
            <div>Projectiles: {projectileOptions.projectiles}</div>
            <div>Explosive: {projectileOptions.explosive ? 'Yes' : 'No'}</div>
          </>
        )}
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
      {isHovered && !isDragging && (
        <div style={{ ...styles.itemTooltip, opacity: 1 }}>
          {renderTooltipContent()}
        </div>
      )}
    </div>
  )
}

export default InventorySlot
