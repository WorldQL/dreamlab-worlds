import React from "react"
import type { InventoryData } from "./inventoryManager.ts"
import { inventoryStyles as styles } from "./inventoryStyle.ts"

interface InventoryHotbarProps {
  readonly inventoryData: InventoryData
  readonly activeSlot: number
}

const InventoryHotbar: React.FC<InventoryHotbarProps> = ({ inventoryData, activeSlot }) => {
  const firstRow = inventoryData.slice(0, 9)

  const hotbarStyle: React.CSSProperties = {
    ...styles.hotbarSlots,
    position: "fixed",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#8B4513", // Saddle Brown color
    border: "2px solid #D2691E", // Chocolate color
    borderRadius: "10px",
    padding: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
  }

  const slotStyle: React.CSSProperties = {
    ...styles.inventorySlot,
    margin: "0 5px",
    transition: "transform 0.3s ease",
    backgroundColor: "#DEB887", // Burlywood color
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

  const activeSlotStyle: React.CSSProperties = {
    ...slotStyle,
    transform: "scale(1.1)",
    boxShadow: "0 0 10px #8B0000", // Dark Red color
    zIndex: 10
  }

  return (
    <div style={hotbarStyle}>
      {firstRow.map((item, index) => (
        <div key={index} style={index === activeSlot ? activeSlotStyle : slotStyle}>
          {item?.baseGear ? (
            <img
              alt={item.baseGear.displayName}
              src={item.baseGear.textureURL}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <div style={{ ...slotStyle }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default InventoryHotbar
