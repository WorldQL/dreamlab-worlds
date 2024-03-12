import type { FC } from "https://esm.sh/react@18.2.0"
import { useEffect, useState } from "https://esm.sh/react@18.2.0"
import { events } from "../events.ts"

export const MessageScreen: FC = () => {
  const [currentMessage, setCurrentMessage] = useState<string | undefined>(undefined)

  useEffect(() => {
    const msgListener = (message: string | undefined) => {
      setCurrentMessage(message)
    }

    events.addListener("onMessageTrigger", msgListener)

    return () => {
      events.removeListener("onMessageTrigger", msgListener)
    }
  }, [])

  if (!currentMessage) return null

  return (
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#8B4513",
        border: "4px solid #D2691E",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "400px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#FFF8DC",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)"
      }}
    >
      <p
        style={{
          margin: 0,
          lineHeight: 1.5
        }}
      >
        {currentMessage}
      </p>
    </div>
  )
}
