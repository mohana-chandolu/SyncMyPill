export default function Welcome() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to SyncMyPill</h1>
      <p>Track your daily medication in one place.</p>
      <a href="/login?next=/today" className="inline-block px-4 py-2 border rounded">
        Log in / Sign up
      </a>
    </main>
  );
}
