'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/supabaseClient';

interface LeaderboardEntry {
  id?: string;
  user_id?: string;
  username?: string | null;
  total_picks: number;
  wins: number;
  losses: number;
  total_winnings: number;
  win_rate?: number;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
      setLoading(false);
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  const defaultPlayers: LeaderboardEntry[] = [
    { id: 'user_1', user_id: 'user_1', total_picks: 30, wins: 24, losses: 6, total_winnings: 3600 },
    { id: 'user_2', user_id: 'user_2', total_picks: 28, wins: 21, losses: 7, total_winnings: 3360 },
    { id: 'user_3', user_id: 'user_3', total_picks: 25, wins: 19, losses: 6, total_winnings: 3080 },
    { id: 'user_4', user_id: 'user_4', total_picks: 24, wins: 18, losses: 6, total_winnings: 2880 },
    { id: 'user_5', user_id: 'user_5', total_picks: 22, wins: 17, losses: 5, total_winnings: 2860 },
    { id: 'user_6', user_id: 'user_6', total_picks: 20, wins: 15, losses: 5, total_winnings: 2250 },
    { id: 'user_7', user_id: 'user_7', total_picks: 19, wins: 14, losses: 5, total_winnings: 2090 },
    { id: 'user_8', user_id: 'user_8', total_picks: 18, wins: 13, losses: 5, total_winnings: 1944 },
    { id: 'user_9', user_id: 'user_9', total_picks: 16, wins: 12, losses: 4, total_winnings: 1920 },
    { id: 'user_10', user_id: 'user_10', total_picks: 15, wins: 11, losses: 4, total_winnings: 1815 },
  ];

  const displayLeaderboard = leaderboard.length > 0 ? leaderboard : defaultPlayers;

  if (loading && leaderboard.length === 0) {
    return (
      <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">
          👑 Top Predictors
        </h3>
        <div className="text-center text-slate-400 py-8">
          <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
          👑 Top Predictors
        </h3>
        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full animate-pulse">
          🔴 Live
        </span>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {displayLeaderboard.map((player, idx) => {
          const winRate =
            typeof (player as any).win_rate === 'number'
              ? (player as any).win_rate
              : typeof (player as any).winRate === 'number'
              ? (player as any).winRate
              : player.total_picks
              ? (player.wins / player.total_picks) * 100
              : 0;

          const isTopThree = idx < 3;

          const medalColor =
            idx === 0
              ? 'from-amber-900/30 to-slate-800/50 border-amber-500/50'
              : idx === 1
              ? 'from-slate-600/30 to-slate-800/50 border-slate-500/50'
              : idx === 2
              ? 'from-orange-900/30 to-slate-800/50 border-orange-500/50'
              : 'bg-slate-800/50 border-slate-700/50';

          const mapKey =
            (player as any).id ||
            (player as any).user_id ||
            `player-${idx}`;

          return (
            <div
              key={mapKey}
              className={`p-3 rounded-lg border transition hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20 ${
                isTopThree ? `bg-linear-to-r ${medalColor}` : medalColor
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {/* Rank & Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-2xl font-bold w-8 text-center shrink-0">
                    {idx < 3 ? medals[idx] : `#${idx + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {player.username || `User #${idx + 1}`}
                    </p>
                    <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-cyan-400">
                        {Number(winRate || 0).toFixed(1)}%
                      </span>
                      <span>•</span>
                      <span>
                        {player.wins}/{player.total_picks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wins */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg text-cyan-400">
                    {player.wins}W
                  </p>
                  <p className="text-xs text-slate-500">
                    {player.total_picks - player.wins}L
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(Math.max(winRate, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* View More Button */}
      <button className="w-full mt-4 py-2.5 px-4 rounded-lg bg-linear-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-400 font-semibold hover:from-cyan-500/30 hover:to-emerald-500/30 transition border border-cyan-500/30 text-sm hover:shadow-lg hover:shadow-cyan-500/20">
        View Full Leaderboard →
      </button>

      {/* Stats Summary */}
      <div className="mt-4 p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-center">
        <p className="text-xs text-slate-400">
          <span className="text-emerald-400 font-bold">Total Players:</span>{' '}
          {displayLeaderboard.length}{' '}
          <span className="text-cyan-400 font-bold ml-2">
            Avg Win Rate:
          </span>
          <span className="ml-1">
            {displayLeaderboard.length === 0
              ? '0%'
              : `${Math.round(
                  displayLeaderboard.reduce((sum, p) => {
                    const r =
                      typeof (p as any).win_rate === 'number'
                        ? (p as any).win_rate
                        : typeof (p as any).winRate === 'number'
                        ? (p as any).winRate
                        : p.total_picks
                        ? (p.wins / p.total_picks) * 100
                        : 0;
                    return sum + r;
                  }, 0) / displayLeaderboard.length
                )}%`}
          </span>
        </p>
      </div>
    </div>
  );
}
