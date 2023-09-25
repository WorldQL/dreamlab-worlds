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
      sprite.width = 90
      sprite.height = 90
      sprite.x = 0
      sprite.y = 0

      const app = new Application({
        width: 90,
        height: 90,
        view: ref.current,
        background: '#fff',
      })

      app.stage.addChild(sprite)

      return () => {
        app.destroy()
      }
    }
  }, [item.image])

  return (
    <canvas
      ref={ref}
      width='90'
      height='90'
      style={{
        border: isSelected ? '2px solid blue' : '1px solid gray',
        marginRight: '4px',
      }}
    />
  )
}

interface HotbarProps {
  items: Item[]
  currentItemIndex: number
}

const Hotbar: FC<HotbarProps> = ({ items, currentItemIndex }) => (
  <div
    style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '6px',
      background: '#2c2c2c',
      borderRadius: '4px',
    }}
  >
    {items.map((item, index) => (
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
