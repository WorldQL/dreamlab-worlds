import { SpawnableEntity, SpawnableContext, RenderTime, PreviousArgs } from "@dreamlab.gg/core"
import { Bounds, Vector, Vec, distance } from "@dreamlab.gg/core/math"
import { game, camera, stage, network } from "@dreamlab.gg/core/labs"
import { CircleGraphics, drawCircle } from "@dreamlab.gg/core/utils"
import { z } from "@dreamlab.gg/core/sdk"

type Args = typeof ArgsSchema
const ArgsSchema = z.object({
  radius: z.number().min(50).default(400)
})

export { ArgsSchema as ClickerArgs }
export class Clicker extends SpawnableEntity<Args> {
  private static CLICK_CHANNEL = "@clicker/Clicker/click"

  private circle: CircleGraphics | undefined

  private ui: ShadowRoot | undefined
  private uiContainer: HTMLDivElement | undefined
  private uiText: HTMLSpanElement | undefined

  #points = 0
  public get points(): number {
    return this.#points
  }

  public constructor(ctx: SpawnableContext<Args>) {
    super(ctx)
    this.tags.push("editor/doNotSave")

    const $game = game()
    if ($game.client) {
      this.circle = drawCircle({ radius: this.args.radius })
      stage().addChild(this.circle)

      this.ui = $game.client.ui.create(false)
      this.uiContainer = document.createElement("div")
      this.uiContainer.style.width = "100%"
      this.uiContainer.style.textAlign = "center"

      this.uiText = document.createElement("span")
      this.uiText.style.font = "5rem sans-serif"
      this.uiText.innerHTML = `${this.#points} Points`

      this.ui.append(this.uiContainer)
      this.uiContainer.append(this.uiText)
    }

    network("server")?.addCustomMessageListener(Clicker.CLICK_CHANNEL, async peer => {
      if (!$game.server) throw new Error("what")
      const kv = $game.server.kv.player(peer.playerID)

      const value = (await kv.get("points")) ?? "0"
      const playerPoints = Number.parseInt(value, 10)
      await kv.set("points", (playerPoints + 1).toString())
    })

    // TODO: Send KV value to player
    // if ($game.server !== undefined) {
    //   $game.events.common.addListener("onPlayerJoin", (player) => {
    //     const points = $game.server!.kv.player(player.)
    //     $game.server!.network?.sendCustomMessage(player.connectionId, Clicker.JOIN_CHANNEL, {points})
    //   })
    // }
  }

  public teardown(): void {
    this.circle?.destroy()
  }

  public bounds(): Bounds | undefined {
    const size = this.args.radius * 2
    return { width: size, height: size }
  }

  public isPointInside(point: Vector): boolean {
    return distance(this.transform.position, point) <= this.args.radius
  }

  public onArgsUpdate(path: string, _previousArgs: PreviousArgs<Args>): void {
    if (path === "radius") this.circle?.redraw({ radius: this.args.radius })
  }

  public onClick(_position: Vector): void {
    this.#points += 1
    if (this.uiText) this.uiText.innerHTML = `${this.#points} Points`
    network("client")?.sendCustomMessage(Clicker.CLICK_CHANNEL, {})
  }

  public onRenderFrame(_time: RenderTime): void {
    const pos = Vec.add(this.transform.position, camera().offset)
    if (this.circle) this.circle.position = pos
  }
}
