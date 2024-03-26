import { Entity } from "@dreamlab.gg/core"
import { game } from "@dreamlab.gg/core/labs"
import { renderUI } from "@dreamlab.gg/ui/react"
import { StyleSheetManager } from "./ui/_deps/styled.ts"
import { App } from "./ui/root.tsx"

export class ClickerUi extends Entity {
  private unmount: (() => void) | undefined

  public constructor() {
    super()

    const $game = game("client")
    if ($game) {
      const styles = document.createElement("style")

      const root = (
        <StyleSheetManager target={styles}>
          <App />
        </StyleSheetManager>
      )

      const ui = renderUI($game, root, { interactable: true })
      ui.root.append(styles)
      ui.container.style.width = "100%"
      ui.container.style.height = "100%"

      this.unmount = ui.unmount
    }
  }

  public teardown(): void {
    this.unmount?.()
  }
}
