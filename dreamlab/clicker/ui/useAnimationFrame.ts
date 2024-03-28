import { useCallback, useEffect, useRef } from "react"

export const useAnimationFrame = (
  cb: (arg: { time: number; delta: number }) => Promise<void> | void
) => {
  const frame = useRef<number>()
  const last = useRef(performance.now())
  const init = useRef(performance.now())

  const animate = useCallback(async () => {
    const now = performance.now()
    const time = (now - init.current) / 1_000
    const delta = (now - last.current) / 1_000

    await cb({ time, delta })

    last.current = now
    frame.current = requestAnimationFrame(animate)
  }, [cb])

  useEffect(() => {
    frame.current = requestAnimationFrame(animate)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [animate])
}
