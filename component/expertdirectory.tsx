'use client';

import { useEffect, useState } from 'react';
import { getExpertDirectory, followExpert, unfollowExpert, isFollowing } from '../lib/supabaseClient';

interface Expert {
  id: string;
  username: string | null;
  role: string | null;
  total_picks: number;
  wins: number;
  losses: number;
  total_winnings: number;
}

export default function ExpertDirectory() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [currentUserId] = useState('user_session_id');

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const data = await getExpertDirectory();
        setExperts(data);

        for (const expert of data) {
          if (currentUserId && expert.id) {
            const isUserFollowing = await isFollowing(currentUserId, expert.id);
            setFollowing((prev) => ({
              ...prev,
              [expert.id]: isUserFollowing,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
      setLoading(false);
    };

    fetchExperts();
  }, [currentUserId]);

  const handleFollow = async (expertId: string) => {
    if (!currentUserId) {
      console.error('User not authenticated');
      return;
    }

    try {
      const result = await followExpert(currentUserId, expertId);
      if (result.success) {
        setFollowing((prev) => ({
          ...prev,
          [expertId]: true,
        }));
      }
    } catch (error) {
      console.error('Error following expert:', error);
    }
  };

  const handleUnfollow = async (expertId: string) => {
    if (!currentUserId) {
      console.error('User not authenticated');
      return;
    }

    try {
      const result = await unfollowExpert(currentUserId, expertId);
      if (result.success) {
        setFollowing((prev) => ({
          ...prev,
          [expertId]: false,
        }));
      }
    } catch (error) {
      console.error('Error unfollowing expert:', error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">
          🌟 Expert Directory
        </h3>
        <div className="text-center text-slate-400 py-8">
          <div className="animate-spin w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3">Loading experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
      <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">
        🌟 Expert Directory
      </h3>

      {experts.length === 0 ? (
        <div className="text-center text-slate-400 py-6">
          <p>No experts available yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {experts.map((expert) => {
            const winRate =
              expert.total_picks > 0
                ? ((expert.wins / expert.total_picks) * 100).toFixed(1)
                : '0.0';
            const isUserFollowing = following[expert.id] || false;

            return (
              <div
                key={expert.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {expert.username || `Expert ${expert.id?.slice(0, 8)}`}
                  </p>
                  <div className="flex gap-2 text-xs text-slate-400 mt-1">
                    <span className="text-emerald-400 font-semibold">
                      {winRate}%
                    </span>
                    <span>•</span>
                    <span>{expert.wins}W {expert.losses || 0}L</span>
                    <span>•</span>
                    <span className="text-cyan-400">
                      ${expert.total_winnings.toFixed(0)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    isUserFollowing
                      ? handleUnfollow(expert.id)
                      : handleFollow(expert.id)
                  }
                  className={`ml-3 px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition ${
                    isUserFollowing
                      ? 'bg-slate-700/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                >
                  {isUserFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
