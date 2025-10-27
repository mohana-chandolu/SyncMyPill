'use client';

import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRSettings() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://sync-my-pill.vercel.app';
  const qrUrl = `${site}/welcome`; // opens the Welcome page when scanned

  function downloadPNG() {
    const node = document.getElementById('qr-visible') as HTMLCanvasElement | null;
    if (!node) return;
    const url = node.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SheSync-QR.png';
    a.click();
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 px-4 py-10 text-center space-y-8">
      {/* Logo + Title */}
      <div className="flex flex-col items-center">
        <Image
          src="/shesync-logo.png" // ✅ using PNG instead of SVG
          alt="SheSync logo"
          width={120}
          height={120}
          className="mb-2 sm:w-[140px] sm:h-[140px]"
        />
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 tracking-wide">SheSync</h1>
      </div>

      {/* QR Code Card */}
      <div className="bg-pink-200 p-6 sm:p-8 rounded-2xl shadow-lg inline-block">
        <QRCodeCanvas
          id="qr-visible"
          value={qrUrl}
          size={230}
          includeMargin
          level="H"
          bgColor="#ffffff"
          fgColor="#000000"
          imageSettings={{
            src: '/shesync-logo.png', // ✅ PNG for QR center
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
        <div className="mt-4 text-center">
          <div className="text-sm sm:text-base font-semibold tracking-wide text-gray-800 uppercase">
            SheSync
          </div>
          <div className="text-xs sm:text-sm text-gray-600 break-all">{qrUrl}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
        <button
          onClick={downloadPNG}
          className="px-5 py-2 rounded bg-pink-500 hover:bg-pink-600 text-white text-sm sm:text-base transition"
        >
          Download PNG
        </button>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 rounded border border-pink-500 text-pink-600 bg-white hover:bg-pink-50 text-sm sm:text-base transition"
        >
          Print
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
          body {
            background: white !important;
          }
          nav,
          header,
          footer,
          .no-print {
            display: none !important;
          }
          main {
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
        }
      `}</style>
    </main>
  );
}
