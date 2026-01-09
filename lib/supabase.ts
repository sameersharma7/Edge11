import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSupabaseClient() {
  return supabase;
}

export async function getUserPicks(userId: string) {
  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching picks:', error);
    return [];
  }
  return data || [];
}

export async function getLeaderboard() {
  const { data, error } = await supabase
    .from('predictions')
    .select('user_id, pick, status')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }

  // Calculate user stats
  const userStats: Record<string, { wins: number; total: number; name: string }> = {};

  data?.forEach((pick) => {
    if (!userStats[pick.user_id]) {
      userStats[pick.user_id] = {
        wins: 0,
        total: 0,
        name: `User ${pick.user_id.substring(0, 8)}`,
      };
    }
    userStats[pick.user_id].total++;
    if (pick.status === 'won') {
      userStats[pick.user_id].wins++;
    }
  });

  return Object.entries(userStats)
    .map(([userId, stats]) => ({
      userId,
      name: stats.name,
      wins: stats.wins,
      total: stats.total,
      winRate: stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0,
    }))
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10);
}

export async function getMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching matches:', error);
    return getDefaultMatches();
  }

  if (!data || data.length === 0) {
    return getDefaultMatches();
  }

  return data;
}

function getDefaultMatches() {
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

export async function placePick(
  userId: string,
  matchName: string,
  pick: string,
  amount: number = 100
) {
  try {
    const response = await fetch('/api/picks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        matchName,
        pick,
        amount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to place pick');
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error('Error placing pick:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
}
