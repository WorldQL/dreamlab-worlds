import type { NetClient } from "@dreamlab.gg/core/network"
import { useNetwork } from "@dreamlab.gg/ui/react"
import { useEffect } from "react"
import type { LoadToClientData } from "../network.ts"
import { LOAD_CHANNEL, LoadToClientSchema } from "../network.ts"
import { atom, useAtomValue, useSetAtom } from "./_deps/jotai.ts"
import { Button } from "./button.tsx"
import { RoomScores } from "./room-scores.tsx"
import { Score } from "./score.tsx"
import { Upgrade } from "./upgrade.tsx"

export const pointsAtom = atom<number | undefined>(0)
export const upgradesAtom = atom<number>(0)

export const perSecondAtom = atom(get => Math.floor((get(upgradesAtom) * 1.5) ** 1.03))

const BASE_COST = 50
const SCALE_FACTOR = 1.02
export const upgradeCostAtom = atom(get =>
  Math.floor((get(upgradesAtom) * BASE_COST) ** SCALE_FACTOR + BASE_COST)
)

const loadAtom = atom(null, (get, set, data: LoadToClientData) => {
  set(pointsAtom, data.points)
  set(upgradesAtom, data.upgrades)
})

export const App = () => {
  const network: NetClient = useNetwork()
  const points = useAtomValue(pointsAtom)
  const load = useSetAtom(loadAtom)

  useEffect(() => {
    // Load initial score

    network.addCustomMessageListener(LOAD_CHANNEL, (_, payload) => {
      const resp = LoadToClientSchema.safeParse(payload)
      if (!resp.success) return

      load(resp.data)
    })

    network.sendCustomMessage(LOAD_CHANNEL, {})
  }, [load])

  // TODO: Loading UI state
  if (points === undefined) return <div>loading...</div>

  return (
    <>
      <Score />
      <Button />
      <RoomScores />
      <Upgrade />
    </>
  )
}
