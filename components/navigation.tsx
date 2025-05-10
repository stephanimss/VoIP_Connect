"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Phone, LogOut, Menu, Home, User, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navigation() {
  const [user, setUser] = useState<{ phoneNumber: string } | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Profile", href: "/profile", icon: <User className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
  ]

  const isActive = (path: string) => {
    if (path.includes("?")) {
      const basePath = path.split("?")[0]
      const params = new URLSearchParams(path.split("?")[1])
      const tab = params.get("tab")

      if (pathname === basePath && tab) {
        return pathname.includes(basePath) && window.location.search.includes(`tab=${tab}`)
      }
    }
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2 mr-6">
            <div className="bg-sky-100 p-1.5 rounded-full">
              <Phone className="h-5 w-5 text-sky-600" />
            </div>
            <span className="text-xl font-bold">VoIP Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href) ? "bg-sky-50 text-sky-700" : "text-gray-600 hover:text-sky-700 hover:bg-sky-50"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            {/* User Menu (Desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-sky-100">
                      <AvatarFallback className="bg-sky-100 text-sky-700">
                        {user.phoneNumber.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.phoneNumber}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center" onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center" onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center text-red-500" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between py-4 border-b">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-10 w-10 border border-sky-100">
                          <AvatarFallback className="bg-sky-100 text-sky-700">
                            {user.phoneNumber.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.phoneNumber}</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                    </div>
                    <nav className="flex-1 py-4">
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                              isActive(item.href)
                                ? "bg-sky-50 text-sky-700"
                                : "text-gray-600 hover:text-sky-700 hover:bg-sky-50"
                            }`}
                          >
                            <span className="mr-3">{item.icon}</span>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </nav>
                    <div className="border-t py-4">
                      <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
