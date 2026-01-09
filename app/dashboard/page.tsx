'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('edge11_logged_in');
    if (!loggedIn) {
      router.replace('/login');
    } else {
      // Get user ID from session storage or create one with proper UUID
      let storedUserId = sessionStorage.getItem('edge11_user_id');
      if (!storedUserId) {
        storedUserId = crypto.randomUUID();
        sessionStorage.setItem('edge11_user_id', storedUserId);
      }
      setUserId(storedUserId);
    }
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem('edge11_logged_in');
    sessionStorage.removeItem('edge11_user_id');
    router.push('/login');
  }

  // API function to place pick
  async function placePick(pick: 'MI' | 'DC') {
    if (!userId) {
      alert('❌ User not initialized');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/picks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          matchName: 'Mumbai Indians vs Delhi Capitals',
          pick: pick,
          amount: 100,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('❌ Error: ' + data.message);
        return;
      }

      alert('✅ ' + data.message);
      // Optionally refresh page or update state
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to place pick');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
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
          <button
            onClick={handleLogout}
            className="px-6 py-2 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold hover:bg-emerald-400 hover:text-slate-900 transition duration-300 shadow-lg hover:shadow-emerald-500/50"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Banner with Animated Background */}
      <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-emerald-900/20 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-linear-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                Make smart predictions on live matches and climb the leaderboard. 🚀
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Live Matches</p>
                  <p className="text-2xl font-black text-emerald-400">2</p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Your Rank</p>
                  <p className="text-2xl font-black text-cyan-400">—</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-4 rounded-full border-2 border-cyan-500/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                <div className="absolute inset-8 rounded-full bg-linear-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center backdrop-blur-sm border border-emerald-500/50">
                  <div className="text-center">
                    <p className="text-4xl">🏆</p>
                    <p className="text-xs text-slate-400 mt-2">Play Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="mb-12">
          <h2 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-widest">Your Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Picks', value: '0', icon: '📊' },
              { label: 'Win Rate', value: '0%', icon: '🎯' },
              { label: 'Total Winnings', value: '₹0', icon: '💰' },
              { label: 'Rank', value: '#—', icon: '👑' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6 border border-emerald-500/20 hover:border-emerald-400/60 transition duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="relative">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-black bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Matches */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold text-emerald-400 mb-6 uppercase tracking-widest">🔴 Live & Upcoming</h2>

            <div className="space-y-4">
              {/* Match Card 1 */}
              <div className="group relative rounded-2xl overflow-hidden border border-emerald-500/30 hover:border-emerald-400/60 transition duration-300 hover:shadow-xl hover:shadow-emerald-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl">
                <div className="absolute inset-0 bg-linear-to-r from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-red-400 uppercase tracking-widest">LIVE NOW</span>
                        <span className="text-xs font-semibold text-slate-400">Cricket • IPL</span>
                      </div>
                      <h3 className="text-xl font-black text-white">
                        Mumbai Indians <span className="text-emerald-400">vs</span> Delhi Capitals
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-600/50">
                    <div className="text-center">
                      <p className="text-emerald-400 font-bold text-lg">159/8</p>
                      <p className="text-xs text-slate-400">15.2 Overs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-cyan-400 font-bold text-lg">Target 165</p>
                      <p className="text-xs text-slate-400">20 Overs</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">Arun Jaitley Stadium, New Delhi</p>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => placePick('MI')}
                      disabled={loading}
                      className="py-2 px-4 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition duration-300 text-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Back MI'}
                    </button>
                    <button
                      onClick={() => placePick('DC')}
                      disabled={loading}
                      className="py-2 px-4 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-amber-500/50 transition duration-300 text-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Processing...' : 'Back DC'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Match Card 2 */}
              <div className="group relative rounded-2xl overflow-hidden border border-slate-600/30 hover:border-cyan-400/60 transition duration-300 hover:shadow-xl hover:shadow-cyan-500/20 bg-linear-to-br from-slate-700/30 to-slate-800/30 backdrop-blur-xl">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">STARTS IN 3h 45m</span>
                        <span className="text-xs font-semibold text-slate-400">Cricket • T20</span>
                      </div>
                      <h3 className="text-xl font-black text-white">
                        Rajasthan Royals <span className="text-cyan-400">vs</span> Kolkata Knight Riders
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4">Sawai Mansingh Stadium, Jaipur • 9:00 PM</p>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-2 px-4 rounded-lg bg-slate-700/50 text-slate-400 font-bold border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 transition duration-300 text-sm transform hover:scale-105">
                      Back RR
                    </button>
                    <button className="py-2 px-4 rounded-lg bg-slate-700/50 text-slate-400 font-bold border border-slate-600 hover:border-cyan-400 hover:text-cyan-400 transition duration-300 text-sm transform hover:scale-105">
                      Back KKR
                    </button>
                  </div>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="relative rounded-2xl overflow-hidden border border-dashed border-slate-600/50 hover:border-emerald-400/50 transition duration-300 p-6 text-center bg-linear-to-br from-slate-700/20 to-slate-800/20 backdrop-blur-xl">
                <p className="text-slate-400 font-semibold">More matches loading...</p>
                <p className="text-xs text-slate-500 mt-2">Check back soon for more cricket and sports events</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Picks */}
            <div className="rounded-2xl overflow-hidden border border-emerald-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
              <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-widest">📌 Your Picks</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
                  <p className="text-slate-400 text-sm">No active picks</p>
                  <p className="text-slate-500 text-xs mt-1">Make a pick above!</p>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
              <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">👑 Top Predictors</h3>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'ProGamer', wins: 24, icon: '🥇' },
                  { rank: 2, name: 'PredictMaster', wins: 21, icon: '🥈' },
                  { rank: 3, name: 'CricketGod', wins: 19, icon: '🥉' },
                ].map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{player.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{player.name}</p>
                        <p className="text-xs text-slate-400">Rank #{player.rank}</p>
                      </div>
                    </div>
                    <p className="font-bold text-cyan-400">{player.wins}W</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
