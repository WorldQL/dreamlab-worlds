import React, {
  FC,
  useEffect,
  useState,
  useRef,
} from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import { Application, Texture, Sprite } from 'pixi.js'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'

interface Item {
  id: string
  texture: Texture
}

const hotbarContainerStyle = {
  display: 'flex',
  gap: '8px',
  padding: '15px',
  border: '1px solid #555',
  borderRadius: '8px',
  background: '#333',
}

const activeItemStyle = {
  display: 'flex',
  gap: '8px',
  border: '1px solid #aaa',
  padding: '15px',
  borderRadius: '8px',
  background: '#444',
}

const HotbarItem: FC<{ item: Item; isSelected: boolean }> = ({
  item,
  isSelected,
}) => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (ref.current) {
      const canvas = ref.current
      const sprite = new Sprite(item.texture)
      sprite.width = 50
      sprite.height = 50
      const app = new Application({
        width: 50,
        height: 50,
        view: canvas,
        background: '#1c1c1c',
      })
      app.stage.addChild(sprite)
      return () => app.destroy()
    }
  }, [item.texture])

  return (
    <canvas
      ref={ref}
      width='50'
      height='50'
      style={{ ...itemStyles(isSelected), margin: '0' }}
    />
  )
}

const itemStyles = (isSelected: boolean) => ({
  border: isSelected
    ? '3px solid #1E90FF'
    : '2px solid rgba(255, 255, 255, 0.2)',
  boxShadow: isSelected ? '0px 0px 15px 2px #1E90FF' : 'none',
  borderRadius: '8px',
  transition: 'all 0.2s',
  cursor: 'pointer',
})

const Inventory: FC<{ player: any }> = ({ player }) => {
  const items = player.inventory.getItems()
  const [activeItems, setActiveItems] = useState<Item[]>([])

  const handleItemClick = (item: Item) => {
    setActiveItems(prev => [...prev, item])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={activeItemStyle}>
        {activeItems.map((item, idx) => (
          <HotbarItem key={idx} item={item} isSelected={false} />
        ))}
      </div>
      <div style={hotbarContainerStyle}>
        {items.map((item: Item) => (
          <div onClick={() => handleItemClick(item)} key={item.id}>
            <HotbarItem item={item} isSelected={activeItems.includes(item)} />
          </div>
        ))}
      </div>
    </div>
  )
}

const App: FC<{ game: any; player: any }> = ({ game, player }) => {
  const [isInventoryOpen, setInventoryOpen] = useState(false)
  const [activeItems, setActiveItems] = useState<Item[]>([])

  console.log(activeItems)

  const handleDigitInput = (digit: number) => {
    if (player.inventory.getItems().length >= digit) {
      const selectedItem = player.inventory.getItems()[digit - 1]
      setActiveItems([selectedItem])
      player.inventory.setCurrentItem(selectedItem)
    }
  }

  useEffect(() => {
    let lastToggleTime = 0
    const toggleDelay = 500

    const checkInputAndOpenInventory = () => {
      const shouldOpenInventory =
        game.client?.inputs?.getInput('@inventory/open') ?? false
      const currentTime = new Date().getTime()

      if (shouldOpenInventory && currentTime - lastToggleTime > toggleDelay) {
        setInventoryOpen(prev => !prev)
        lastToggleTime = currentTime
      }
      requestAnimationFrame(checkInputAndOpenInventory)
    }
    checkInputAndOpenInventory()
  }, [game])

  useEffect(() => {
    const checkInputAndSelectItem = () => {
      for (let i = 1; i <= 4; i++) {
        const shouldSelectItem =
          game.client?.inputs?.getInput(`@inventory/digit${i}`) ?? false
        if (shouldSelectItem) {
          handleDigitInput(i)
        }
      }
      requestAnimationFrame(checkInputAndSelectItem)
    }
    checkInputAndSelectItem()
  }, [game])

  return (
    <>
      {isInventoryOpen && (
        <div
          style={{
            position: 'relative',
            height: '100vh',
            background: '#222',
            padding: '40px',
          }}
        >
          <Inventory player={player} />
        </div>
      )}
    </>
  )
}

export const initializeGameUI = (game: any) => {
  // register inputs
  game.client?.inputs.registerInput('@inventory/open', 'KeyQ')
  game.client?.inputs.registerInput('@inventory/digit1', 'Digit1')
  game.client?.inputs.registerInput('@inventory/digit2', 'Digit2')
  game.client?.inputs.registerInput('@inventory/digit3', 'Digit3')
  game.client?.inputs.registerInput('@inventory/digit4', 'Digit4')

  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(<App game={game} player={entity} />)
    }
  })
}
