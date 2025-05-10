"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, User } from "lucide-react"
import { MainLayout } from "@/components/main-layout"

interface CallPageProps {
  params: {
    type: string
    number: string
  }
}

type CallStatus = "calling" | "ringing" | "in-call" | "ended"

export default function CallPage({ params }: CallPageProps) {
  const { type, number } = params
  const router = useRouter()
  const [status, setStatus] = useState<CallStatus>("calling")
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(type !== "video")

  // Simulate call flow
  useEffect(() => {
    const callingTimeout = setTimeout(() => {
      setStatus("ringing")
    }, 2000)

    const ringingTimeout = setTimeout(() => {
      setStatus("in-call")
      startTimer()
    }, 5000)

    return () => {
      clearTimeout(callingTimeout)
      clearTimeout(ringingTimeout)
    }
  }, [])

  const startTimer = () => {
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const endCall = () => {
    setStatus("ended")

    // Save call to history
    const callHistory = JSON.parse(localStorage.getItem("callHistory") || "[]")
    const newCall = {
      id: Date.now(),
      number,
      type: type === "video" ? "Video Call" : "Voice Call",
      status: "ended",
      duration,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("callHistory", JSON.stringify([newCall, ...callHistory]))

    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <MainLayout showNavigation={false}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-sky-100">
              <AvatarFallback className="bg-sky-200 text-sky-700 text-2xl">
                <User />
              </AvatarFallback>
            </Avatar>

            <div className="text-center">
              <h2 className="text-2xl font-bold">{number}</h2>
              <p className="text-muted-foreground">{type === "video" ? "Video Call" : "Voice Call"}</p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-sky-600 uppercase">
                {status === "calling" && "Calling..."}
                {status === "ringing" && "Ringing..."}
                {status === "in-call" && "In Call"}
                {status === "ended" && "Call Ended"}
              </p>
              {status === "in-call" && <p className="text-muted-foreground">{formatDuration(duration)}</p>}
            </div>
          </div>

          {type === "video" && status === "in-call" && !isVideoOff && (
            <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Video stream placeholder
              </div>
              <div className="absolute bottom-2 right-2 w-24 h-32 bg-gray-300 rounded border-2 border-white">
                <div className="flex items-center justify-center h-full text-xs text-gray-500">Your camera</div>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-4">
            {status === "in-call" && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full p-3 ${isMuted ? "bg-red-100 text-red-600" : "bg-gray-100"}`}
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                {type === "video" && (
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full p-3 ${isVideoOff ? "bg-red-100 text-red-600" : "bg-gray-100"}`}
                    onClick={() => setIsVideoOff(!isVideoOff)}
                  >
                    {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                  </Button>
                )}
              </>
            )}

            <Button
              variant={status === "ended" ? "outline" : "destructive"}
              size="icon"
              className="rounded-full p-3 h-14 w-14"
              onClick={endCall}
              disabled={status === "ended"}
            >
              {status === "ended" ? <Phone className="h-6 w-6" /> : <PhoneOff className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
