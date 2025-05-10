"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainLayout } from "@/components/main-layout"
import { DialPad } from "@/components/dial-pad"
import { CallHistory } from "@/components/call-history"
import { AboutSection } from "@/components/about-section"

export default function DashboardPage() {
  const [user, setUser] = useState<{ phoneNumber: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))
  }, [router])

  if (!user) {
    return null // Or a loading spinner
  }

  // Set the default tab or use the one from URL parameters
  const defaultTab = tabParam === "history" || tabParam === "about" ? tabParam : "dialpad"

  return (
    <MainLayout user={user}>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dialpad">Dial Pad</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="dialpad" className="mt-4">
            <DialPad />
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <CallHistory />
          </TabsContent>
          <TabsContent value="about" className="mt-4">
            <AboutSection phoneNumber={user.phoneNumber} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
