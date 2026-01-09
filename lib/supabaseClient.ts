import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to fetch picks for a user
export async function getUserPicks(userId: string) {
	if (!userId) return [];
	const { data, error } = await supabase
		.from('picks')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) {
		console.error('Supabase getUserPicks error:', error);
		return [];
	}

	return (data ?? []) as any[];
}

// Helper to build a simple leaderboard from picks
export async function getLeaderboard(limit = 10) {
	const { data, error } = await supabase.from('picks').select('*');
	if (error) {
		console.error('Supabase getLeaderboard error:', error);
		return [];
	}

	const agg = new Map<string, { userId: string; name: string; wins: number; total: number }>();

	(data ?? []).forEach((p: any) => {
		const uid = p.user_id || p.userId || 'unknown';
		const name = p.user_name || p.name || uid;
		const cur = agg.get(uid) || { userId: uid, name, wins: 0, total: 0 };
		cur.total += 1;
		if (p.status === 'won') cur.wins += 1;
		agg.set(uid, cur);
	});

	const arr = Array.from(agg.values()).map((e) => ({
		userId: e.userId,
		name: e.name,
		wins: e.wins,
		total: e.total,
		winRate: e.total > 0 ? Math.round((e.wins / e.total) * 100) : 0,
	}));

	arr.sort((a, b) => b.wins - a.wins);
	return arr.slice(0, limit);
}

// Fetch matches from 'matches' table
export async function getMatches() {
	const { data, error } = await supabase.from('matches').select('*').order('start_time', { ascending: true });
	if (error) {
		console.error('Supabase getMatches error:', error);
		return [];
	}
	return (data ?? []) as any[];
}

// Place a pick for a user
export async function placePick(userId: string, matchName: string, pick: string, amount: number) {
	try {
		const { data, error } = await supabase.from('picks').insert([
			{
				user_id: userId,
				user_name: userId,
				match_name: matchName,
				pick,
				amount,
				status: 'pending',
			},
		]);

		if (error) {
			console.error('Supabase placePick error:', error);
			return { success: false, message: error.message || 'Failed to place pick' };
		}

		return { success: true, message: 'Pick placed successfully', data };
	} catch (err: any) {
		console.error('placePick exception', err);
		return { success: false, message: err?.message || 'Failed to place pick' };
	}
}
