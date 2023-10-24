import { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import type { ScreenProps } from './start'
import { styles } from './styles'

export const GameScreen: React.FC<ScreenProps> = ({ game }) => {
  const [killCount, setKillCount] = useState(0)
  const [health, setHealth] = useState(5)
  const maxHealth = 5

  useEffect(() => {
    const killListener = () => {
      console.log(`Killed a zombie!`)
      setKillCount(prev => prev + 1)
    }

    game.events.custom.addListener('onPlayerKill', killListener)

    return () => {
      game.events.custom.removeListener('onPlayerKill', killListener)
    }
  }, [game])

  useEffect(() => {
    const healthListener = () => {
      setHealth(prev => prev - 1)
    }

    game.events.custom.addListener('onPlayerDamage', healthListener)

    return () => {
      game.events.custom.removeListener('onPlayerDamage', healthListener)
    }
  }, [game])

  return (
    <div style={styles.gameScreenContainer}>
      <div style={styles.healthContainer}>
        <span style={styles.gameScreenLabel}>Health:</span>
        {Array.from({ length: maxHealth }).map((_, index) => (
          <span
            key={health}
            style={{
              ...styles.heartIcon,
              opacity: index < health ? 1 : 0.3,
            }}
          >
            ❤️
          </span>
        ))}
      </div>
      <div style={styles.killContainer}>
        <span style={styles.gameScreenLabel}>Kills:</span>
        <span style={styles.killCount}>{killCount}</span>
        <span style={styles.zombieIcon}>🧟</span>
      </div>
    </div>
  )
}
