import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============= USER PROFILE FUNCTIONS =============

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createUserProfile(userId: string, userType: 'expert' | 'bettor', username: string) {
  const { data, error } = await supabase
    .from('users_profiles')
    .insert({
      user_id: userId,
      user_type: userType,
      username: username,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    return null;
  }
  return data;
}

export async function updateUserProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('users_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data;
}

// ============= EXPERT FUNCTIONS =============

export async function getExpertStats(userId: string) {
  const { data, error } = await supabase
    .from('expert_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function createExpertPick(
  expertId: string,
  matchName: string,
  pick: string,
  odds: number,
  confidenceLevel: number,
  reasoning: string
) {
  const { data, error } = await supabase
    .from('expert_picks')
    .insert({
      expert_id: expertId,
      match_name: matchName,
      pick: pick,
      odds: odds,
      confidence_level: confidenceLevel,
      reasoning: reasoning,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating pick:', error);
    return null;
  }
  return data;
}

export async function getExpertPicks(expertId: string) {
  const { data, error } = await supabase
    .from('expert_picks')
    .select('*')
    .eq('expert_id', expertId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getTopExperts(limit = 10) {
  const { data, error } = await supabase
    .from('expert_stats')
    .select(`
      user_id,
      win_rate,
      followers_count,
      total_earnings,
      users_profiles(username, bio, is_verified, avatar_url)
    `)
    .order('followers_count', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data || [];
}

export async function getExpertDirectory() {
  const { data, error } = await supabase
    .from('users_profiles')
    .select(`
      user_id,
      username,
      bio,
      avatar_url,
      expertise_area,
      is_verified,
      expert_stats(win_rate, followers_count, total_earnings)
    `)
    .eq('user_type', 'expert')
    .order('updated_at', { ascending: false });

  if (error) return [];
  return data || [];
}

// ============= FOLLOWER FUNCTIONS =============

export async function followExpert(followerId: string, expertId: string) {
  const { data, error } = await supabase
    .from('followers')
    .insert({
      follower_id: followerId,
      expert_id: expertId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error following expert:', error);
    return null;
  }
  return data;
}

export async function unfollowExpert(followerId: string, expertId: string) {
  const { error } = await supabase
    .from('followers')
    .delete()
    .eq('follower_id', followerId)
    .eq('expert_id', expertId);

  if (error) {
    console.error('Error unfollowing expert:', error);
    return false;
  }
  return true;
}

export async function getFollowedExperts(userId: string) {
  const { data, error } = await supabase
    .from('followers')
    .select(`
      expert_id,
      users_profiles(username, avatar_url, bio, is_verified),
      expert_stats(win_rate, followers_count, total_earnings)
    `)
    .eq('follower_id', userId)
    .eq('is_active', true);

  if (error) return [];
  return data || [];
}

export async function isFollowing(followerId: string, expertId: string) {
  const { data, error } = await supabase
    .from('followers')
    .select('id')
    .eq('follower_id', followerId)
    .eq('expert_id', expertId)
    .single();

  if (error) return false;
  return !!data;
}

// ============= BETTOR FUNCTIONS =============

export async function followExpertPick(
  bettorId: string,
  expertId: string,
  pickId: string,
  amount: number = 100
) {
  const { data, error } = await supabase
    .from('bettor_following_picks')
    .insert({
      bettor_id: bettorId,
      expert_id: expertId,
      pick_id: pickId,
      amount: amount,
    })
    .select()
    .single();

  if (error) {
    console.error('Error following pick:', error);
    return null;
  }
  return data;
}

export async function getBettorFollowingPicks(bettorId: string) {
  const { data, error } = await supabase
    .from('bettor_following_picks')
    .select(`
      id,
      expert_id,
      pick_id,
      amount,
      status,
      followed_at,
      expert_picks(match_name, pick, confidence_level, reasoning, odds),
      users_profiles(username, is_verified)
    `)
    .eq('bettor_id', bettorId)
    .order('followed_at', { ascending: false });

  if (error) return [];
  return data || [];
}

// ============= EARNINGS FUNCTIONS =============

export async function getExpertEarnings(expertId: string) {
  const { data, error } = await supabase
    .from('expert_earnings')
    .select('*')
    .eq('expert_id', expertId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function calculateExpertEarnings(expertId: string) {
  const picks = await getExpertPicks(expertId);
  const stats = await getExpertStats(expertId);
  
  if (!stats || !picks) return 0;

  const wonPicks = picks.filter(p => p.status === 'won').length;
  const commissionRate = 0.10; // 10% commission
  const baseEarnings = wonPicks * 10; // $10 per winning pick
  
  return Math.round(baseEarnings * commissionRate * 100) / 100;
}

// ============= VERIFICATION FUNCTIONS =============

export async function verifyExpert(expertId: string) {
  const { data, error } = await supabase
    .from('users_profiles')
    .update({
      is_verified: true,
      verification_date: new Date().toISOString(),
    })
    .eq('user_id', expertId)
    .select()
    .single();

  if (error) return null;
  return data;
}

// ============= ORIGINAL BETTING FUNCTIONS =============

export async function placePick(
  userId: string,
  matchName: string,
  pick: string,
  amount: number = 100
) {
  try {
    const response = await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, matchName, pick, amount }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}

export async function getUserPicks(userId: string) {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getMatches() {
  return [
    {
      id: '1',
      name: 'Mumbai Indians vs Delhi Capitals',
      status: 'live',
      team1: { name: 'MI', score: '159/8', overs: '15.2' },
      team2: { name: 'DC', target: '165', overs: '20' },
      venue: 'Arun Jaitley Stadium, New Delhi',
    },
    {
      id: '2',
      name: 'Rajasthan Royals vs Kolkata Knight Riders',
      status: 'upcoming',
      team1: { name: 'RR' },
      team2: { name: 'KKR' },
      venue: 'Sawai Mansingh Stadium, Jaipur',
      time: '9:00 PM',
    },
    {
      id: '3',
      name: 'Royal Challengers Bangalore vs Punjab Kings',
      status: 'upcoming',
      team1: { name: 'RCB' },
      team2: { name: 'PBKS' },
      venue: 'M. A. Chidambaram Stadium, Chennai',
      time: '7:30 PM',
    },
    {
      id: '4',
      name: 'Sunrisers Hyderabad vs Gujarat Titans',
      status: 'upcoming',
      team1: { name: 'SRH' },
      team2: { name: 'GT' },
      venue: 'Arun Jaitley Stadium, New Delhi',
      time: '8:00 PM',
    },
  ];
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('predictions')
    .select('user_id, pick, status')
    .order('created_at', { ascending: false });

  if (error) return [];

  const userStats: Record<string, { wins: number; total: number }> = {};

  data?.forEach((pick) => {
    if (!userStats[pick.user_id]) {
      userStats[pick.user_id] = { wins: 0, total: 0 };
    }
    userStats[pick.user_id].total++;
    if (pick.status === 'won') {
      userStats[pick.user_id].wins++;
    }
  });

  return Object.entries(userStats)
    .map(([userId, stats]) => ({
      userId,
      name: `User ${userId.substring(0, 8)}`,
      wins: stats.wins,
      total: stats.total,
      winRate: stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10);
}
