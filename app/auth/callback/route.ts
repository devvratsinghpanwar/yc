// app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type') as 'email' | 'signup' | null;
  const next = requestUrl.searchParams.get('next') || '/';
  const origin = requestUrl.origin;

  // Log for debugging purposes
  console.log('Auth callback received token_hash:', tokenHash);
  console.log('Auth callback received type:', type);
  console.log('Origin:', origin);
  console.log('Next redirect path:', next);

  if (tokenHash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type,
    });

    if (!error) {
      // On successful verification, redirect the user to the specified path.
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Error verifying token hash:', error);
    }
  }

  // If there is an error or a missing token, redirect the user to an error page or login.
  console.error('Missing token hash or type, or an error occurred during verification.');
  return NextResponse.redirect(`${origin}/login`);
}
