"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

interface NavbarProps {
  onOrderClick: () => void
}

export default function Navbar({ onOrderClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-lg" : "bg-white/80"
      } backdrop-blur-md border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Tappit
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#benefits"
              onClick={(e) => handleSmoothScroll(e, "benefits")}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "how-it-works")}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              How It Works
            </a>
            <a
              href="#designs"
              onClick={(e) => handleSmoothScroll(e, "designs")}
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Designs
            </a>
            <button
              onClick={onOrderClick}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition transform hover:scale-105 cursor-pointer"
            >
              Order Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-in fade-in slide-in-from-top-2">
            <a
              href="#benefits"
              onClick={(e) => handleSmoothScroll(e, "benefits")}
              className="block text-gray-600 hover:text-gray-900"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "how-it-works")}
              className="block text-gray-600 hover:text-gray-900"
            >
              How It Works
            </a>
            <a
              href="#designs"
              onClick={(e) => handleSmoothScroll(e, "designs")}
              className="block text-gray-600 hover:text-gray-900"
            >
              Designs
            </a>
            <button
              onClick={() => {
                onOrderClick()
                setIsOpen(false)
              }}
              className="w-full px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold"
            >
              Order Now
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
