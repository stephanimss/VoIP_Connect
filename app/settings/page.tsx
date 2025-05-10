"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Bell,
  Volume2,
  Monitor,
  Moon,
  Sun,
  Globe,
  Lock,
  Mic,
  Video,
  Headphones,
  Shield,
  BellOff,
  Smartphone,
  Vibrate,
} from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface UserSettings {
  notifications: {
    incomingCalls: boolean
    missedCalls: boolean
    systemUpdates: boolean
    vibration: boolean
    sound: boolean
  }
  appearance: {
    theme: "light" | "dark" | "system"
    fontSize: string
    language: string
  }
  privacy: {
    showStatus: boolean
    readReceipts: boolean
    callHistory: boolean
    twoFactorAuth: boolean
  }
  audio: {
    inputDevice: string
    outputDevice: string
    volume: number
    noiseReduction: boolean
    echoCancellation: boolean
  }
  video: {
    camera: string
    quality: string
    backgroundBlur: boolean
    mirrorVideo: boolean
  }
}

export default function SettingsPage() {
  const [user, setUser] = useState<{ phoneNumber: string } | null>(null)
  const router = useRouter()

  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      incomingCalls: true,
      missedCalls: true,
      systemUpdates: false,
      vibration: true,
      sound: true,
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      language: "english",
    },
    privacy: {
      showStatus: true,
      readReceipts: true,
      callHistory: true,
      twoFactorAuth: false,
    },
    audio: {
      inputDevice: "default",
      outputDevice: "default",
      volume: 80,
      noiseReduction: true,
      echoCancellation: true,
    },
    video: {
      camera: "default",
      quality: "auto",
      backgroundBlur: false,
      mirrorVideo: true,
    },
  })

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(storedUser))

    // In a real app, you would fetch user settings from an API
    // For demo purposes, we'll check if there are saved settings in localStorage
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [router])

  const handleToggle = (category: keyof UserSettings, setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))
  }

  const handleSelectChange = (category: keyof UserSettings, setting: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }))
  }

  const handleSliderChange = (category: keyof UserSettings, setting: string, value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value[0],
      },
    }))
  }

  const saveSettings = () => {
    // In a real app, you would send this data to your API
    // For demo purposes, we'll save to localStorage
    localStorage.setItem("userSettings", JSON.stringify(settings))

    // Show success message
    alert("Settings saved successfully!")
  }

  if (!user) {
    return null // Or a loading spinner
  }

  return (
    <MainLayout user={user}>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button onClick={() => {}}>Save All Settings</Button>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="incoming-calls">Incoming Calls</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for incoming calls</p>
                    </div>
                    <Switch
                      id="incoming-calls"
                      checked={settings.notifications.incomingCalls}
                      onCheckedChange={(value) => handleToggle("notifications", "incomingCalls", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="missed-calls">Missed Calls</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for missed calls</p>
                    </div>
                    <Switch
                      id="missed-calls"
                      checked={settings.notifications.missedCalls}
                      onCheckedChange={(value) => handleToggle("notifications", "missedCalls", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="system-updates">System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and new features
                      </p>
                    </div>
                    <Switch
                      id="system-updates"
                      checked={settings.notifications.systemUpdates}
                      onCheckedChange={(value) => handleToggle("notifications", "systemUpdates", value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Alert Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Vibrate className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="vibration">Vibration</Label>
                      </div>
                      <Switch
                        id="vibration"
                        checked={settings.notifications.vibration}
                        onCheckedChange={(value) => handleToggle("notifications", "vibration", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-5 w-5 text-muted-foreground" />
                        <Label htmlFor="sound">Sound</Label>
                      </div>
                      <Switch
                        id="sound"
                        checked={settings.notifications.sound}
                        onCheckedChange={(value) => handleToggle("notifications", "sound", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="mr-2 h-5 w-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <RadioGroup
                      value={settings.appearance.theme}
                      onValueChange={(value) =>
                        handleSelectChange("appearance", "theme", value as "light" | "dark" | "system")
                      }
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex items-center">
                          <Sun className="h-4 w-4 mr-1" /> Light
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex items-center">
                          <Moon className="h-4 w-4 mr-1" /> Dark
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex items-center">
                          <Monitor className="h-4 w-4 mr-1" /> System
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="font-size">Font Size</Label>
                    <Select
                      value={settings.appearance.fontSize}
                      onValueChange={(value) => handleSelectChange("appearance", "fontSize", value)}
                    >
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.appearance.language}
                      onValueChange={(value) => handleSelectChange("appearance", "language", value)}
                    >
                      <SelectTrigger id="language" className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="japanese">Japanese</SelectItem>
                        <SelectItem value="korean">Korean</SelectItem>
                        <SelectItem value="arabic">Arabic</SelectItem>
                        <SelectItem value="russian">Russian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Manage your privacy and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-status">Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see when you're online</p>
                    </div>
                    <Switch
                      id="show-status"
                      checked={settings.privacy.showStatus}
                      onCheckedChange={(value) => handleToggle("privacy", "showStatus", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="read-receipts">Read Receipts</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see when you've read their messages
                      </p>
                    </div>
                    <Switch
                      id="read-receipts"
                      checked={settings.privacy.readReceipts}
                      onCheckedChange={(value) => handleToggle("privacy", "readReceipts", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="call-history">Call History</Label>
                      <p className="text-sm text-muted-foreground">Save your call history</p>
                    </div>
                    <Switch
                      id="call-history"
                      checked={settings.privacy.callHistory}
                      onCheckedChange={(value) => handleToggle("privacy", "callHistory", value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      id="two-factor"
                      checked={settings.privacy.twoFactorAuth}
                      onCheckedChange={(value) => handleToggle("privacy", "twoFactorAuth", value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Security Actions</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="mr-2 h-4 w-4" />
                      Manage Devices
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500">
                      <BellOff className="mr-2 h-4 w-4" />
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Settings */}
          <TabsContent value="audio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Headphones className="mr-2 h-5 w-5" />
                  Audio Settings
                </CardTitle>
                <CardDescription>Configure your audio devices and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="input-device">Microphone</Label>
                    <Select
                      value={settings.audio.inputDevice}
                      onValueChange={(value) => handleSelectChange("audio", "inputDevice", value)}
                    >
                      <SelectTrigger id="input-device" className="flex items-center">
                        <Mic className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select microphone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Microphone</SelectItem>
                        <SelectItem value="built-in">Built-in Microphone</SelectItem>
                        <SelectItem value="headset">Headset Microphone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="output-device">Speaker</Label>
                    <Select
                      value={settings.audio.outputDevice}
                      onValueChange={(value) => handleSelectChange("audio", "outputDevice", value)}
                    >
                      <SelectTrigger id="output-device" className="flex items-center">
                        <Volume2 className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Speaker</SelectItem>
                        <SelectItem value="built-in">Built-in Speaker</SelectItem>
                        <SelectItem value="headphones">Headphones</SelectItem>
                        <SelectItem value="bluetooth">Bluetooth Speaker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="volume-slider">Volume</Label>
                      <span className="text-sm text-muted-foreground">{settings.audio.volume}%</span>
                    </div>
                    <Slider
                      id="volume-slider"
                      min={0}
                      max={100}
                      step={1}
                      value={[settings.audio.volume]}
                      onValueChange={(value) => handleSliderChange("audio", "volume", value)}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Audio Enhancement</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="noise-reduction">Noise Reduction</Label>
                          <p className="text-sm text-muted-foreground">Reduce background noise during calls</p>
                        </div>
                        <Switch
                          id="noise-reduction"
                          checked={settings.audio.noiseReduction}
                          onCheckedChange={(value) => handleToggle("audio", "noiseReduction", value)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="echo-cancellation">Echo Cancellation</Label>
                          <p className="text-sm text-muted-foreground">Prevent echo during calls</p>
                        </div>
                        <Switch
                          id="echo-cancellation"
                          checked={settings.audio.echoCancellation}
                          onCheckedChange={(value) => handleToggle("audio", "echoCancellation", value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Settings */}
          <TabsContent value="video">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="mr-2 h-5 w-5" />
                  Video Settings
                </CardTitle>
                <CardDescription>Configure your camera and video preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="camera">Camera</Label>
                    <Select
                      value={settings.video.camera}
                      onValueChange={(value) => handleSelectChange("video", "camera", value)}
                    >
                      <SelectTrigger id="camera" className="flex items-center">
                        <Video className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select camera" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default Camera</SelectItem>
                        <SelectItem value="front">Front Camera</SelectItem>
                        <SelectItem value="rear">Rear Camera</SelectItem>
                        <SelectItem value="external">External Webcam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-quality">Video Quality</Label>
                    <Select
                      value={settings.video.quality}
                      onValueChange={(value) => handleSelectChange("video", "quality", value)}
                    >
                      <SelectTrigger id="video-quality">
                        <SelectValue placeholder="Select video quality" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (360p)</SelectItem>
                        <SelectItem value="medium">Medium (480p)</SelectItem>
                        <SelectItem value="high">High (720p)</SelectItem>
                        <SelectItem value="hd">HD (1080p)</SelectItem>
                        <SelectItem value="auto">Auto (Adaptive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Video Enhancement</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="background-blur">Background Blur</Label>
                          <p className="text-sm text-muted-foreground">Blur your background during video calls</p>
                        </div>
                        <Switch
                          id="background-blur"
                          checked={settings.video.backgroundBlur}
                          onCheckedChange={(value) => handleToggle("video", "backgroundBlur", value)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="mirror-video">Mirror Video</Label>
                          <p className="text-sm text-muted-foreground">Mirror your video preview</p>
                        </div>
                        <Switch
                          id="mirror-video"
                          checked={settings.video.mirrorVideo}
                          onCheckedChange={(value) => handleToggle("video", "mirrorVideo", value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-4">Video Preview</h3>
                    <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                      <p className="text-muted-foreground">Camera preview would appear here</p>
                    </div>
                    <div className="flex justify-center mt-4">
                      <Button variant="outline" size="sm">
                        Test Camera
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
