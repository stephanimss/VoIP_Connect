"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Phone, Video, X } from "lucide-react"

export function DialPad() {
  const [number, setNumber] = useState("")
  const router = useRouter()

  const handleKeyPress = (key: string) => {
    setNumber((prev) => prev + key)
  }

  const handleDelete = () => {
    setNumber((prev) => prev.slice(0, -1))
  }

  const handleCall = (type: "voice" | "video") => {
    if (number.trim()) {
      router.push(`/call/${type}/${number}`)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <Input
            type="tel"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="text-center text-2xl h-14"
            placeholder="Enter phone number"
          />

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-14 text-xl"
                onClick={() => handleKeyPress(key.toString())}
              >
                {key}
                {key === 0 && <span className="text-xs ml-1">+</span>}
              </Button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              size="icon"
              className="h-14 w-14 rounded-full"
              onClick={handleDelete}
              disabled={!number}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
              onClick={() => handleCall("voice")}
              disabled={!number}
            >
              <Phone className="h-6 w-6" />
            </Button>

            <Button
              className="h-14 w-14 rounded-full bg-sky-600 hover:bg-sky-700"
              onClick={() => handleCall("video")}
              disabled={!number}
            >
              <Video className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
