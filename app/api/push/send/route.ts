import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const { title, message } = await req.json();

  // Setup web-push with your environment keys
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  // Connect to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  // Get all subscriptions
  const { data: subs, error } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth');

  if (error) {
    console.error('DB error:', error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  // Send to all users
  const results = [];
  for (const sub of subs || []) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({ title, message })
      );
      results.push({ endpoint: sub.endpoint, ok: true });
    } catch (err) {
      console.error('Push error:', err);
      results.push({ endpoint: sub.endpoint, ok: false });
    }
  }

  return NextResponse.json({ ok: true, results });
}
