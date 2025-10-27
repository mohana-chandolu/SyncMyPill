import Image from "next/image";
import Link from "next/link";

export default function Welcome() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-pink-50 px-6 py-12">
      <section className="w-full max-w-2xl text-center space-y-8">
        {/* Logo + brand row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Image
            src="/shesync-logo.png"   // ensure real PNG is in /public
            alt="SheSync logo"
            width={80}
            height={80}
            priority
            className="sm:w-[100px] sm:h-[100px]"
          />
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">
            SheSync
          </h1>
        </div>

        {/* Caption */}
        <p className="text-base sm:text-lg text-gray-700">
          Track your daily medication in one place — simple, clear, and reliable.
        </p>

        {/* Actions → go to /auth with redirect to /today after login */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/auth?next=/today"
            className="inline-block px-6 py-3 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
          >
            Log in
          </Link>
          <Link
            href="/auth?next=/today"
            className="inline-block px-6 py-3 rounded-lg border border-pink-500 text-pink-600 bg-white font-medium hover:bg-pink-50 transition"
          >
            Sign up
          </Link>
        </div>

        {/* Subtle helper text */}
        <p className="text-xs text-gray-500">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </section>
    </main>
  );
}
