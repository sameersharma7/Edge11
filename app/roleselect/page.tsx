'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserProfile } from '@/lib/supabase';

export default function RoleSelectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<'expert' | 'bettor' | null>(null);

  const handleRoleSelect = async (role: 'expert' | 'bettor') => {
    if (!username.trim()) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);
    const userId = sessionStorage.getItem('edge11_user_id') || crypto.randomUUID();
    sessionStorage.setItem('edge11_user_id', userId);
    sessionStorage.setItem('edge11_user_role', role);
    sessionStorage.setItem('edge11_username', username);

    await createUserProfile(userId, role, username);

    setLoading(false);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-4xl text-slate-900 shadow-lg shadow-emerald-500/50 mx-auto mb-6">
            E
          </div>
          <h1 className="text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              EDGE11
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-2">The Expert Prediction Platform</p>
          <p className="text-slate-400">Choose your role and start earning or winning</p>
        </div>

        {/* Username Input */}
        <div className="mb-8 max-w-md mx-auto">
          <label className="block text-sm text-slate-400 mb-3 uppercase font-bold">
            Create Your Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-emerald-400 outline-none transition"
          />
          <p className="text-xs text-slate-500 mt-2">This will be your public username on EDGE11</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Expert Card */}
          <div
            onClick={() => setSelectedRole('expert')}
            className={`relative rounded-2xl overflow-hidden border-2 transition cursor-pointer transform hover:scale-105 ${
              selectedRole === 'expert'
                ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/50'
                : 'border-emerald-500/30 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:border-emerald-400/60'
            } backdrop-blur-xl p-8`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="text-5xl mb-4">🎯</div>
              <h2 className="text-2xl font-black text-white mb-4">Become an Expert</h2>
              
              <div className="space-y-3 mb-6">
                <p className="text-slate-300 font-semibold">What you get:</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Share your predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Build your reputation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Earn commission (10%)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Get verified badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>Gain followers</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/50 mb-6">
                <p className="text-xs text-slate-400 mb-1">Potential Monthly Earnings</p>
                <p className="text-2xl font-black text-emerald-400">₹5,000 - ₹50,000+</p>
              </div>

              <button
                onClick={() => handleRoleSelect('expert')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition disabled:opacity-50"
              >
                {loading && selectedRole === 'expert' ? 'Setting up...' : 'Start as Expert'}
              </button>
            </div>
          </div>

          {/* Bettor Card */}
          <div
            onClick={() => setSelectedRole('bettor')}
            className={`relative rounded-2xl overflow-hidden border-2 transition cursor-pointer transform hover:scale-105 ${
              selectedRole === 'bettor'
                ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/50'
                : 'border-cyan-500/30 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:border-cyan-400/60'
            } backdrop-blur-xl p-8`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="relative">
              <div className="text-5xl mb-4">💰</div>
              <h2 className="text-2xl font-black text-white mb-4">Become a Bettor</h2>
              
              <div className="space-y-3 mb-6">
                <p className="text-slate-300 font-semibold">What you get:</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Follow expert predictions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Access verified experts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Place smart bets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>View expert reasoning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>Track your profits</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-lg bg-cyan-500/20 border border-cyan-500/50 mb-6">
                <p className="text-xs text-slate-400 mb-1">Average Monthly Return</p>
                <p className="text-2xl font-black text-cyan-400">15% - 40%+</p>
              </div>

              <button
                onClick={() => handleRoleSelect('bettor')}
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition disabled:opacity-50"
              >
                {loading && selectedRole === 'bettor' ? 'Setting up...' : 'Start as Bettor'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-2xl border border-slate-600/30 bg-slate-800/30 backdrop-blur-xl p-6 text-center">
          <p className="text-slate-400 text-sm">
            Can't decide? You can switch roles anytime. Start with one and grow from there! 🚀
          </p>
        </div>
      </div>
    </main>
  );
}
