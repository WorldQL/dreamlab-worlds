import React from 'react'
import type { InventoryData } from './inventoryManager'
import { inventoryStyles as styles } from './inventoryStyle'

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
    margin: '0 3px',
    transition: 'transform 0.3s ease',
  }

  const activeSlotStyle: React.CSSProperties = {
    ...slotStyle,
    boxShadow: '0 0 10px #7f0000',
    transform: 'scale(1.1)',
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
            {item?.baseGear ? (
              <img
                alt={item.baseGear.displayName}
                src={item.baseGear.textureURL}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <div style={{ ...slotStyle }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default InventoryHotbar
