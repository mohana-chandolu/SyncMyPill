'use client';
import React from 'react';
import Image from 'next/image';

export default function PostLoginHome() {
  return (
    <main className="min-h-screen bg-pink-50">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 py-12 sm:py-16 flex flex-col items-center text-center">
        {/* Big logo */}
        <Image
          src="/logo-transparent.png"      // ensure this file is in /public
          alt="SheSync logo"
          width={360}
          height={360}
          className="object-contain drop-shadow-sm w-[260px] h-[260px] sm:w-[360px] sm:h-[360px]"
          priority
        />

        {/* Brand title */}
        <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-emerald-600">
            SheSync
          </span>
        </h1>

        {/* Caption */}
        <p className="mt-2 text-lg sm:text-xl text-gray-700">
          Stay in rhythm, stay in control.
        </p>

        {/* Description */}
        <p className="mt-4 max-w-3xl text-gray-700 text-base sm:text-lg leading-relaxed">
          Staying on top of your birth control shouldn’t be stressful—that’s where we come in.
          Our app helps you stay consistent with daily reminders and alarms, so you never miss a dose.
          Plus, you’ll have quick, easy access to trusted information about birth control options,
          side effects, and tips—all in one place. Whether you're new to birth control or just looking
          for a little extra support, we’re here to make it simpler for you.
        </p>

        {/* Optional CTAs */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a href="/authed/healthandmind" className="px-5 py-2.5 rounded-xl font-semibold bg-pink-600 text-white hover:bg-pink-700 transition">
            Set up reminders
          </a>
          <a href="/authed/birthcontrol" className="px-5 py-2.5 rounded-xl font-semibold border border-pink-300 text-pink-700 bg-white hover:bg-pink-50 transition">
            Learn about pills
          </a>
        </div>
      </div>
    </main>
  );
}
