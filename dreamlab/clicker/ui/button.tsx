import type { NetClient } from "@dreamlab.gg/core/network"
import { useNetwork } from "@dreamlab.gg/ui/react"
import { useCallback } from "react"
import { atom } from "./_deps/jotai.ts"
import { useSetAtom } from "./_deps/jotai.ts"
import styled from "./_deps/styled.ts"
import { pointsAtom } from "./root.tsx"

const incrementAtom = atom(null, (get, set, by: number = 1) => {
  set(pointsAtom, points => {
    if (points === undefined) throw new Error("cannot increment, data hasnt loaded")
    return points + by
  })
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
    increment(by)
  }, [network, increment])

  return <ClickButton onClick={onClick} type="button" />
}
