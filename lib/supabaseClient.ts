import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ========= MATCHES & PICKS (DASHBOARD) ========= */

// This assumes a `matches` table with columns:
// id (uuid), name (text), status (text), venue (text), time (timestamptz),
// team1_name (text), team2_name (text).
export async function getMatches() {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select(
        'id, name, status, venue, time, team1_name, team2_name'
      )
      .order('time', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map((m) => ({
      id: m.id,
      name: m.name,
      status: m.status,
      venue: m.venue,
      time: m.time,
      team1: { name: m.team1_name },
      team2: { name: m.team2_name },
    }));
  } catch (error) {
    console.error('getMatches error:', error);
    return [];
  }
}

// Call your /api/picks API so all inserts go through one place.
export async function placePick(
  userId: string,
  matchName: string,
  pick: string,
  amount: number
) {
  try {
    const res = await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, matchName, pick, amount }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || 'Failed to place pick');
    }

    return json;
  } catch (error) {
    console.error('placePick error:', error);
    throw error;
  }
}

// Old direct function kept for components like YourPicks / stats.
// Table: predictions(user_id, match_name, pick, amount, odds, status, created_at).
export async function getUserPicks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getUserPicks error:', error);
    return [];
  }
}

export async function updatePickStatus(
  pickId: string,
  status: 'won' | 'lost' | 'pending'
) {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .update({ status })
      .eq('id', pickId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('updatePickStatus error:', error);
    throw error;
  }
}

/* ========= LEADERBOARD ========= */

export async function getLeaderboard() {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    interface UserStats {
      user_id: string;
      total_picks: number;
      wins: number;
      total_amount_wagered: number;
      total_earnings: number;
      win_rate: number;
    }

    const userStats: Record<string, UserStats> = {};

    data.forEach(
      (prediction: {
        user_id: string;
        amount?: number;
        odds?: number;
        status: string;
      }) => {
        const userId = prediction.user_id;
        if (!userStats[userId]) {
          userStats[userId] = {
            user_id: userId,
            total_picks: 0,
            wins: 0,
            total_amount_wagered: 0,
            total_earnings: 0,
            win_rate: 0,
          };
        }
        userStats[userId].total_picks += 1;
        userStats[userId].total_amount_wagered += prediction.amount || 0;
        if (prediction.status === 'won') {
          userStats[userId].wins += 1;
          userStats[userId].total_earnings +=
            (prediction.amount || 0) * (prediction.odds || 1);
        }
        userStats[userId].win_rate =
          userStats[userId].total_picks > 0
            ? (userStats[userId].wins /
                userStats[userId].total_picks) *
              100
            : 0;
      }
    );

    return Object.values(userStats).sort(
      (a: UserStats, b: UserStats) =>
        b.total_earnings - a.total_earnings
    );
  } catch (error) {
    console.error('getLeaderboard error:', error);
    return [];
  }
}

/* ========= USER PROFILES ========= */

// Table: users_profiles(id, username, role, avatar_url, created_at, ...)

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getUserProfile error:', error);
    return null;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Record<string, unknown>
) {
  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .update(updates)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
}

export async function createUserProfile(
  userId: string,
  username: string,
  role: 'expert' | 'bettor'
) {
  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .insert([
        {
          id: userId,
          username,
          role,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('createUserProfile error:', error);
    throw error;
  }
}

/* ========= EXPERT PICKS & STATS ========= */

export async function placeExpertPick(
  expertId: string,
  matchName: string,
  prediction: string,
  confidence: number
) {
  try {
    const { data, error } = await supabase
      .from('expert_picks')
      .insert([
        {
          expert_id: expertId,
          match_name: matchName,
          prediction,
          confidence,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('placeExpertPick error:', error);
    throw error;
  }
}

export async function getExpertPicks(expertId?: string) {
  try {
    let query = supabase.from('expert_picks').select('*');
    if (expertId) query = query.eq('expert_id', expertId);

    const { data, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getExpertPicks error:', error);
    return [];
  }
}

export async function getExpertEarnings(expertId: string) {
  try {
    const { data, error } = await supabase
      .from('expert_earnings')
      .select('*')
      .eq('expert_id', expertId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getExpertEarnings error:', error);
    return null;
  }
}

export async function updateExpertEarnings(
  expertId: string,
  amount: number
) {
  try {
    const { data, error } = await supabase
      .from('expert_earnings')
      .update({ total_earnings: amount })
      .eq('expert_id', expertId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('updateExpertEarnings error:', error);
    throw error;
  }
}

export async function getExpertStats(expertId: string) {
  try {
    const { data, error } = await supabase
      .from('expert_stats')
      .select('*')
      .eq('expert_id', expertId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('getExpertStats error:', error);
    return null;
  }
}

export async function updateExpertStats(
  expertId: string,
  stats: Record<string, unknown>
) {
  try {
    const { data, error } = await supabase
      .from('expert_stats')
      .update(stats)
      .eq('expert_id', expertId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('updateExpertStats error:', error);
    throw error;
  }
}

/* ========= EXPERT & BETTOR DIRECTORIES ========= */

export async function getAllExperts() {
  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .select('*')
      .eq('role', 'expert');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getAllExperts error:', error);
    return [];
  }
}

export async function getExpertDirectory() {
  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .select('id, username, avatar_url, role, created_at')
      .eq('role', 'expert')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getExpertDirectory error:', error);
    return [];
  }
}

export async function getBettorDirectory() {
  try {
    const { data, error } = await supabase
      .from('users_profiles')
      .select('id, username, avatar_url, role, created_at')
      .eq('role', 'bettor')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getBettorDirectory error:', error);
    return [];
  }
}

/* ========= FOLLOWING SYSTEM ========= */

export async function followExpert(
  userId: string,
  expertId: string
) {
  try {
    const { data, error } = await supabase
      .from('bettor_following_picks')
      .insert([
        {
          bettor_id: userId,
          expert_id: expertId,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('followExpert error:', error);
    throw error;
  }
}

export async function unfollowExpert(
  userId: string,
  expertId: string
) {
  try {
    const { error } = await supabase
      .from('bettor_following_picks')
      .delete()
      .eq('bettor_id', userId)
      .eq('expert_id', expertId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('unfollowExpert error:', error);
    throw error;
  }
}

export async function isFollowing(
  userId: string,
  expertId: string
) {
  try {
    const { data, error } = await supabase
      .from('bettor_following_picks')
      .select('id')
      .eq('bettor_id', userId)
      .eq('expert_id', expertId)
      .maybeSingle();

    if (error) return false;
    return !!data;
  } catch (error) {
    console.error('isFollowing error:', error);
    return false;
  }
}

export async function getFollowedExperts(userId: string) {
  try {
    const { data, error } = await supabase
      .from('bettor_following_picks')
      .select('*')
      .eq('bettor_id', userId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getFollowedExperts error:', error);
    return [];
  }
}

export async function getFollowers(expertId: string) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*')
      .eq('expert_id', expertId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getFollowers error:', error);
    return [];
  }
}

export async function getFollowersCount(expertId: string) {
  try {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('expert_id', expertId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('getFollowersCount error:', error);
    return 0;
  }
}

/* ========= STATS HELPERS ========= */

export async function getPredictionsByMatch(matchName: string) {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('match_name', matchName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getPredictionsByMatch error:', error);
    return [];
  }
}

export async function getUserPredictionsStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    if (!data || data.length === 0) {
      return {
        total_picks: 0,
        wins: 0,
        losses: 0,
        pending: 0,
        win_rate: 0,
        total_amount: 0,
        total_earnings: 0,
      };
    }

    interface Prediction {
      status: 'won' | 'lost' | 'pending';
      amount?: number;
      odds?: number;
    }

    const stats = {
      total_picks: data.length,
      wins: data.filter((p: Prediction) => p.status === 'won').length,
      losses: data.filter((p: Prediction) => p.status === 'lost').length,
      pending: data.filter((p: Prediction) => p.status === 'pending')
        .length,
      win_rate: 0,
      total_amount: 0,
      total_earnings: 0,
    };

    stats.win_rate =
      stats.total_picks > 0
        ? (stats.wins / stats.total_picks) * 100
        : 0;

    stats.total_amount = data.reduce(
      (sum: number, p: Prediction) => sum + (p.amount || 0),
      0
    );

    stats.total_earnings = data
      .filter((p: Prediction) => p.status === 'won')
      .reduce(
        (sum: number, p: Prediction) =>
          sum + (p.amount || 0) * (p.odds || 1),
        0
      );

    return stats;
  } catch (error) {
    console.error('getUserPredictionsStats error:', error);
    return null;
  }
}

export async function getExpertPredictionsStats(expertId: string) {
  try {
    const { data, error } = await supabase
      .from('expert_picks')
      .select('*')
      .eq('expert_id', expertId);

    if (error) throw error;

    return {
      total_picks: data?.length || 0,
      accuracy: 0,
      followers: 0,
    };
  } catch (error) {
    console.error('getExpertPredictionsStats error:', error);
    return null;
  }
}
