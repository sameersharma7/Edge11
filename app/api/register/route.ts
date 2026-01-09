import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email and password required' },
      { status: 400 }
    );
  }

  if (!email.includes('@')) {
    return NextResponse.json(
      { success: false, message: 'Please enter a valid email address' },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { success: false, message: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Account created for ${email}. Check your email to confirm.`,
  });
}
