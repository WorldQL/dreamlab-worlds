import type { NetClient } from "@dreamlab.gg/core/network"
import { useNetwork } from "@dreamlab.gg/ui/react"
import { useCallback, useRef } from "react"
import {
  SYNC_POINTS_CHANNEL,
  SYNC_UPGRADES_CHANNEL,
  SyncPointsToServerData,
  SyncUpgradesToServerData
} from "../network.ts"
import { atom, useAtomValue, useSetAtom } from "./_deps/jotai.ts"
import styled from "./_deps/styled.ts"
import { pointsAtom, upgradeCostAtom, upgradesAtom } from "./root.tsx"
import { useAnimationFrame } from "./useAnimationFrame.ts"
import { perSecondAtom } from "./root.tsx"

const upgradeAtom = atom(null, (get, set) => {
  const points = get(pointsAtom) ?? 0
  const upgradeCost = get(upgradeCostAtom)
  if (points < upgradeCost) return

  const value: { points: number | undefined; upgrades: number | undefined } = {
    points: undefined,
    upgrades: undefined
  }

  set(pointsAtom, points => {
    if (points === undefined) throw new Error("cannot increment, data hasnt loaded")
    value.points = points - upgradeCost

    return value.points
  })

  set(upgradesAtom, upgrades => {
    value.upgrades = upgrades + 1
    return value.upgrades
  })

  if (value.points === undefined || value.upgrades === undefined) {
    throw new Error("failed to assign value")
  }

  return { points: value.points, upgrades: value.upgrades }
})

const Button = styled.button`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  margin-bottom: 1rem;
  /* TODO: Better styles */
`

export const Upgrade = () => {
  const network: NetClient = useNetwork()

  const points = useAtomValue(pointsAtom) ?? 0
  const setPoints = useSetAtom(pointsAtom)
  const perSecond = useAtomValue(perSecondAtom)
  const upgradeCost = useAtomValue(upgradeCostAtom)
  const upgrade = useSetAtom(upgradeAtom)

  const onClick = useCallback(() => {
    const value = upgrade()
    if (!value) return

    const pointsPayload: SyncPointsToServerData = { points: Math.floor(value.points) }
    network.sendCustomMessage(SYNC_POINTS_CHANNEL, pointsPayload)

    const upgradesPayload: SyncUpgradesToServerData = { upgrades: value.upgrades }
    network.sendCustomMessage(SYNC_UPGRADES_CHANNEL, upgradesPayload)
  }, [network, upgrade])

  // Frequency (Hz) of UI updates
  const frequency = 30
  const period = 1 / frequency

  // Local state as refs to bypass reactive state
  // Means the UI doesnt re-render every frame unless it has to
  const acc = useRef(0)
  const count = useRef(0)
  const lastSent = useRef(-1)

  // Runs every frame
  const onTick = useCallback(
    ({ delta }: { time: number; delta: number }) => {
      let newPoints: number | undefined

      // Increment current accumulator with delta time
      acc.current += delta

      // If we have accumulated enough time to tick
      if (acc.current >= period) {
        // Update counters
        acc.current -= period
        count.current += 1

        // Add appropriate number of points
        // We also assign to a local so we can access the exact point value
        // jotai updates are batches so we cant just read the value as it might be out of date
        setPoints(points => {
          if (!points) return points
          newPoints = points + perSecond * period

          return newPoints
        })
      }

      // Throttle sync packets to 1 per second
      if (count.current >= frequency) {
        count.current = 0
        if (!newPoints) return

        // Ensure we dont flood the network if nothing has changed
        const points = Math.floor(newPoints)
        if (lastSent.current === points) return
        lastSent.current = points

        // Sync current points to server
        const pointsPayload: SyncPointsToServerData = { points }
        network.sendCustomMessage(SYNC_POINTS_CHANNEL, pointsPayload)
      }
    },
    [network, acc, count, perSecond]
  )

  useAnimationFrame(onTick)

  return (
    <Button type="button" disabled={points < upgradeCost} onClick={onClick}>
      Upgrade (Cost: {upgradeCost})
    </Button>
  )
}
