import type { ReactNode } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SipClient } from "@/components/sip-client"

interface MainLayoutProps {
  children: ReactNode
  showNavigation?: boolean
  user?: { phoneNumber: string } | null
}

export function MainLayout({ children, showNavigation = true, user = null }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {showNavigation && <Navigation />}
      <main className="flex-1">{children}</main>
      {showNavigation && <Footer />}

      {/* Initialize SIP client only for authenticated users */}
      {user && <SipClient phoneNumber={user.phoneNumber} password="password123" />}
    </div>
  )
}
