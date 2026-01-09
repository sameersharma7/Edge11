import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing Supabase configuration' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Auth error:', error.message);
      return NextResponse.json(
        { error: error.message || 'Login failed' },
        { status: 401 }
      );
    }

    if (!data?.session || !data.user) {
      return NextResponse.json(
        { error: 'No session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: data.session,
      user: data.user,
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Server error';
    console.error('Route error:', error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
