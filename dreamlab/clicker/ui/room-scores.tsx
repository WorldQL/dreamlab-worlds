import type { NetClient } from "@dreamlab.gg/core/network"
import { useNetwork } from "@dreamlab.gg/ui/react"
import { useCallback, useEffect, useState } from "react"
import { SYNC_HIGH_SCORES_CHANNEL, SyncHighScoresToClientSchema } from "../network.ts"
import styled from "./_deps/styled.ts"

const Container = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  text-align: right;
  margin: 0.5rem;
`

const Title = styled.h2`
  margin: 0;
  margin-bottom: 0.2rem;
`

const Scores = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.2rem;
`

export const RoomScores = () => {
  const network: NetClient = useNetwork()
  const [scores, setScores] = useState<{ id: string; name: string; points: number }[]>([])

  // When we recieve new high score data, validate the packet and write to local state
  const onHighScores = useCallback(
    (_: string, payload: unknown) => {
      const resp = SyncHighScoresToClientSchema.safeParse(payload)
      if (!resp.success) return
      const data = resp.data

      setScores(data.scores)
    },
    [setScores]
  )

  // Listen to custom network packets for high scores
  useEffect(() => {
    network.addCustomMessageListener(SYNC_HIGH_SCORES_CHANNEL, onHighScores)

    return () => {
      network.removeCustomMessageListener(SYNC_HIGH_SCORES_CHANNEL, onHighScores)
    }
  }, [network, onHighScores])

  return (
    <Container>
      <Title>High Scores</Title>

      <Scores>
        {/* TODO: Mark self as bold */}
        {scores.map(({ id, name, points }, idx) => (
          <Score key={id} idx={idx} name={name} points={points} />
        ))}
      </Scores>
    </Container>
  )
}

const ScoreItem = styled.p`
  margin: 0;
`

const Score = ({ idx, name, points }: { idx: number; name: string; points: number }) => (
  <>
    <ScoreItem>#{(idx + 1).toLocaleString()}</ScoreItem>
    <ScoreItem>{name}</ScoreItem>
    <ScoreItem>{points.toLocaleString()}</ScoreItem>
  </>
)
