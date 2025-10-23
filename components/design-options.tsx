"use client"

const designs = [
  {
    name: "Classic Cyan",
    colors: "from-cyan-400 to-cyan-500",
    accent: "bg-yellow-400",
  },
  {
    name: "Ocean Blue",
    colors: "from-blue-400 to-blue-600",
    accent: "bg-purple-400",
  },
  {
    name: "Purple Dream",
    colors: "from-purple-400 to-purple-600",
    accent: "bg-pink-400",
  },
  {
    name: "Sunset",
    colors: "from-orange-400 to-red-500",
    accent: "bg-yellow-300",
  },
]

export default function DesignOptions() {
  return (
    <section id="designs" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-balance">Choose Your Style</h2>
          <p className="text-xl text-gray-600 text-balance">Express yourself with our premium design options</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {designs.map((design, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative mb-4 h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:scale-105 duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${design.colors}`}></div>
                <div className={`absolute top-4 right-4 w-8 h-8 ${design.accent} rounded-full`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl mb-2">🔑</div>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-cyan-600 transition">
                {design.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
