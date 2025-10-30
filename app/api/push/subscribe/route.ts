import { NextResponse } from 'next/server';
import { cookies  } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } };
type SubPayload = { subscription: PushSub }; // ← renamed from "Body"

export async function POST(req: Request) {
  try {
    // 1) Parse & validate body
    const body = (await req.json()) as SubPayload;
    const sub = body?.subscription;
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ ok: false, error: 'Bad subscription' }, { status: 400 });
    }

    // 2) Prepare an outgoing response (so Supabase SSR can set cookies)
    const resp = NextResponse.json({ ok: true });

    // Snapshot of incoming request cookies (avoid calling .get() directly later)
    const cookieStore = await cookies();

    // 3) Create Supabase server client bound to request/response cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // read from the snapshot (no typing errors)
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          // write onto the outgoing response
          set(name: string, value: string, options: CookieOptions = {}) {
            resp.cookies.set(name, value, options);
          },
          remove(name: string, options: CookieOptions = {}) {
            resp.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // 4) Require a signed-in user
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
    }

    // 5) Upsert subscription (unique by endpoint)
    const { error } = await supabase.from('push_subscriptions').upsert({
      user_id: user.id,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    });

    if (error) throw error;
    return resp;
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}