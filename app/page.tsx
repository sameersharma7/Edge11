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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
              E
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              EDGE11
            </h1>
          </div>

          <div className="flex gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold"
                >
                  Login
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="py-24 text-center px-6">
        <h2 className="text-5xl md:text-7xl font-black mb-6">
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Verified Fantasy Experts
          </span>
          <br />
          Immutable Records
        </h2>

        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10">
          Follow AI-powered decisions from verified experts and make smarter fantasy cricket picks.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold text-lg"
          >
            Get Started
          </button>
          <button
            onClick={() =>
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="px-8 py-3 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold text-lg"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-6 border-t border-emerald-500/20">
        <h3 className="text-4xl font-black text-center mb-12">
          Why Choose <span className="text-emerald-400">EDGE11</span>?
        </h3>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {[
            ['✅', 'Verified Experts', 'Transparent expert history & performance tracking'],
            ['📊', 'Live Analytics', 'Real-time stats & insights'],
            ['🎯', 'Smart Picks', 'AI-powered recommendations'],
            ['🏆', 'Leaderboards', 'Compete globally & earn rewards'],
          ].map(([icon, title, desc]) => (
            <div
              key={title}
              className="p-8 rounded-xl bg-slate-800/50 border border-emerald-500/30"
            >
              <p className="text-4xl mb-4">{icon}</p>
              <h4 className="text-2xl font-bold text-emerald-400 mb-2">{title}</h4>
              <p className="text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center border-t border-emerald-500/20">
        <h3 className="text-4xl font-black mb-6">
          Ready to <span className="text-emerald-400">Start Winning</span>?
        </h3>
        <p className="text-xl text-slate-300 mb-8">
          Join thousands of players making smarter fantasy picks.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold text-lg"
        >
          Get Started Free
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-emerald-500/20 py-12 px-6 bg-slate-900/60">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
                E
              </div>
              <span className="font-bold text-emerald-400">EDGE11</span>
            </div>
            <p className="text-slate-400 text-sm">
              EDGE11 is a fantasy sports analytics platform delivering transparent,
              data-driven expert predictions.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-emerald-400">Home</a></li>
              <li><a href="#" className="hover:text-emerald-400">Features</a></li>
              <li><a href="#" className="hover:text-emerald-400">Login</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-emerald-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-10">
          © {new Date().getFullYear()} EDGE11. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
