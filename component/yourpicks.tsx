'use client';

import { useEffect, useState } from 'react';
import { getUserPicks } from '../lib/supabaseClient';

interface Pick {
  id: string;
  match_name: string;
  pick: string;
  amount: number;
  status: string;
  created_at: string;
}

export default function YourPicks({ userId }: { userId: string }) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchPicks = async () => {
      setLoading(true);
      const userPicks = await getUserPicks(userId);
      setPicks(userPicks);
      setLoading(false);
    };
    fetchPicks();
  }, [userId]);

    if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden border border-emerald-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
        <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-widest">
          📌 Your Picks
        </h3>
        <div className="text-center text-slate-400 py-4">
          <div className="animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

    if (picks.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden border border-emerald-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
        <h3 className="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-widest">
          📌 Your Picks
        </h3>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 text-center">
          <p className="text-slate-400 text-sm">No active picks yet</p>
          <p className="text-slate-500 text-xs mt-1">Make a pick on the match above to get started! 🎯</p>
        </div>
      </div>
    );
  }

  const totalAmount = picks.reduce((sum, pick) => sum + pick.amount, 0);
  const wins = picks.filter(p => p.status === 'won').length;
  const winRate = picks.length > 0 ? Math.round((wins / picks.length) * 100) : 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">
          📌 Your Picks
        </h3>
        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
          {picks.length} picks
        </span>
      </div>

      {/* Stats Bar */}
      <div className="mb-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-slate-400">Wins</p>
            <p className="text-emerald-400 font-bold text-lg">{wins}</p>
          </div>
          <div>
            <p className="text-slate-400">Win Rate</p>
            <p className="text-cyan-400 font-bold text-lg">{winRate}%</p>
          </div>
          <div>
            <p className="text-slate-400">Total</p>
            <p className="text-orange-400 font-bold text-lg">₹{totalAmount}</p>
          </div>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 mt-3">
          <div
            className="bg-linear-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((wins / picks.length) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Picks List */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
        {picks.map((pick) => {
          const statusColor =
            pick.status === 'won'
              ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
              : pick.status === 'lost'
              ? 'bg-red-900/30 border-red-500/50 text-red-400'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400';

          const statusIcon =
            pick.status === 'won'
              ? '✅'
              : pick.status === 'lost'
              ? '❌'
              : '⏳';

          return (
            <div
              key={pick.id}
              className={`p-3 rounded-lg border transition hover:shadow-lg ${statusColor}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{statusIcon}</span>
                  <span className="font-bold text-white">{pick.pick}</span>
                </div>
                <span className="text-xs font-semibold uppercase">
                  {pick.status}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate mb-1">
                {pick.match_name}
              </p>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Amount:</span>
                <span className="text-orange-400 font-bold">₹{pick.amount}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(pick.created_at).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
