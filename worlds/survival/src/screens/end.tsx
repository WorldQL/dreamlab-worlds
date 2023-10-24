import type { CSSProperties } from 'https://esm.sh/react@18.2.0'
import React, { useState } from 'https://esm.sh/react@18.2.0'
import { styles } from './styles'

interface GameOverProps {
  killCount: number
  onStartOver(): void
}

export const GameOver: React.FC<GameOverProps> = ({
  killCount,
  onStartOver,
}) => {
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
        <div style={styles.title}>Game Over</div>
        <div style={{ ...styles.killContainer, marginBottom: '20px' }}>
          <span style={styles.gameScreenLabel}>Kills:</span>
          <span style={styles.killCount}>{killCount}</span>
          <span style={styles.zombieIcon}>🧟</span>
        </div>
        <button
          onClick={onStartOver}
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
          Start Over
        </button>
      </div>
    </div>
  )
}
