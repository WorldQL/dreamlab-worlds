import type { FC } from "https://esm.sh/react@18.2.0"
import { useEffect, useState } from "https://esm.sh/react@18.2.0"
import { events } from "../../events.ts"
import { game } from "@dreamlab.gg/core/dist/labs"
import PlayerManager, { Quest, QuestType, QuestGoal } from "../../playerManager.ts"

export const QuestOverlay: FC = () => {
  const [currentQuest, setCurrentQuest] = useState<Quest | undefined>(undefined)
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false)

  const playerManager = PlayerManager.getInstance()

  useEffect(() => {
    const questListener = (
      title: string | undefined,
      description: string | undefined,
      goldReward: number | undefined,
      questType: QuestType | undefined,
      questGoal: QuestGoal | undefined
    ) => {
      if (
        title &&
        description &&
        questType &&
        questGoal &&
        goldReward !== undefined &&
        !playerManager.hasAcceptedQuest(title)
      ) {
        const quest: Quest = {
          title,
          description,
          goal: questGoal,
          goldReward,
          completed: false
        }
        setCurrentQuest(quest)
        setAwaitingConfirmation(true)
      } else {
        setCurrentQuest(undefined)
        setAwaitingConfirmation(false)
      }
    }

    const questConfirmListener = (keyDown: boolean) => {
      if (!keyDown || !awaitingConfirmation || !currentQuest) {
        return
      }

      if (!playerManager.hasAcceptedQuest(currentQuest.title)) {
        playerManager.acceptQuest(currentQuest)
      }
      setCurrentQuest(undefined)
      setAwaitingConfirmation(false)
    }

    events.addListener("onQuestTrigger", questListener)
    game().client?.inputs.addListener("@cvz/pickup", questConfirmListener)

    return () => {
      events.removeListener("onQuestTrigger", questListener)
      game().client?.inputs.removeListener("@cvz/pickup", questConfirmListener)
    }
  }, [awaitingConfirmation, currentQuest])

  if (!currentQuest) return null

  const getQuestGoalText = (goal: QuestGoal) => {
    switch (goal.type) {
      case "reachGold":
        return `Collect ${goal.amount} gold`
      case "reachKills":
        return `Kill ${goal.amount} enemies`
      case "gatherPart":
        return `Gather ${goal.partName}`
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        top: "70%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#8B4513",
        border: "4px solid #D2691E",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "400px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#FFF8DC",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
      }}
    >
      <h2 style={{ margin: "0 0 10px" }}>{currentQuest.title}</h2>
      <p style={{ margin: 0, lineHeight: 1.5 }}>{currentQuest.description}</p>
      <p style={{ margin: "10px 0", fontWeight: "bold" }}>
        Goal: {getQuestGoalText(currentQuest.goal)}
      </p>
      {awaitingConfirmation && !playerManager.hasAcceptedQuest(currentQuest.title) && (
        <p style={{ margin: "10px 0 0", fontWeight: "bold" }}>Press F to accept the quest</p>
      )}
    </div>
  )
}
