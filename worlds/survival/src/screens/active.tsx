import { useEffect, useState } from 'https://esm.sh/react@18.2.0'
import type { ScreenProps } from './start'
import { styles } from './styles'

export const GameScreen: React.FC<ScreenProps> = ({ game }) => {
  const [killCount, setKillCount] = useState(0)
  const [health, setHealth] = useState(5)

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
      <div style={styles.gameScreenTitle}>Health: {health}</div>
      <div style={styles.gameScreenTitle}>Kills: {killCount}</div>
    </div>
  )
}
