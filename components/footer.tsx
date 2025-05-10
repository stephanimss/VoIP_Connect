import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-sky-100 p-1.5 rounded-full">
                <Phone className="h-5 w-5 text-sky-600" />
              </div>
              <span className="text-xl font-bold">VoIP Connect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A modern VoIP solution for voice and video calls using Kamailio server technology.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-sky-600 transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-sky-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=history"
                  className="text-sm text-muted-foreground hover:text-sky-600 transition-colors"
                >
                  Call History
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=about"
                  className="text-sm text-muted-foreground hover:text-sky-600 transition-colors"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-sky-600 transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-sky-600 mr-2 mt-0.5" />
                <span className="text-sm text-muted-foreground">123 VoIP Street, Tech City, 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-sky-600 mr-2" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-sky-600 mr-2" />
                <span className="text-sm text-muted-foreground">support@voipconnect.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {currentYear} VoIP Connect. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-sky-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-sky-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-sky-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
