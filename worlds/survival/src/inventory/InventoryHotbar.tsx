import React from 'react'
import type { InventoryData } from './InventoryManager'
import { inventoryStyles as styles } from './InventoryStyle'

interface InventoryHotbarProps {
  readonly inventoryData: InventoryData
  readonly activeSlot: number
}

const InventoryHotbar: React.FC<InventoryHotbarProps> = ({
  inventoryData,
  activeSlot,
}) => {
  const firstRow = inventoryData.slice(0, 9)

  const slotStyle: React.CSSProperties = {
    ...styles.inventorySlot,
    margin: '0 5px',
    transition: 'transform 0.3s ease',
  }

  const activeSlotStyle: React.CSSProperties = {
    ...slotStyle,
    transform: 'scale(1.1)',
    boxShadow: '0 0 10px gold',
    zIndex: 10,
  }

  return (
    <div
      style={{
        ...styles.hotbarSlots,
        position: 'fixed',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {firstRow.map((item, index) => {
        return (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            style={index === activeSlot ? activeSlotStyle : slotStyle}
          >
            {item?.baseItem ? (
              <img
                alt={item.baseItem.displayName}
                src={item.baseItem.textureURL}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div
                style={{ ...slotStyle, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default InventoryHotbar
