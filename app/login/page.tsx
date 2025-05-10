"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone } from "lucide-react"
import { MainLayout } from "@/components/main-layout"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication with the Kamailio server
    // In a real implementation, this would make an API call to authenticate
    setTimeout(() => {
      setIsLoading(false)
      // Store user info in localStorage or a state management solution
      localStorage.setItem("user", JSON.stringify({ phoneNumber }))
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <MainLayout showNavigation={false}>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-sky-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-sky-100">
                <Phone className="w-8 h-8 text-sky-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Login with your registered phone number</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-sky-600 hover:bg-sky-700" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
            <p>Enter your phone number registered with the VoIP server</p>
            <p>
              Don't have an account?{" "}
              <Link href="/register" className="text-sky-600 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  )
}
