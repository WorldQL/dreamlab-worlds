import type { Game } from '@dreamlab.gg/core'
import type { Player } from '@dreamlab.gg/core/dist/entities'
import { isPlayer } from '@dreamlab.gg/core/dist/entities'
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client'
import type { CSSProperties } from 'https://esm.sh/react@18.2.0'
import React, { useState } from 'https://esm.sh/react@18.2.0'

const styles: { [key: string]: CSSProperties } = {
  bloodStain: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage: `
      radial-gradient(circle at 10% 20%, rgba(255, 0, 0, 0.8), transparent 50%),
      radial-gradient(circle at 80% 10%, rgba(255, 0, 0, 0.8), transparent 50%),
      radial-gradient(circle at 20% 80%, rgba(255, 0, 0, 0.8), transparent 50%),
      radial-gradient(circle at 85% 90%, rgba(255, 0, 0, 0.8), transparent 50%)`,
  },
  title: {
    fontSize: '48px',
    color: 'white',
    textShadow: '2px 2px 4px black',
    marginBottom: '20px',
  },
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#1a1a1a',
    pointerEvents: 'auto',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1,
  },
  button: {
    padding: '15px 30px',
    fontSize: '24px',
    background: '#ff0000',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    textShadow: '2px 2px 2px black',
    boxShadow: '0 0 10px #9d9d9d',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  },
}

const handlePlayClick = (player: unknown) => {
  console.log('Play button clicked!', player)
}

interface ScreenProps {
  player: Player
}

const Screen: React.FC<ScreenProps> = ({ player }) => {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

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

  return (
    <div style={styles.container}>
      <div style={styles.bloodStain} />
      <div style={styles.content}>
        <div style={styles.title}>Zombie Survival</div>
        <button
          onClick={() => handlePlayClick(player)}
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
      createRoot(uiContainer).render(<Screen player={entity} />)
    }
  })
}
