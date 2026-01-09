'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleCreateAccount() {
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || 'Unknown response from server');
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Login failed');
      } else {
        setMessage(null);
        // mark this tab as logged in for prototype protection
        sessionStorage.setItem('edge11_logged_in', 'true');
        router.push('/dashboard');
      }
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md space-y-4 p-8 border border-white/20 rounded-2xl">
        <h1 className="text-2xl font-bold text-center">Edge11 Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded bg-black border border-white/30 mb-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 rounded bg-black border border-white/30 mb-4"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSignIn}
            className="flex-1 py-2 rounded bg-white text-black font-semibold"
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={handleCreateAccount}
            className="flex-1 py-2 rounded border border-white font-semibold"
          >
            Create Account
          </button>
        </div>

        {message && (
          <p className="text-sm text-center mt-2">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
