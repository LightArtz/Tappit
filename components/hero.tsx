"use client"

import { useState, useEffect } from "react"

interface HeroProps {
  onOrderClick: () => void
}

export default function Hero({ onOrderClick }: HeroProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const startAnimation = () => {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        // Restart after 3 seconds
        setTimeout(startAnimation, 3000)
      }, 1500)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(startAnimation, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 left-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                ✨ The Future of Connection
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-balance leading-tight">
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Connect Instantly
              </span>
              <br />
              <span className="text-gray-900">with Tappit</span>
            </h1>

            <p className="text-xl text-gray-600 text-balance leading-relaxed">
              Share your contact, socials, and links with a single tap. No apps, no friction, just pure connection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onOrderClick}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition transform hover:scale-105"
              >
                Order Now
              </button>
            </div>

            <div className="flex gap-8 pt-8 text-sm text-gray-600">
              <div>
                <div className="font-bold text-gray-900">100%</div>
                <div>NFC Enabled</div>
              </div>
              <div>
                <div className="font-bold text-gray-900">4</div>
                <div>Design Options</div>
              </div>
              <div>
                <div className="font-bold text-gray-900">24/7</div>
                <div>Support</div>
              </div>
            </div>
          </div>

          {/* Right Visual - Tap Animation */}
          <div className="relative h-96 md:h-full flex items-center justify-center px-4 sm:px-0">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              {/* Phone */}
              <div
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-56 bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl border-4 border-gray-800 flex items-center justify-center transition-all duration-700 ${
                  isAnimating ? "translate-x-12 opacity-50" : "translate-x-0 opacity-100"
                }`}
              >
                <div className="w-28 h-52 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📱</div>
                    <div className="text-xs font-bold text-gray-600">Phone</div>
                  </div>
                </div>
              </div>

              {/* Tappit Keychain - Logo only */}
              <div
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-700 ${
                  isAnimating ? "-translate-x-12 opacity-50" : "translate-x-0 opacity-100"
                }`}
              >
                <div className="text-center">
                  {/* Tappit Logo - Cyan circle with yellow dot */}
                  <div className="w-16 h-16 bg-cyan-300 rounded-full flex items-center justify-center relative">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full absolute top-2 right-2"></div>
                  </div>
                </div>
              </div>

              {/* Connected state */}
              {isAnimating && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse">
                    <div className="text-center">
                      <div className="text-5xl mb-3">✨</div>
                      <div className="text-xl font-bold text-cyan-600">Connected!</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
