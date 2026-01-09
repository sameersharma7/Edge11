'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import YourPicks from '@/components/YourPicks';
import Leaderboard from '@/components/Leaderboard';
import ExpertDirectory from '@/components/ExpertDirectory';
import ExpertDashboard from '@/components/ExpertDashboard';
import { getMatches, placePick, getUserProfile } from '@/lib/supabase';

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

interface UserProfile {
  user_type: 'expert' | 'bettor';
  username: string;
  bio?: string;
  is_verified?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<'expert' | 'bettor' | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = sessionStorage.getItem('edge11_logged_in');
      if (!loggedIn) {
        router.replace('/login');
        return;
      }

      const storedUserId = sessionStorage.getItem('edge11_user_id');
      const storedRole = sessionStorage.getItem('edge11_user_role') as 'expert' | 'bettor' | null;

      if (!storedUserId) {
        router.replace('/login');
        return;
      }

      if (!storedRole) {
        router.replace('/roleselect');
        return;
      }

      setUserId(storedUserId);
      setUserRole(storedRole);

      // Fetch user profile
      const profile = await getUserProfile(storedUserId);
      if (profile) {
        setUserProfile(profile);
      }

      // Load matches
      const matchesData = await getMatches();
      setMatches(matchesData);
    };

    checkAuth();
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem('edge11_logged_in');
    sessionStorage.removeItem('edge11_user_id');
    sessionStorage.removeItem('edge11_user_role');
    sessionStorage.removeItem('edge11_username');
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
    } else {
      addToast(result.message, 'error');
    }
  }

  function addToast(message: string, type: 'success' | 'error' | 'info') {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }

  function removeToast(id: string) {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }

  function switchRole() {
    router.push('/roleselect');
  }

  // Show loading state
  if (!userId || !userRole || !userProfile) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  // EXPERT VIEW
  if (userRole === 'expert') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/50">
                E
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                  EDGE11
                </h1>
                <p className="text-xs text-emerald-400">Expert Mode</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <p className="text-slate-400">
                  {userProfile.username}
                  {userProfile.is_verified && <span className="text-emerald-400 ml-2">✓ Verified</span>}
                </p>
                <p className="text-xs text-slate-500">ID: {userId.substring(0, 8)}...</p>
              </div>
              <button
                onClick={switchRole}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-700/50 text-slate-400 hover:bg-slate-600 transition"
              >
                Switch Role
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg border-2 border-emerald-400 text-emerald-400 font-bold hover:bg-emerald-400 hover:text-slate-900 transition duration-300 shadow-lg hover:shadow-emerald-500/50"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-900/20 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Welcome, Expert {userProfile.username}! 🎯
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-6">
              Share your predictions, build your reputation, and earn commission from followers.
            </p>
          </div>
        </div>

        {/* Expert Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ExpertDashboard userId={userId} username={userProfile.username} />
        </div>

        {/* Toasts */}
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={3000}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </main>
    );
  }

  // BETTOR VIEW
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-slate-900 shadow-lg shadow-emerald-500/50">
              E
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                EDGE11
              </h1>
              <p className="text-xs text-cyan-400">Bettor Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-slate-400">{userProfile.username}</p>
              <p className="text-xs text-slate-500">ID: {userId.substring(0, 8)}...</p>
            </div>
            <button
              onClick={switchRole}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-slate-700/50 text-slate-400 hover:bg-slate-600 transition"
            >
              Switch Role
            </button>
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
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-emerald-900/20 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-500/20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Welcome Back!
                </span>
              </h2>
              <p className="text-lg text-slate-300 mb-6">
                Follow expert predictions on live matches and place smart bets. 🚀
              </p>
              <div className="flex gap-4 flex-wrap">
                <div className="px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Live Matches</p>
                  <p className="text-2xl font-black text-emerald-400">{matches.filter(m => m.status === 'live').length}</p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-cyan-500/20 border border-cyan-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Upcoming</p>
                  <p className="text-2xl font-black text-cyan-400">{matches.filter(m => m.status === 'upcoming').length}</p>
                </div>
                <div className="px-4 py-3 rounded-lg bg-orange-500/20 border border-orange-500/50 backdrop-blur">
                  <p className="text-xs text-slate-400 uppercase tracking-widest">Total Matches</p>
                  <p className="text-2xl font-black text-orange-400">{matches.length}</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex justify-center items-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-4 rounded-full border-2 border-cyan-500/30 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 flex items-center justify-center backdrop-blur-sm border border-emerald-500/50">
                  <div className="text-center">
                    <p className="text-4xl">🏆</p>
                    <p className="text-xs
