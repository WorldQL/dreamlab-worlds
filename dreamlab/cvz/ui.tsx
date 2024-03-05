import type { Game } from "@dreamlab.gg/core"
import { renderUI } from "@dreamlab.gg/ui/react"
import { StyleSheetManager } from "https://esm.sh/v135/styled-components@6.1.8"
import React from "react"

const App = () => <div>Hello World</div>

export const initializeUI = (game: Game<false>) => {
  const styles = document.createElement("style")
  const ui = renderUI(
    game,
    <StyleSheetManager target={styles}>
      <App />,
    </StyleSheetManager>
  )

  ui.root.append(styles)
  return ui
}
