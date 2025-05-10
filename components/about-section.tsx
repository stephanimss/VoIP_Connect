import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Info, Server } from "lucide-react"

interface AboutSectionProps {
  phoneNumber: string
}

export function AboutSection({ phoneNumber }: AboutSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Info className="mr-2 h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone Number:</span>
              <span className="font-medium">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Type:</span>
              <span className="font-medium">Standard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="mr-2 h-5 w-5" />
            About VoIP Connect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            VoIP Connect is a web-based application that allows you to make voice and video calls using Voice over
            Internet Protocol technology.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Protocol:</span>
              <span className="font-medium">UDP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Server className="mr-2 h-5 w-5" />
            Server Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This application connects to a Kamailio VoIP server for handling call routing and authentication.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server Type:</span>
              <span className="font-medium">Kamailio SIP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Connection:</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
