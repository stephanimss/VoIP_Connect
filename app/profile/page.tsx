"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Clock, PhoneCall, Video } from "lucide-react"

interface UserProfile {
  phoneNumber: string
  name?: string
  email?: string
  address?: string
  bio?: string
  joinDate?: string
  avatarUrl?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserProfile>({
    phoneNumber: "",
    name: "",
    email: "",
    address: "",
    bio: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    // Get user profile data
    const userData = JSON.parse(storedUser) as UserProfile

    // In a real app, you would fetch the complete profile from an API
    // For demo purposes, we'll add some mock data
    const enhancedUserData = {
      ...userData,
      name: userData.name || "John Doe",
      email: userData.email || "john.doe@example.com",
      address: userData.address || "123 Main St, City, Country",
      bio: userData.bio || "VoIP enthusiast and technology professional.",
      joinDate: userData.joinDate || "2023-01-15",
    }

    setUser(enhancedUserData)
    setFormData(enhancedUserData)
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = () => {
    // In a real app, you would send this data to your API
    setUser(formData)

    // Update local storage for demo purposes
    localStorage.setItem("user", JSON.stringify(formData))

    setIsEditing(false)
  }

  const callStats = {
    totalCalls: 42,
    totalDuration: "12h 34m",
    voiceCalls: 28,
    videoCalls: 14,
    avgDuration: "18m",
    lastCall: "2 hours ago",
  }

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <MainLayout user={user}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-1">
                <CardHeader className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-sky-100 text-sky-700 text-xl">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || user.phoneNumber.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>VoIP User</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone Number</p>
                        <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{user.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Member Since</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.joinDate || "").toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>

              {/* Bio and Stats */}
              <div className="md:col-span-2 space-y-6">
                {/* Bio */}
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{user.bio}</p>
                  </CardContent>
                </Card>

                {/* Call Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Call Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-sky-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <PhoneCall className="h-5 w-5 text-sky-600 mr-2" />
                          <span className="text-sm font-medium">Total Calls</span>
                        </div>
                        <p className="text-2xl font-bold text-sky-700">{callStats.totalCalls}</p>
                      </div>

                      <div className="bg-sky-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-sky-600 mr-2" />
                          <span className="text-sm font-medium">Total Duration</span>
                        </div>
                        <p className="text-2xl font-bold text-sky-700">{callStats.totalDuration}</p>
                      </div>

                      <div className="bg-sky-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Phone className="h-5 w-5 text-sky-600 mr-2" />
                          <span className="text-sm font-medium">Voice Calls</span>
                        </div>
                        <p className="text-2xl font-bold text-sky-700">{callStats.voiceCalls}</p>
                      </div>

                      <div className="bg-sky-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Video className="h-5 w-5 text-sky-600 mr-2" />
                          <span className="text-sm font-medium">Video Calls</span>
                        </div>
                        <p className="text-2xl font-bold text-sky-700">{callStats.videoCalls}</p>
                      </div>

                      <div className="bg-sky-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-sky-600 mr-2" />
                          <span className="text-sm font-medium">Avg. Duration</span>
                        </div>
                        <p className="text-2xl font-bold text-sky-700">{callStats.avgDuration}</p>
                      </div>

                      <div className="bg-sky-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-5 w-5 text-sky-600 mr-2" />
                          <span className="text-sm font-medium">Last Call</span>
                        </div>
                        <p className="text-lg font-bold text-sky-700">{callStats.lastCall}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Active
                      </Badge>
                      <Badge variant="outline" className="bg-sky-50 text-sky-700 hover:bg-sky-50">
                        Verified
                      </Badge>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                        Standard Plan
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
                <CardDescription>Update your profile details below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-sky-100 text-sky-700 text-xl">
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || user.phoneNumber.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="pl-10"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
