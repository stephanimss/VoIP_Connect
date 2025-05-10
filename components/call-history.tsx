"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Video, ArrowUpRight, ArrowDownLeft, PhoneIcon as PhoneX } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"

interface CallRecord {
  id: number
  number: string
  type: string
  status: string
  duration: number
  timestamp: string
}

export function CallHistory() {
  const [history, setHistory] = useState<CallRecord[]>([])
  const router = useRouter()

  useEffect(() => {
    const storedHistory = localStorage.getItem("callHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getCallIcon = (type: string) => {
    return type.toLowerCase().includes("video") ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />
  }

  const getStatusIcon = (status: string) => {
    if (status === "missed") {
      return <PhoneX className="h-4 w-4 text-red-500" />
    } else if (status === "incoming") {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />
    } else {
      return <ArrowUpRight className="h-4 w-4 text-blue-500" />
    }
  }

  const handleCall = (number: string, type: string) => {
    const callType = type.toLowerCase().includes("video") ? "video" : "voice"
    router.push(`/call/${callType}/${number}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No call history yet</div>
        ) : (
          <div className="space-y-4">
            {history.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gray-100">{getCallIcon(call.type)}</div>
                  <div>
                    <div className="font-medium">{call.number}</div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      {getStatusIcon(call.status)}
                      <span className="ml-1">{formatDistanceToNow(new Date(call.timestamp))}</span>
                      {call.duration > 0 && <span className="ml-2">• {formatDuration(call.duration)}</span>}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full h-8 w-8 p-0"
                  onClick={() => handleCall(call.number, call.type)}
                >
                  {getCallIcon(call.type)}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
