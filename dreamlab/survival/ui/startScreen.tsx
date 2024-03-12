import type { Game } from "@dreamlab.gg/core"
import type { Player } from "@dreamlab.gg/core/dist/entities"
import type { InputCode } from "@dreamlab.gg/core/dist/input"
import { renderUI, useGame, usePlayer } from "@dreamlab.gg/ui/react"
import type { CSSProperties, FC } from "https://esm.sh/react@18.2.0"
import { useState } from "https://esm.sh/react@18.2.0"
import { InventoryApp } from "../inventory/inventoryApp.tsx"
import { GameScreen } from "./gameScreen.tsx"
import { ItemScreen } from "./itemPopup.tsx"
import { styles } from "./styles.ts"
import { MessageScreen } from "./message.tsx"
import { HealingScreen } from "./healScreen.tsx"

export interface StartScreenProps {
  game: Game<false>
  player: Player
}

const StartScreen: FC = () => {
  const game = useGame()
  const player = usePlayer()

  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const handlePlayClick = async () => {
    setGameStarted(true)
  }

  const getButtonStyles = (hover: boolean, active: boolean): CSSProperties => {
    const style: CSSProperties = { ...styles.button }
    if (active) {
      style.transform = "translateY(2px)"
      style.boxShadow = "1px 1px 0px #7f462c"
    }

    if (hover) {
      style.backgroundColor = "#a52a2a"
      style.color = "#ffffff"
      style.borderColor = "#7f0000"
      style.boxShadow = "0 0 10px 3px #ff0000"
      style.textShadow = "0 0 5px #ff0000, 0 0 10px #ff0000"
    }

    return style
  }

  if (player && gameStarted) {
    return <GameScreen game={game} player={player} />
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundAnimation} />
      <div style={styles.content}>
        {!player ? (
          <div style={getButtonStyles(hovered, active)}>Loading...</div>
        ) : (
          <button
            onClick={handlePlayClick}
            onMouseDown={() => setActive(true)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
              setHovered(false)
              setActive(false)
            }}
            onMouseUp={() => setActive(false)}
            style={getButtonStyles(hovered, active)}
            type="button"
          >
            Play
          </button>
        )}
      </div>
      <div style={styles.versionLabel}>Alpha Version</div>
    </div>
  )
}

export const initializeUI = (game: Game<false>) => {
  const registerInput = (input: string, name: string, defaultKey: InputCode) =>
    game.client?.inputs.registerInput(input, name, defaultKey)

  const digits = Array.from({ length: 9 }, (_, index) => "digit" + (index + 1))
  const keys: InputCode[] = [
    "KeyE",
    ...Array.from({ length: 9 }, (_, index) => `Digit${index + 1}` as InputCode)
  ]
  const inputNames = ["Open Inventory", ...digits.map(digit => `Select ${digit}`)]

  for (const [index, input] of ["open", ...digits].entries()) {
    const key = keys[index]
    const name = inputNames[index]
    if (key && name) {
      registerInput(`@inventory/${input}`, name, key)
    }
  }

  registerInput("@survival/pickup", "Item Pickup", "KeyF")

  renderUI(
    game,
    <>
      <StartScreen />
      <InventoryApp />
      <ItemScreen game={game} item={undefined} />
      <HealingScreen game={game} />
      <MessageScreen />
    </>
  )
}
