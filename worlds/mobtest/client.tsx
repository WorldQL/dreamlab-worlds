import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'https://esm.sh/react@18.2.0'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import { Texture, Application, Sprite } from 'pixi.js'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'

interface Item {
  id: string
  image: Texture
}

interface HotbarItemProps {
  item: Item
  isSelected: boolean
}

const HotbarItem: FC<HotbarItemProps> = ({ item, isSelected }) => {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (ref.current && item.image) {
      const sprite = new Sprite(item.image)
      sprite.width = 60
      sprite.height = 60
      sprite.x = 0
      sprite.y = 0

      const app = new Application({
        width: 60,
        height: 60,
        view: ref.current,
        background: '#fff',
      })

      app.stage.addChild(sprite)

      return () => {
        app.destroy()
      }
    }
  }, [item.image])

  const styles = {
    border: isSelected
      ? '3px solid cyan'
      : '2px solid rgba(255, 255, 255, 0.2)',
    marginRight: '10px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    transition: 'transform 0.2s',
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }

  return <canvas ref={ref} width='60' height='60' style={styles} />
}

interface HotbarProps {
  items: Item[]
  currentItemIndex: number
}

const Hotbar: FC<HotbarProps> = ({ items, currentItemIndex }) => (
  <div
    style={{
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',
      background: 'linear-gradient(145deg, #292929, #1c1c1c)',
      borderRadius: '16px',
      boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
    }}
  >
    {items.slice(0, 4).map((item, index) => (
      <HotbarItem
        key={item.id}
        item={item}
        isSelected={currentItemIndex === index}
      />
    ))}
  </div>
)

interface AppProps {
  items: Item[]
  initialCurrentItemIndex: number
  game: any
}

const App: FC<AppProps> = ({ items, initialCurrentItemIndex, game }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(
    initialCurrentItemIndex,
  )
  let didRespondToCycleItem = false

  useEffect(() => {
    const checkInputAndCycleItem = () => {
      const inputs = game.client?.inputs
      const shouldCycle = inputs?.getInput('@player/cycle-item') ?? false

      if (shouldCycle) {
        if (!didRespondToCycleItem) {
          setCurrentItemIndex(prevIndex => (prevIndex + 1) % items.length)
          didRespondToCycleItem = true
        }
      } else {
        didRespondToCycleItem = false
      }
      requestAnimationFrame(checkInputAndCycleItem)
    }

    requestAnimationFrame(checkInputAndCycleItem)

    return () => {}
  }, [items, game])

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <Hotbar items={items} currentItemIndex={currentItemIndex} />
    </div>
  )
}

const setupInventory = (game: {
  entities: any[]
  client: { ui: { add: (arg0: HTMLDivElement) => void } }
}) => {
  const player = game.entities.find(isPlayer)
  if (player) {
    const inventory = player.inventory
    const items = inventory.getItems()
    const currentItemIndex = items.indexOf(inventory.currentItem())

    const uiContainer = document.createElement('div')
    game.client.ui.add(uiContainer)
    const reactRoot = createRoot(uiContainer)
    reactRoot.render(
      <App
        items={items}
        initialCurrentItemIndex={currentItemIndex}
        game={game}
      />,
    )
  }
}

const onPlayerInstantiate = (game: any) => {
  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (!isPlayer(entity)) return
    setupInventory(game)
  })
}

export const initializeGameUI = (game: any) => {
  onPlayerInstantiate(game)
}
