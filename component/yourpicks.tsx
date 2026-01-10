'use client';

import { useEffect, useState } from 'react';
import { getUserPicks } from '../lib/supabaseClient';

interface Pick {
  id: string;
  match_name: string;
  pick: string;
  odds: number;
  amount: number;
  status: string;
  winnings: number;
  created_at: string;
}

interface YourPicksProps {
  currentUserId: string;
}

export default function YourPicks({ currentUserId }: YourPicksProps) {
  const [picks, setPicks] = useState<Pick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPicks = async () => {
      setLoading(true);
      try {
        if (currentUserId) {
          const data = await getUserPicks(currentUserId);
          setPicks(data);
        }
      } catch (error) {
        console.error('Error fetching picks:', error);
      }
      setLoading(false);
    };

    fetchPicks();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">
          📋 Your Picks
        </h3>
        <div className="text-center text-slate-400 py-8">
          <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3">Loading your picks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
      <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">
        📋 Your Picks
      </h3>

      {picks.length === 0 ? (
        <div className="text-center text-slate-400 py-8">
          <p>No picks placed yet</p>
          <p className="text-xs mt-2">Place a pick on a match to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {picks.map((pick) => {
            const statusColor =
              pick.status === 'won'
                ? 'text-emerald-400'
                : pick.status === 'lost'
                ? 'text-red-400'
                : 'text-yellow-400';

            return (
              <div
                key={pick.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {pick.match_name}
                  </p>
                  <div className="flex gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-cyan-400">{pick.pick}</span>
                    <span>•</span>
                    <span>${pick.amount.toFixed(0)}</span>
                    <span>@</span>
                    <span>{pick.odds.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <p className={`text-sm font-semibold ${statusColor}`}>
                    {pick.status === 'pending'
                      ? 'Pending'
                      : pick.status === 'won'
                      ? `+$${pick.winnings.toFixed(0)}`
                      : `-$${pick.amount.toFixed(0)}`}
                  </p>
                  <p className="text-xs text-slate-500 capitalize mt-1">
                    {pick.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
