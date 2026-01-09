import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, matchName, pick, amount } = body as {
    userId?: string;
    matchName?: string;
    pick?: string;
    amount?: number;
  };

  if (!userId || !matchName || !pick) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from('predictions')
    .insert({
      user_id: userId,
      match_name: matchName,
      pick,
      amount: amount || 100,
      status: 'pending',
    });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Pick placed on ${matchName}: ${pick}`,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'User ID required' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    picks: data,
  });
}
