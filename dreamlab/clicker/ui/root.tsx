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

// We are using jotai for our state management
// View their docs @ https://jotai.org/

// Define our base data, number of points and number of upgrades
// Points is `undefined` until we recieve player data from the server
export const pointsAtom = atom<number | undefined>(0)
export const upgradesAtom = atom<number>(0)

// Derive the number of points per second from the upgrade count
// Follows an exponential curve
const PER_SECOND_MULTIPLIER = 1.5
const PER_SECOND_EXPONENT = 1.03
export const perSecondAtom = atom(get =>
  Math.floor((get(upgradesAtom) * PER_SECOND_MULTIPLIER) ** PER_SECOND_EXPONENT)
)

// Derive the cost of the next upgrade from the upgrade count
// Follows an exponential curve
const UPGRADE_BASE_COST = 50
const UPGRADE_EXPONENT = 1.02
export const upgradeCostAtom = atom(get =>
  Math.floor((get(upgradesAtom) * UPGRADE_BASE_COST) ** UPGRADE_EXPONENT + UPGRADE_BASE_COST)
)

// Quick helper atom to load atom state from packet
const loadAtom = atom(null, (get, set, data: LoadToClientData) => {
  set(pointsAtom, data.points)
  set(upgradesAtom, data.upgrades)
})

export const App = () => {
  const network: NetClient = useNetwork()
  const points = useAtomValue(pointsAtom)
  const load = useSetAtom(loadAtom)

  // Request initial player state from server
  useEffect(() => {
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
