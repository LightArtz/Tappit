"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Benefits from "@/components/benefits"
import HowItWorks from "@/components/how-it-works"
import DesignOptions from "@/components/design-options"
import Testimonials from "@/components/testimonials"
import OrderModal from "@/components/order-modal"
import Footer from "@/components/footer"
import ScrollAnimationWrapper from "@/components/scroll-animation-wrapper"

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      <Navbar onOrderClick={() => setIsOrderModalOpen(true)} />
      <ScrollAnimationWrapper>
        <Hero onOrderClick={() => setIsOrderModalOpen(true)} />
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <div id="benefits">
          <Benefits />
        </div>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <div id="how-it-works">
          <HowItWorks />
        </div>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <div id="designs">
          <DesignOptions />
        </div>
      </ScrollAnimationWrapper>
      <ScrollAnimationWrapper>
        <Testimonials />
      </ScrollAnimationWrapper>
      <OrderModal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
      <Footer onOrderClick={() => setIsOrderModalOpen(true)} />
    </main>
  )
}
