import { CSSProperties } from 'https://esm.sh/react@18.2.0'

export const inventoryStyles: Record<string, CSSProperties> = {
  inventory: {
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'column',
    border: '3px solid #666',
    width: '465px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: '10px',
    borderRadius: '10px',
  },
  inventoryTitle: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: '10px',
    fontSize: '20px',
  },
  inventoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
  },
  inventorySlot: {
    width: '50px',
    height: '50px',
    border: '1px solid #aaa',
    backgroundColor: '#eee',
    position: 'relative',
    transition: 'background-color 0.3s ease',
  },
  inventorySlotHover: {
    backgroundColor: '#f5f5f5',
  },
  weaponSlots: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
    borderTop: '2px solid #ccc',
    paddingTop: '10px',
  },
}
