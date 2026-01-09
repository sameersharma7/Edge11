'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TEST_USERS = [
  { email: 'test@edge11.com', password: 'test123' },
  { email: 'demo@edge11.com', password: 'demo123' },
  { email: 'edge11test@edge11.com', password: 'Edge11@Test123' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('edge11_logged_in');
    if (loggedIn) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const user = TEST_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const userId = 'test-' + Date.now().toString();

      sessionStorage.setItem('edge11_logged_in', 'true');
      sessionStorage.setItem('edge11_user_id', userId);
      sessionStorage.setItem('edge11_user_email', email);

      setLoading(false);
      setTimeout(() => {
        router.push('/roleselect');
      }, 500);
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      alert('Account created! You can now login with your credentials.');
      setEmail('');
      setPassword('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 rounded-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Edge11 Login
        </h1>
        <p className="text-xs text-gray-400 text-center mb-6">
          Test Mode - Demo Credentials
        </p>

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-white text-black font-semibold rounded hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : 'Sign In'}
          </button>
        </form>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full px-4 py-2 bg-gray-900 border border-gray-700 text-white font-semibold rounded hover:bg-gray-800 disabled:opacity-50 mb-4"
        >
          {loading ? 'Processing...' : 'Create Account'}
        </button>

        <div className="bg-gray-900 p-4 rounded border border-gray-600">
          <p className="text-xs text-gray-400 mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p className="text-xs text-gray-300">Email: test@edge11.com</p>
          <p className="text-xs text-gray-300">Password: test123</p>
        </div>
      </div>
    </div>
  );
}
