import React, { useRef, useEffect } from 'https://esm.sh/react@18.2.0'
import { Application, Sprite } from 'pixi.js'
import { InventorySlot as SlotType } from './types'
import { inventoryStyles as styles } from './InventoryStyle.js'

interface Props {
  slot: SlotType
}

const InventorySlot: React.FC<Props> = ({ slot }) => {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    if (ref.current) {
      if (slot && slot.texture) {
        console.log(slot)
        const canvas = ref.current
        const sprite = new Sprite(slot.texture)
        sprite.width = 50
        sprite.height = 50

        if (!appRef.current) {
          console.log('IN')
          appRef.current = new Application({
            width: 50,
            height: 50,
            view: canvas,
            background: '#1c1c1c',
          })
        }

        appRef.current.stage.removeChildren()
        appRef.current.stage.addChild(sprite)
      } else {
        appRef.current?.stage.removeChildren()
      }
    }

    return () => {
      if (appRef.current) {
        console.log('DESTROY')
        appRef.current.destroy(true)
        appRef.current = null
      }
    }
  }, [slot])

  return (
    <div style={styles.inventorySlot}>
      <canvas ref={ref} width='50' height='50'></canvas>
    </div>
  )
}

export default InventorySlot
