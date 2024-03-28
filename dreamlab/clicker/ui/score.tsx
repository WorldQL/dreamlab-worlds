import { useAtomValue } from "./_deps/jotai.ts"
import styled from "./_deps/styled.ts"
import { pointsAtom, perSecondAtom } from "./root.tsx"

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 1rem;

  text-align: center;
`

const Points = styled.p`
  font-size: 4rem;
  font-weight: bold;
  margin: 0;

  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

const PerSecond = styled(Points)`
  font-size: 2rem;
`

export const Score = () => {
  const points = useAtomValue(pointsAtom)
  const perSecond = useAtomValue(perSecondAtom)

  return (
    <Container>
      <Points>Points: {points!.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Points>
      <PerSecond>Points / Second: {perSecond.toLocaleString()}</PerSecond>
    </Container>
  )
}
