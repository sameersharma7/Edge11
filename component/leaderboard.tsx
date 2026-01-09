'use client';

import { useEffect, useState } from 'react';
import { getLeaderboard } from '../lib/supabaseClient';

interface LeaderboardEntry {
  userId: string;
  name: string;
  wins: number;
  total: number;
  winRate: number;
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
    { userId: 'user_1', name: 'ProGamer', wins: 24, total: 30, winRate: 80 },
    { userId: 'user_2', name: 'PredictMaster', wins: 21, total: 28, winRate: 75 },
    { userId: 'user_3', name: 'CricketGod', wins: 19, total: 25, winRate: 76 },
    { userId: 'user_4', name: 'DataAnalyst', wins: 18, total: 24, winRate: 75 },
    { userId: 'user_5', name: 'SportsFanatic', wins: 17, total: 22, winRate: 77 },
    { userId: 'user_6', name: 'QuickPick', wins: 15, total: 20, winRate: 75 },
    { userId: 'user_7', name: 'WinnerZone', wins: 14, total: 19, winRate: 74 },
    { userId: 'user_8', name: 'StarPlayer', wins: 13, total: 18, winRate: 72 },
    { userId: 'user_9', name: 'TopChampion', wins: 12, total: 16, winRate: 75 },
    { userId: 'user_10', name: 'BestBet', wins: 11, total: 15, winRate: 73 },
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
          const isTopThree = idx < 3;
          const medalColor =
            idx === 0
              ? 'from-amber-900/30 to-slate-800/50 border-amber-500/50'
              : idx === 1
              ? 'from-slate-600/30 to-slate-800/50 border-slate-500/50'
              : idx === 2
              ? 'from-orange-900/30 to-slate-800/50 border-orange-500/50'
              : 'bg-slate-800/50 border-slate-700/50';

          return (
            <div
              key={player.userId}
              className={`p-3 rounded-lg border transition hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/20 ${
                isTopThree
                    ? `bg-linear-to-r ${medalColor}`
                  : medalColor
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
                      {player.name}
                    </p>
                    <div className="flex gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="text-cyan-400">{player.winRate}%</span>
                      <span>•</span>
                      <span>{player.wins}/{player.total}</span>
                    </div>
                  </div>
                </div>

                {/* Wins */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-lg text-cyan-400">{player.wins}W</p>
                  <p className="text-xs text-slate-500">
                    {player.total - player.wins}L
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-linear-to-r from-cyan-400 to-emerald-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${player.winRate}%` }}
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
          <span className="text-emerald-400 font-bold">Total Players:</span> {displayLeaderboard.length} | 
          <span className="text-cyan-400 font-bold ml-2">Avg Win Rate:</span> 
          <span className="ml-1">
            {Math.round(
              displayLeaderboard.reduce((sum, p) => sum + p.winRate, 0) /
                displayLeaderboard.length
            )}%
          </span>
        </p>
      </div>
    </div>
  );
}
