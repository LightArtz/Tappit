"use client"

import { useEffect, useState } from "react"

const steps = [
  {
    number: "1",
    title: "Choose Your Design",
    description: "Pick from 4 stunning Tappit designs that match your style.",
  },
  {
    number: "2",
    title: "Pre-Order",
    description: "Fill out your details and secure your Tappit with a pre-order.",
  },
  {
    number: "3",
    title: "Pick Up at Campus",
    description: "Grab your Tappit at our booth during campus hours.",
  },
  {
    number: "4",
    title: "Tap & Share",
    description: "Start connecting instantly with your new Tappit keychain.",
  },
]

export default function HowItWorks() {
  const [lineWidth, setLineWidth] = useState(0)

  useEffect(() => {
    // Animate line from left to right
    const timer = setTimeout(() => {
      setLineWidth(100)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="how-it-works" className="py-20 px-6 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">How It Works</h2>
          <p className="text-xl text-gray-600 text-balance">Four simple steps to get your Tappit</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%+2rem)] h-1 bg-gray-300">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-1000 ease-out"
                    style={{ width: `${lineWidth}%` }}
                  ></div>
                </div>
              )}

              <div className="relative">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{step.number}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
