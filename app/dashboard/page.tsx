'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import YourPicks from '../../component/yourpicks';
import Leaderboard from '../../component/leaderboard';
import ExpertDirectory from '../../component/expertdirectory';
import {
  getUserProfile,
} from '../../lib/supabaseClient';

interface UserProfile {
  role: 'expert' | 'bettor';
  username: string;
  avatar_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<'expert' | 'bettor' | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const init = async () => {
      const loggedIn = sessionStorage.getItem('edge11_logged_in');
      if (!loggedIn) return router.replace('/login');

      const id = sessionStorage.getItem('edge11_user_id');
      const role = sessionStorage.getItem('edge11_user_role') as
        | 'expert'
        | 'bettor'
        | null;

      if (!id) return router.replace('/login');
      if (!role) return router.replace('/roleselect');

      setUserId(id);
      setUserRole(role);

      const profile = await getUserProfile(id);
      if (profile) setUserProfile(profile as UserProfile);
    };
    init();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.clear();
    router.push('/login');
  };

  if (!userId || !userRole || !userProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div>Loading...</div>
      </main>
    );
  }

  if (userRole === 'expert') {
    return (
      <main className="min-h-screen text-white p-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">EDGE11 — Expert</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/roleselect')}
              className="px-3 py-1"
            >
              Switch
            </button>
            <button onClick={handleLogout} className="px-3 py-1">
              Logout
            </button>
          </div>
        </header>

        <section className="mb-6">
          <h2 className="text-lg font-bold">
            Welcome, {userProfile.username}
          </h2>
          <p className="text-sm text-slate-300">Expert dashboard</p>
        </section>

        <section>
          <ExpertDirectory currentUserId={userId} />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">EDGE11</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/roleselect')}
            className="px-3 py-1"
          >
            Switch
          </button>
          <button onClick={handleLogout} className="px-3 py-1">
            Logout
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <YourPicks userId={userId} />
        </div>

        <aside className="space-y-4">
          <Leaderboard />
          <ExpertDirectory currentUserId={userId} />
        </aside>
      </div>
    </main>
  );
}
