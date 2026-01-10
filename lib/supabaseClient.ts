// lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ========= USER PROFILES ========= */

export type UserRole = 'expert' | 'bettor';

export interface UserProfile {
  id: string;
  user_id: string | null;
  email: string | null;
  username: string | null;
  role: UserRole | null;
  total_picks: number;
  wins: number;
  losses: number;
  total_winnings: number;
  created_at: string;
}

/**
 * Create or update a user profile in user_profiles.
 * Uses upsert so duplicate id does not throw an error.
 */
export async function createUserProfile(
  userId: string,
  username: string,
  role: UserRole
): Promise<UserProfile | null> {
  try {
    const payload = {
      id: userId, // primary key
      user_id: userId, // linked to auth.users later; for now same as id
      username,
      role,
      // email can be added later
    };

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      const msg = error.message || String(error);
      console.error('Supabase error:', msg);
      throw new Error(msg || 'Failed to create or update user profile');
    }

    return data as UserProfile;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('createUserProfile error:', errorMessage);
    throw error;
  }
}

/**
 * Load a single profile by id.
 */
export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('getUserProfile error:', error.message || error);
      return null;
    }

    return data as UserProfile | null;
  } catch (error) {
    console.error(
      'getUserProfile catch error:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/* ========= MATCHES & PICKS (DASHBOARD) ========= */

interface RawMatchRow {
  id: string;
  name: string;
  status: string;
  venue: string;
  time: string | null;
  team1_name: string;
  team2_name: string;
}

export interface MatchForDashboard {
  id: string;
  name: string;
  status: string;
  team1: { name: string; score?: string; overs?: string };
  team2: { name: string; target?: string; overs?: string };
  venue: string;
  time?: string;
}

/**
 * Fetch matches for dashboard.
 * Assumes table "matches" with columns:
 * id, name, status, venue, time, team1_name, team2_name
 */
export async function getMatches(): Promise<MatchForDashboard[]> {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('id, name, status, venue, time, team1_name, team2_name')
      .order('time', { ascending: true });

    if (error) {
      console.error('getMatches supabase error:', error.message || error);
      return [];
    }

    if (!data) return [];

    return (data as RawMatchRow[]).map((m) => ({
      id: m.id,
      name: m.name,
      status: m.status,
      venue: m.venue,
      time: m.time || undefined,
      team1: { name: m.team1_name },
      team2: { name: m.team2_name },
    }));
  } catch (error) {
    console.error(
      'getMatches catch error:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/**
 * Place a pick by calling your /api/picks route.
 * Always returns { success, message } for the UI.
 */
export async function placePick(
  userId: string,
  matchName: string,
  pick: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/picks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, matchName, pick, amount }),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok || !json.success) {
      return {
        success: false,
        message: json.message || 'Failed to place pick',
      };
    }

    return {
      success: true,
      message: json.message || `Pick placed on ${matchName}: ${pick}`,
    };
  } catch (error) {
    console.error('placePick error:', error);
    return {
      success: false,
      message: 'Network error placing pick',
    };
  }
}

/* ========= EXPERT DIRECTORY (SIDEBAR) ========= */

export interface ExpertDirectoryItem {
  id: string;
  username: string | null;
  role: string | null;
  total_picks: number;
  wins: number;
  losses: number;
  total_winnings: number;
}

/**
 * List experts for directory component.
 * Uses user_profiles with role = 'expert'.
 */
export async function getExpertDirectory(): Promise<
  ExpertDirectoryItem[]
> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(
        'id, username, role, total_picks, wins, losses, total_winnings'
      )
      .eq('role', 'expert')
      .order('total_winnings', { ascending: false });

    if (error) {
      console.error(
        'getExpertDirectory supabase error:',
        error.message || error
      );
      return [];
    }

    return (data || []) as ExpertDirectoryItem[];
  } catch (error) {
    console.error(
      'getExpertDirectory error:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/* ========= EXPERT FOLLOWING ========= */

export interface FollowRow {
  id: string;
  follower_id: string;
  expert_id: string;
  created_at: string;
}

/**
 * Check if a user is following an expert.
 */
export async function isFollowing(
  followerId: string,
  expertId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('expert_id', expertId)
      .maybeSingle();

    if (error) {
      console.error('isFollowing error:', error.message || error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error(
      'isFollowing catch error:',
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

/**
 * Follow an expert.
 */
export async function followExpert(
  followerId: string,
  expertId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from('followers').insert([
      {
        follower_id: followerId,
        expert_id: expertId,
      },
    ]);

    if (error) {
      console.error('followExpert error:', error.message || error);
      return {
        success: false,
        message: error.message || 'Failed to follow expert',
      };
    }

    return { success: true, message: 'Now following expert' };
  } catch (error) {
    console.error(
      'followExpert catch error:',
      error instanceof Error ? error.message : error
    );
    return { success: false, message: 'Network error' };
  }
}

/**
 * Unfollow an expert.
 */
export async function unfollowExpert(
  followerId: string,
  expertId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('expert_id', expertId);

    if (error) {
      console.error('unfollowExpert error:', error.message || error);
      return {
        success: false,
        message: error.message || 'Failed to unfollow expert',
      };
    }

    return { success: true, message: 'Unfollowed expert' };
  } catch (error) {
    console.error(
      'unfollowExpert catch error:',
      error instanceof Error ? error.message : error
    );
    return { success: false, message: 'Network error' };
  }
}

/* ========= USER PICKS (YOUR PICKS SIDEBAR) ========= */

export interface UserPick {
  id: string;
  match_name: string;
  pick: string;
  odds: number;
  amount: number;
  status: string;
  winnings: number;
  created_at: string;
}

/**
 * Get all predictions/picks for a given userId from the predictions table.
 */
export async function getUserPicks(userId: string): Promise<UserPick[]> {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select(
        'id, match_name, pick, odds, amount, status, winnings, created_at'
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('getUserPicks supabase error:', error.message || error);
      return [];
    }

    return (data || []) as UserPick[];
  } catch (error) {
    console.error(
      'getUserPicks error:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/* ========= LEADERBOARD ========= */

export interface LeaderboardEntry {
  id: string;
  username: string | null;
  total_picks: number;
  wins: number;
  losses: number;
  total_winnings: number;
}

/**
 * Leaderboard for the sidebar component.
 * Top users by total_winnings (you can change limit or order metric).
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, username, total_picks, wins, losses, total_winnings')
      .order('total_winnings', { ascending: false }) // highest first
      .limit(10);

    if (error) {
      console.error('getLeaderboard supabase error:', error.message || error);
      return [];
    }

    return (data || []) as LeaderboardEntry[];
  } catch (error) {
    console.error(
      'getLeaderboard error:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}
