// TODO: refactor?
import { events } from "./events.ts";

const MAX_HEALTH = 10;
const INITIAL_SCORE = 0;
const INITIAL_GOLD = 500;

class PlayerManager {
  private static instance: PlayerManager;
  private health: number;
  private score: number;
  private gold: number;

  private constructor() {
    this.health = MAX_HEALTH;
    this.score = INITIAL_SCORE;
    this.gold = INITIAL_GOLD;
  }

  public static getInstance(): PlayerManager {
    if (!PlayerManager.instance) {
      PlayerManager.instance = new PlayerManager();
    }

    return PlayerManager.instance;
  }

  // Health
  public getHealth(): number {
    return this.health;
  }

  public getMaxHealth(): number {
    return MAX_HEALTH;
  }

  public setHealth(amount: number): void {
    this.health = Math.min(MAX_HEALTH, Math.max(0, amount));
  }

  public addHealth(amount: number): void {
    this.health = Math.min(MAX_HEALTH, this.health + amount);
  }

  public removeHealth(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  // Score
  public getScore(): number {
    return this.score;
  }

  public setScore(amount: number): void {
    this.score = Math.max(0, amount);
  }

  public addScore(amount: number): void {
    this.score += amount;
  }

  public removeScore(amount: number): void {
    this.score = Math.max(0, this.score - amount);
  }

  // Gold
  public getGold(): number {
    return this.gold;
  }

  public setGold(amount: number): void {
    this.gold = Math.max(0, amount);
    events.emit("onGoldUpdate");
  }

  public addGold(amount: number): void {
    this.gold += amount;
    events.emit("onGoldUpdate");
  }

  public removeGold(amount: number): void {
    this.gold = Math.max(0, this.gold - amount);
    events.emit("onGoldUpdate");
  }
}

export default PlayerManager;
