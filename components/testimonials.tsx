"use client"

const testimonials = [
  {
    name: "Alex Chen",
    role: "Entrepreneur",
    content: "Tappit has completely changed how I network. No more fumbling for business cards!",
    avatar: "👨‍💼",
  },
  {
    name: "Jordan Smith",
    role: "Creative Director",
    content: "The design is sleek, the functionality is flawless. Absolutely love it.",
    avatar: "👩‍🎨",
  },
  {
    name: "Casey Williams",
    role: "Tech Enthusiast",
    content: "Finally, a product that actually works as advertised. Highly recommend!",
    avatar: "👨‍💻",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Loved by Users</h2>
          <p className="text-xl text-gray-600 text-balance">See what people are saying about Tappit</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-8 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{testimonial.avatar}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
