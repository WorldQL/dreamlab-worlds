import { CSSProperties } from 'https://esm.sh/react@18.2.0'

export const inventoryStyles: Record<string, CSSProperties> = {
  inventory: {
    pointerEvents: 'auto',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid #ccc',
    width: '465px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '5px',
  },
  inventoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  inventorySlot: {
    width: '50px',
    height: '50px',
    border: '1px solid #aaa',
    backgroundColor: '#eee',
    position: 'relative',
  },
  inventorySlotImg: {
    maxWidth: '100%',
    maxHeight: '100%',
    display: 'block',
    margin: 'auto',
  },
}
