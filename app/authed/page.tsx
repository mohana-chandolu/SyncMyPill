'use client';
import React from 'react';
import Image from 'next/image';

export default function PostLoginHome() {
  return (
    <main className="min-h-screen bg-pink-50 flex flex-col items-center justify-start pt-10 sm:pt-12 text-center">
      {/* Big logo */}
      <Image
        src="/logo-transparent.png"
        alt="SheSync logo"
        width={260}
        height={260}
        className="object-contain drop-shadow-sm w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]"
        priority
      />

      {/* Brand Title */}
      <h1 className="mt-2 text-5xl sm:text-6xl font-extrabold leading-tight">
        <span className="text-pink-600">She</span>
        <span className="text-green-600">Sync</span>
      </h1>

      {/* Caption */}
      <p className="mt-1 text-lg sm:text-xl text-gray-700">
        Stay in rhythm, stay in control.
      </p>

      {/* Description */}
      <p className="mt-4 max-w-3xl text-gray-700 text-base sm:text-lg leading-relaxed">
        Staying on top of your birth control shouldn’t be stressful — that’s where we come in.
        Our app is designed to help you stay consistent with daily reminders and alarms,
        so you never miss a dose. Plus, you’ll have quick, easy access to trusted information
        about birth control options, side effects, and tips — all in one place.
        Whether you're new to birth control or just looking for a little extra support,
        we’re here to make it simpler for you.
      </p>
    </main>
  );
}

