import { Quest } from "./entities/spawnable/quest.ts"
import { events } from "./events.ts"

const MAX_HEALTH = 10
const INITIAL_KILLS = 0
const INITIAL_GOLD = 500

class PlayerManager {
  private static instance: PlayerManager
  private health: number
  private kills: number
  private gold: number
  private quests: Quest[]

  private constructor() {
    this.health = MAX_HEALTH
    this.kills = INITIAL_KILLS
    this.gold = INITIAL_GOLD
    this.quests = [
      new Quest(
        "Find Wagon Wheel",
        "Find and collect the wagon wheel.",
        {
          type: "gatherPart",
          partName: "Wagon-Wheel"
        },
        1000
      ),
      new Quest(
        "Find Wagon Cover",
        "Find and collect a wagon cover.",
        {
          type: "gatherPart",
          partName: "Wagon-Cover"
        },
        1000
      ),
      new Quest(
        "Find Wagon Bed",
        "Find and collect wagon bed parts.",
        {
          type: "gatherPart",
          partName: "Wagon-Bed"
        },
        1000
      )
    ]
  }

  public static getInstance(): PlayerManager {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager()
    }
    return PlayerManager.instance
  }

  // Health
  public getHealth(): number {
    return this.health
  }

  public getMaxHealth(): number {
    return MAX_HEALTH
  }

  public setHealth(amount: number): void {
    this.health = Math.min(MAX_HEALTH, Math.max(0, amount))
  }

  public addHealth(amount: number): void {
    this.health = Math.min(MAX_HEALTH, this.health + amount)
  }

  public removeHealth(amount: number): void {
    this.health = Math.max(0, this.health - amount)
  }

  // Kills
  public getKills(): number {
    return this.kills
  }

  public setKills(amount: number): void {
    this.kills = Math.max(0, amount)
  }

  public addKills(amount: number): void {
    this.kills += amount
    this.updateQuestProgress("reachKills", this.kills)
  }

  public removeKills(amount: number): void {
    this.kills = Math.max(0, this.kills - amount)
  }

  // Gold
  public getGold(): number {
    return this.gold
  }

  public setGold(amount: number): void {
    this.gold = Math.max(0, amount)
    events.emit("onGoldUpdate")
  }

  public addGold(amount: number): void {
    this.gold += amount
    this.updateQuestProgress("reachGold", this.gold)
    events.emit("onGoldUpdate")
  }

  public removeGold(amount: number): void {
    this.gold = Math.max(0, this.gold - amount)
    events.emit("onGoldUpdate")
  }

  // Quests
  public getQuests(): Quest[] {
    return this.quests
  }

  public addQuest(quest: Quest): void {
    this.quests.push(quest)
  }

  public removeQuest(quest: Quest): void {
    const index = this.quests.indexOf(quest)
    if (index !== -1) {
      this.quests.splice(index, 1)
    }
  }

  public hasAcceptedQuest(questTitle: string): boolean {
    return this.quests.some(quest => quest.title === questTitle)
  }

  public acceptQuest(quest: Quest): void {
    if (!this.hasAcceptedQuest(quest.title)) {
      this.addQuest(quest)
      events.emit("onQuestAccepted", quest)
    }
  }

  public updateQuestProgress(questType: string, progress: number | string): void {
    for (const quest of this.quests) {
      if (quest.goal.type === questType) {
        if (quest.completed) return
        else if (questType === "reachGold" || questType === "reachKills") {
          const goal = quest.goal as { type: "reachGold" | "reachKills"; amount: number }
          quest.completed = (questType === "reachGold" ? this.gold : this.kills) >= goal.amount
        } else if (questType === "gatherPart") {
          const goal = quest.goal as { type: "gatherPart"; partName: string }
          quest.completed = progress === goal.partName
        }

        if (quest.completed) {
          this.addGold(quest.goldReward)
          events.emit("onQuestCompleted", quest)
        }
      }
    }
  }

  public completeQuest(questTitle: string): void {
    const quest = this.quests.find(quest => quest.title === questTitle)
    if (quest) {
      quest.completed = true
    }
  }
}

export default PlayerManager
