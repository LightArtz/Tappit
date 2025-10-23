"use client"

import { Mail, Phone, MapPin, Instagram } from "lucide-react"
import type React from "react"

interface FooterProps {
  onOrderClick: () => void
}

export default function Footer({ onOrderClick }: FooterProps) {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold">Tappit</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The future of connection. Share who you are with a single tap.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#benefits" onClick={(e) => handleSmoothScroll(e, "benefits")} className="hover:text-white transition cursor-pointer">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="hover:text-white transition cursor-pointer">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#designs" onClick={(e) => handleSmoothScroll(e, "designs")} className="hover:text-white transition cursor-pointer">
                  Designs
                </a>
              </li>
              <li>
                <button onClick={onOrderClick} className="hover:text-white transition text-left w-full cursor-pointer"> {/* Added text-left, w-full, cursor-pointer */}
                  Order
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Instagram size={16} />
                <a href="https://instagram.com/tappit.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition"> {/* Replace with your actual Instagram link */}
                  @tappit.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:hello@tappit.com" className="hover:text-white transition">
                  hello@tappit.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>&copy; 2025 Tappit. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
