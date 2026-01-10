'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '../component/toast';
import YourPicks from '../component/yourpicks';
import Leaderboard from '../component/leaderboard';
import { getMatches, placePick } from '../lib/supabaseClient';

interface Match {
  id: string;
  name: string;
  status: string;
  team1: { name: string; score?: string; overs?: string };
  team2: { name: string; target?: string; overs?: string };
  venue: string;
  time?: string;
}

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    let storedUserId = sessionStorage.getItem('edge11_user_id');
    if (!storedUserId) {
      storedUserId = crypto.randomUUID();
      sessionStorage.setItem('edge11_user_id', storedUserId);
    }
    return storedUserId;
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const loadMatches = async () => {
    try {
      const matchesData = await getMatches();
      setMatches((matchesData || []) as Match[]);
    } catch (error) {
      console.error('loadMatches error:', error);
    }
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('edge11_logged_in');
    if (!loggedIn) {
      router.replace('/login');
      return;
    }

    (async () => {
      try {
        await loadMatches();
      } catch (e) {
        console.error('loadMatches effect error:', e);
      }
    })();
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem('edge11_logged_in');
    sessionStorage.removeItem('edge11_user_id');
    router.push('/login');
  }

  async function placeBet(matchName: string, pick: string) {
    if (!userId) {
      addToast('User not initialized', 'error');
      return;
    }

    setLoading(true);
    const result = await placePick(userId, matchName, pick, 100);
    setLoading(false);

    if (result.success) {
      addToast(result.message, 'success');
      setTimeout(() => loadMatches(), 1000);
    } else {
      addToast(result.message, 'error');
    }
  }

  function addToast(message: string, type: 'success' | 'error' | 'info') {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
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
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-slate-400">
              ID:{' '}
              <span className="text-emerald-400 font-mono text-xs">
                {userId?.substring(0, 8)}...
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold hover:bg-emerald-400 hover:text-slate-900 transition duration-300 shadow-lg hover:shadow-emerald-500/50"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-slate-900 via-emerald-900/20 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
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
                Make smart predictions on live matches and climb the
                leaderboard. 🚀
              </p>
              <div className="flex gap-4 flex-wrap">
                <div className="px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Live Matches
                  </p>
                  <p className="text-2xl font-black text-emerald-400">
                    {matches.filter((m) => m.status === 'live').length}
                  </p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Upcoming
                  </p>
                  <p className="text-2xl font-black text-cyan-400">
                    {matches.filter((m) => m.status === 'upcoming').length}
                  </p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-orange-500/20 border border-orange-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">
                    Total Matches
                  </p>
                  <p className="text-2xl font-black text-orange-400">
                    {matches.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-48 h-48">
                <div
                  className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-spin"
                  style={{ animationDuration: '8s' }}
                />
                <div
                  className="absolute inset-4 rounded-full border-2 border-cyan-500/30 animate-spin"
                  style={{
                    animationDuration: '6s',
                    animationDirection: 'reverse',
                  }}
                />
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
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Matches - Left Column */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold text-emerald-400 mb-6 uppercase tracking-widest">
              🔴 Live & Upcoming Matches
            </h2>

            <div className="space-y-4">
              {matches.length === 0 ? (
                <div className="relative rounded-2xl overflow-hidden border border-dashed border-slate-600/50 p-8 text-center bg-linear-to-br from-slate-700/20 to-slate-800/20 backdrop-blur-xl">
                  <p className="text-slate-400 font-semibold">
                    Loading matches...
                  </p>
                </div>
              ) : (
                matches.map((match) => (
                  <div
                    key={match.id}
                    className={`group relative rounded-2xl overflow-hidden border transition duration-300 backdrop-blur-xl ${
                      match.status === 'live'
                        ? 'border-emerald-500/30 hover:border-emerald-400/60 bg-linear-to-br from-slate-700/50 to-slate-800/50 hover:shadow-xl hover:shadow-emerald-500/20'
                        : 'border-slate-600/30 hover:border-cyan-400/60 bg-linear-to-br from-slate-700/30 to-slate-800/30 hover:shadow-xl hover:shadow-cyan-500/20'
                    }`}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    <div className="relative p-6">
                      {/* Match Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {match.status === 'live' && (
                              <>
                                <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                                  LIVE NOW
                                </span>
                              </>
                            )}
                            {match.status === 'upcoming' && (
                              <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">
                                UPCOMING
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-400">
                              Cricket • IPL
                            </span>
                          </div>
                          <h3 className="text-lg sm:text-xl font-black text-white">
                            {match.team1.name}{' '}
                            <span className="text-emerald-400">vs</span>{' '}
                            {match.team2.name}
                          </h3>
                        </div>
                      </div>

                      {/* Score/Details */}
                      {match.status === 'live' && match.team1.score ? (
                        <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-slate-600/50">
                          <div className="text-center">
                            <p className="text-emerald-400 font-bold text-lg">
                              {match.team1.score}
                            </p>
                            <p className="text-xs text-slate-400">
                              {match.team1.overs} Overs
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-cyan-400 font-bold text-lg">
                              Target {match.team2.target}
                            </p>
                            <p className="text-xs text-slate-400">
                              {match.team2.overs} Overs
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 border-y border-slate-600/50 mb-4 text-center">
                          <p className="text-slate-400 text-sm">
                            ⏰ {match.time || 'Time TBA'}
                          </p>
                        </div>
                      )}

                      <p className="text-sm text-slate-400 mb-4">
                        📍 {match.venue}
                      </p>

                      {/* Betting Buttons */}
                      {match.status === 'live' ||
                      match.status === 'upcoming' ? (
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() =>
                              placeBet(match.name, match.team1.name)
                            }
                            disabled={loading}
                            className="py-2 px-4 rounded-lg bg-linear-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition duration-300 text-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading
                              ? 'Processing...'
                              : `Back ${match.team1.name}`}
                          </button>
                          <button
                            onClick={() =>
                              placeBet(match.name, match.team2.name)
                            }
                            disabled={loading}
                            className="py-2 px-4 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-amber-500/50 transition duration-300 text-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading
                              ? 'Processing...'
                              : `Back ${match.team2.name}`}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-slate-500 text-sm">
                          Match Closed
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {userId && <YourPicks userId={userId} />}
            <Leaderboard />
          </div>
        </div>
      </div>

      {/* Toasts Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </main>
  );
}
