// HealingScreen.tsx
import type { Game } from "@dreamlab.gg/core"
import { usePlayer } from "@dreamlab.gg/ui/dist/react"
import type { FC } from "https://esm.sh/react@18.2.0"
import { useEffect, useState } from "https://esm.sh/react@18.2.0"
import { events } from "../events.ts"
import PlayerManager from "../playerDataManager.ts"

interface HealingScreenProps {
  game: Game<false>
}

export const HealingScreen: FC<HealingScreenProps> = ({ game }) => {
  const player = usePlayer()
  const [prompt, setPrompt] = useState("")
  const [nearHealingItem, setNearHealingItem] = useState(false)
  const [healAmount, setHealAmount] = useState<number | undefined>(undefined)
  const playerManager = PlayerManager.getInstance()

  useEffect(() => {
    const healingItemListener = (amount: number | undefined) => {
      setNearHealingItem(amount !== undefined)
      setHealAmount(amount)
      setPrompt(amount !== undefined ? `Press 'F' to heal for ${amount} Health` : "")
    }

    const healKeyListener = (keyDown: boolean) => {
      if (!keyDown || !nearHealingItem || healAmount === undefined) {
        return
      }

      playerManager.addHealth(healAmount)
      setNearHealingItem(false)
      setHealAmount(undefined)
      setPrompt(`+${healAmount} Health`)

      setTimeout(() => {
        setPrompt("")
      }, 1000)
    }

    events.addListener("onPlayerNearHealingItem", healingItemListener)
    game.client.inputs.addListener("@survival/pickup", healKeyListener)

    return () => {
      events.removeListener("onPlayerNearHealingItem", healingItemListener)
      game.client.inputs.removeListener("@survival/pickup", healKeyListener)
    }
  }, [game.client.inputs, player, playerManager, nearHealingItem, healAmount])

  if (!prompt) return null

  return (
    <div
      style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 255, 0, 0.8)",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "400px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "24px",
        color: "#FFFFFF",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
      }}
    >
      <p
        style={{
          margin: 0,
          lineHeight: 1.5
        }}
      >
        {prompt}
      </p>
    </div>
  )
}
