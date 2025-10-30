// lib/pushClient.ts
export async function ensurePushSubscription(vapidPublicKey: string): Promise<{ ok: boolean; reason?: string }> {
  try {
    // Basic capability checks
    if (typeof window === 'undefined') return { ok: false, reason: 'No window' };
    if (!('serviceWorker' in navigator)) return { ok: false, reason: 'Service workers unsupported' };
    if (!('Notification' in window)) return { ok: false, reason: 'Notifications unsupported' };

    // Ask permission if not yet decided
    if (Notification.permission === 'default') {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return { ok: false, reason: 'Notification permission denied' };
    }
    if (Notification.permission !== 'granted') {
      return { ok: false, reason: 'Notification permission not granted' };
    }

    // Register the service worker in /public/sw.js
    const reg = await navigator.serviceWorker.register('/sw.js');

    // Reuse existing subscription if available
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
    }

    // (Optional) Send to your backend so you can push later
    // Replace with your own endpoint or Supabase RPC if preferred.
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ subscription: sub }),
      });
    } catch {
      // ignore if you haven't wired the API yet
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, reason: e?.message || 'Unknown error' };
  }
}

// Helper: convert URL-safe base64 public key → Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

/** Optional: keep backward compatibility with your earlier code */
export async function registerPush() {
  const pub = (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string) || '';
  return ensurePushSubscription(pub);
}
