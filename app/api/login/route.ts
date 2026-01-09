'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Simulate login (in real app, use auth provider)
      sessionStorage.setItem('edge11_logged_in', 'true');
      
      // Redirect to role selection instead of dashboard
      router.push('/roleselect');
    } catch (err) {
      setError('Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-3xl text-slate-900 shadow-lg shadow-emerald-500/50 mx-auto mb-4">
            E
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
              EDGE11
            </span>
          </h1>
          <p className="text-slate-400">Welcome Back</p>
        </div>

        {/* Login Form Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-8 mb-6">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-semibold">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-slate-400 mb-2 font-semibold">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-900 font-bold hover:shadow-lg hover:shadow-emerald-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <span className="text-emerald-400 font-bold cursor-pointer hover:text-cyan-400">
                Sign up
              </span>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="rounded-lg border border-slate-600/30 bg-slate-800/30 backdrop-blur-xl p-4 text-center">
          <p className="text-xs text-slate-400 mb-2">Demo Credentials</p>
          <p className="text-xs text-slate-300 font-mono">
            Email: demo@edge11.com | Password: demo123
          </p>
        </div>
      </div>
    </main>
  );
}
