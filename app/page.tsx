'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('edge11_logged_in');
    setIsLoggedIn(!!loggedIn);
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/50">
              E
            </div>
            <h1 className="text-2xl font-black bg-linear-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              EDGE11
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition duration-300"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold hover:bg-emerald-400 hover:text-slate-900 transition duration-300"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition duration-300"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 backdrop-blur">
            <p className="text-sm font-semibold text-emerald-400">
              🎯 Fantasy Sports Expert Platform
            </p>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-linear-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Verified Fantasy Experts
            </span>
            <br />
            <span className="text-white">Immutable Records</span>
          </h2>

          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Follow AI-powered decisions from verified experts. Make smart picks on cricket matches with transparent analytics and real-time updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-3 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/50 transition duration-300 transform hover:scale-105"
            >
              Get Started Now
            </button>
            <button
              onClick={() =>
                document
                  .getElementById('features')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="px-8 py-3 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold text-lg hover:bg-emerald-400 hover:text-slate-900 transition duration-300"
            >
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 rounded-xl bg-slate-800/50 border border-emerald-500/30 backdrop-blur hover:border-emerald-400/60 transition">
              <p className="text-3xl mb-2">🏆</p>
              <p className="font-bold text-emerald-400 mb-1">Top Predictors</p>
              <p className="text-slate-400 text-sm">
                Follow the best performers on the leaderboard
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/50 border border-cyan-500/30 backdrop-blur hover:border-cyan-400/60 transition">
              <p className="text-3xl mb-2">📊</p>
              <p className="font-bold text-cyan-400 mb-1">Live Analytics</p>
              <p className="text-slate-400 text-sm">
                Real-time match data and expert insights
              </p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/50 border border-orange-500/30 backdrop-blur hover:border-orange-400/60 transition">
              <p className="text-3xl mb-2">⚡</p>
              <p className="font-bold text-orange-400 mb-1">Instant Updates</p>
              <p className="text-slate-400 text-sm">
                Live notifications for picks and results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-emerald-500/20"
      >
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Why Choose <span className="text-emerald-400">EDGE11</span>?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-linear-to-br from-emerald-500/10 to-slate-800/50 border border-emerald-500/30 hover:border-emerald-400/60 transition">
              <p className="text-4xl mb-4">✅</p>
              <h4 className="text-2xl font-bold text-emerald-400 mb-3">
                Verified Experts
              </h4>
              <p className="text-slate-400">
                All expert predictions are recorded on immutable blockchain records. Track performance history transparently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-linear-to-br from-cyan-500/10 to-slate-800/50 border border-cyan-500/30 hover:border-cyan-400/60 transition">
              <p className="text-4xl mb-4">📈</p>
              <h4 className="text-2xl font-bold text-cyan-400 mb-3">
                Real-Time Analytics
              </h4>
              <p className="text-slate-400">
                Access live match statistics, odds, and expert ratings. Make informed decisions with data-driven insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-linear-to-br from-orange-500/10 to-slate-800/50 border border-orange-500/30 hover:border-orange-400/60 transition">
              <p className="text-4xl mb-4">🎯</p>
              <h4 className="text-2xl font-bold text-orange-400 mb-3">
                Smart Picking
              </h4>
              <p className="text-slate-400">
                Leverage AI recommendations from verified experts. Improve your win rate with algorithmic insights.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-linear-to-br from-pink-500/10 to-slate-800/50 border border-pink-500/30 hover:border-pink-400/60 transition">
              <p className="text-4xl mb-4">🏅</p>
              <h4 className="text-2xl font-bold text-pink-400 mb-3">
                Leaderboards
              </h4>
              <p className="text-slate-400">
                Compete with thousands of players. Climb the global leaderboard and earn rewards for top performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-emerald-500/20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-black mb-12 text-center">
            How It Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Sign Up', desc: 'Create your account' },
              { step: 2, title: 'Browse Experts', desc: 'Explore verified experts' },
              { step: 3, title: 'Follow Picks', desc: 'Copy expert strategies' },
              { step: 4, title: 'Win & Earn', desc: 'Track winnings' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="p-6 rounded-xl bg-slate-800/50 border border-emerald-500/30 h-full">
                  <div className="w-12 h-12 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-slate-900 mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h4>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-linear-to-r from-emerald-500 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-emerald-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-black mb-6">
            Ready to <span className="text-emerald-400">Start Winning</span>?
          </h3>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of players making smarter picks with EDGE11. Sign up today and get instant access to expert predictions.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/50 transition duration-300 transform hover:scale-105"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-500/20 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
                  E
                </div>
                <span className="font-bold text-emerald-400">EDGE11</span>
              </div>
              <p className="text-slate-400 text-sm">
                Fantasy sports meets AI expertise
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text
