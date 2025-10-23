"use client"

import { Zap, Shield, Users, Smartphone } from "lucide-react"

const benefits = [
  {
    icon: Zap,
    title: "Instant Sharing",
    description: "Share your contact, socials, and links with a single tap. No typing, no friction.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data stays encrypted. Control exactly what you share with each tap.",
  },
  {
    icon: Users,
    title: "Works Everywhere",
    description: "Compatible with any NFC-enabled phone. No app download required.",
  },
  {
    icon: Smartphone,
    title: "Always Updated",
    description: "Change your info anytime. Your Tappit always has the latest details.",
  },
]

export default function Benefits() {
  return (
    <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Why Choose Tappit?</h2>
          <p className="text-xl text-gray-600 text-balance">The smarter way to share who you are</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div
                key={index}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg transition transform hover:scale-105 duration-300 border border-gray-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
