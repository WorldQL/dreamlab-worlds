import type { NetClient } from "@dreamlab.gg/core/network"
import { useNetwork } from "@dreamlab.gg/ui/react"
import { useCallback } from "react"
import { atom } from "./_deps/jotai.ts"
import { useSetAtom } from "./_deps/jotai.ts"
import styled from "./_deps/styled.ts"
import { pointsAtom } from "./root.tsx"
import type { SyncPointsToServerData } from "../network.ts"
import { SYNC_POINTS_CHANNEL } from "../network.ts"

const incrementAtom = atom(null, (get, set, by: number = 1) => {
  let value: number | undefined = undefined
  set(pointsAtom, points => {
    if (points === undefined) throw new Error("cannot increment, data hasnt loaded")
    value = points + by

    return value
  })

  // TODO: Make this less of a hack
  if (value === undefined) {
    throw new Error("failed to assign value")
  }

  return value
})

const ClickButton = styled.button`
  all: unset;
  cursor: pointer;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 20rem;
  height: auto;
  aspect-ratio: 1;
  border-radius: 50%;

  --inner-color: rgba(255, 98, 98, 1);
  --mid-color: rgba(255, 6, 0, 1);
  --outer-color: rgba(203, 5, 0, 1);

  background: radial-gradient(
    circle,
    var(--inner-color) 0%,
    var(--mid-color) 90%,
    var(--outer-color) 100%
  );

  box-shadow: var(--outer-color) 0 8px;

  &:hover {
    transform: translate(-50%, -50%) translateY(-2px);
    box-shadow: var(--outer-color) 0 10px;
  }

  &:active {
    transform: translate(-50%, -50%) translateY(6px);
    box-shadow: var(--outer-color) 0 2px;
  }
`

export const Button = () => {
  const network: NetClient = useNetwork()
  const increment = useSetAtom(incrementAtom)

  const onClick = useCallback(() => {
    const by = 1
    const value = increment(by)

    // const payload: SyncPointsToServerData = { points: value }
    // network.sendCustomMessage(SYNC_POINTS_CHANNEL, payload)
  }, [network, increment])

  return <ClickButton onClick={onClick} type="button" />
}
