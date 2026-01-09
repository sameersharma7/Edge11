export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="max-w-6xl mx-auto px-4 py-24">
        {/* Hero */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full mb-8">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            Early Access Live
          </div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6">
            Edge11
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
            Verified Fantasy Experts. Immutable Records.
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent font-semibold">
              AI‑powered decisions.
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="bg-white text-gray-900 px-12 py-6 rounded-3xl font-bold text-xl hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get Early Access
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-white/30 text-white px-12 py-6 rounded-3xl font-bold text-xl hover:bg-white/10 backdrop-blur-xl transition-all duration-300"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Simple section */}
        <section id="how-it-works" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">Immutable Proof</h3>
            <p className="text-white/80">Predictions locked before match. No editing. Full history.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">Expert Tiers</h3>
            <p className="text-white/80">Bronze → Platinum based on long‑term verified performance.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-3">AI View</h3>
            <p className="text-white/80">Prototype will show “Best Picks” using expert data.</p>
          </div>
        </section>
      </div>
    </main>
  )
}
