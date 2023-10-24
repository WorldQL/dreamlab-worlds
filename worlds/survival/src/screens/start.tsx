import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import type { CSSProperties } from 'https://esm.sh/react@18.2.0'
import React, { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import { styles } from './styles'

interface ScreenProps {
  game: Game<false>
  player: Player
}

const StartScreen: React.FC<ScreenProps> = ({ game }) => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const killListener = () => {
      console.log(`Killed a zombie!`)
    }

    game.events.custom.addListener('onPlayerKill', killListener)

    return () => {
      game.events.custom.removeListener('onPlayerKill', killListener)
    }
  }, [game])

  const handlePlayClick = async () => {
    setVisible(false)
  }

  const getButtonStyles = (): CSSProperties => {
    const style: CSSProperties = { ...styles.button }

    if (active) {
      style.transform = 'scale(0.95)'
    }

    if (hovered) {
      style.transform = 'scale(1.1)'
      style.boxShadow = '0 0 15px #9d9d9d'
    }

    return style
  }

  if (!visible) return null

  return (
    <div style={styles.container}>
      <div style={styles.bloodStain} />
      <div style={styles.content}>
        <div style={styles.title}>Zombie Survival</div>
        <button
          onClick={handlePlayClick}
          onMouseDown={() => setActive(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            setHovered(false)
            setActive(false)
          }}
          onMouseUp={() => setActive(false)}
          style={getButtonStyles()}
          type='button'
        >
          PLAY
        </button>
      </div>
    </div>
  )
}

export const initializeStartScreen = (game: Game<false>) => {
  game.events.common.addListener('onInstantiate', (entity: unknown) => {
    if (isPlayer(entity)) {
      const uiContainer = document.createElement('div')
      game.client.ui.add(uiContainer)
      createRoot(uiContainer).render(
        <StartScreen game={game} player={entity} />,
      )
    }
  })
}
