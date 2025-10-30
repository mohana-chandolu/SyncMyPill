import { NextResponse } from 'next/server';
import { cookies as nextCookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } };
type SubPayload = { subscription?: PushSub };

export async function POST(req: Request) {
  try {
    // 1) Parse & validate body
    const body = (await req.json()) as SubPayload;
    const sub = body?.subscription;
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ ok: false, error: 'Bad subscription' }, { status: 400 });
    }

    // 2) Prepare an outgoing response (so @supabase/ssr can set cookies)
    const resp = NextResponse.json({ ok: true });

    // 3) Snapshot request cookies (NOTE: cookies() is NOT async)
    const reqCookies = nextCookies();

    // 4) Create Supabase server client bound to request/response cookies
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          // Read from the snapshot (avoid .get typing issues)
          get(name: string) {
            return reqCookies.get(name)?.value;
          },
          // Write onto the outgoing response (relax options typing to satisfy Next’s type)
          set(name: string, value: string, options: any = {}) {
            resp.cookies.set(name, value, options);
          },
          remove(name: string, options: any = {}) {
            resp.cookies.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );

    // 5) Require sign-in
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes.user;
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Not signed in' }, { status: 401 });
    }

    // 6) Upsert subscription (dedupe by endpoint)
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint: sub.endpoint,
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth,
        },
        { onConflict: 'endpoint' }
      );

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return resp;
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? 'Server error' },
      { status: 500 }
    );
  }
}
