"use client"

import { useEffect, useState } from "react"
import SIP from "sip.js"

interface SipClientProps {
  phoneNumber?: string
  password?: string
}

export function SipClient({ phoneNumber = "1001", password = "password123" }: SipClientProps) {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected" | "failed">("disconnected")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Konfigurasi SIP.js
    const uri = `sip:${phoneNumber}@localhost` // Nomor telepon dan domain Kamailio
    const wsServer = "ws://localhost:5060/ws" // WebSocket Kamailio (gunakan ws://)

    const configuration = {
      uri: uri, // User ID dari props
      transportOptions: {
        wsServers: [wsServer],
        traceSip: true,
      },
      authorizationUser: phoneNumber, // Pengguna untuk autentikasi
      password: password, // Password yang sesuai dengan pengguna
    }

    setStatus("connecting")
    console.log("Initializing SIP connection with:", { uri, phoneNumber })

    try {
      const userAgent = new SIP.UA(configuration)
      userAgent.start()

      // Register ke Kamailio
      userAgent.register()

      // Event listener untuk status registrasi
      userAgent.on("registered", () => {
        console.log("Successfully registered with Kamailio")
        setStatus("connected")
        setErrorMessage(null)
      })

      userAgent.on("registrationFailed", (error) => {
        console.error("Registration failed: ", error)
        setStatus("failed")
        setErrorMessage(`Registration failed: ${error.cause || "Unknown error"}`)
      })

      userAgent.on("unregistered", () => {
        console.log("Unregistered from Kamailio")
        setStatus("disconnected")
      })

      userAgent.on("transportError", () => {
        console.error("Transport error - could not connect to Kamailio")
        setStatus("failed")
        setErrorMessage("Could not connect to Kamailio server. Please check server status.")
      })

      return () => {
        console.log("Stopping SIP connection")
        userAgent.stop()
      }
    } catch (error) {
      console.error("Error initializing SIP client:", error)
      setStatus("failed")
      setErrorMessage(`Error initializing SIP client: ${error instanceof Error ? error.message : "Unknown error"}`)
      return () => {}
    }
  }, [phoneNumber, password])

  // This component doesn't render anything visible by default
  // But we can show connection status for debugging purposes
  return (
    <div className="hidden">
      {/* Hidden in production, but useful for debugging */}
      <div data-sip-status={status}>SIP Client Status: {status}</div>
      {errorMessage && <div data-sip-error>{errorMessage}</div>}
    </div>
  )
}
