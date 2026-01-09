'use client';

import { useEffect, useState } from 'react';
import { getExpertDirectory, followExpert, unfollowExpert, isFollowing } from '../lib/supabaseClient';

interface Expert {
  id: string;
  username: string;
  avatar_url: string;
  role: 'expert' | 'bettor';
  created_at: string;
}

export default function ExpertDirectory({ currentUserId }: { currentUserId: string }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      const data = await getExpertDirectory();
      setExperts(data as Expert[]);
      
      // Check following status for each expert
      for (const expert of data) {
        const isFollowingExpert = await isFollowing(currentUserId, expert.id);
        setFollowingStatus(prev => ({
          ...prev,
          [expert.id]: isFollowingExpert,
        }));
      }
      setLoading(false);
    };

    fetchExperts();
  }, [currentUserId]);

  const handleFollow = async (expertId: string) => {
    if (followingStatus[expertId]) {
      await unfollowExpert(currentUserId, expertId);
    } else {
      await followExpert(currentUserId, expertId);
    }
    setFollowingStatus(prev => ({
      ...prev,
      [expertId]: !prev[expertId],
    }));
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
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
    <div className="rounded-2xl border border-cyan-500/20 bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl p-6">
      <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-widest">
        🌟 Expert Directory
      </h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {experts.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-4">No experts yet</p>
        ) : (
          experts.map((expert) => (
            <div
              key={expert.id}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/50 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{expert.username}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Expert</p>
                </div>
                <button
                  onClick={() => handleFollow(expert.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                    followingStatus[expert.id]
                      ? 'bg-slate-600/50 text-slate-400 hover:bg-red-500/20 hover:text-red-400'
                      : 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30'
                  }`}
                >
                  {followingStatus[expert.id] ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
