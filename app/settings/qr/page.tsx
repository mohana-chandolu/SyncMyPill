'use client';

import Image from 'next/image';
import { QRCodeCanvas } from 'qrcode.react';
import logo from '/public/shesync-logo.png';   // update this path to match your logo filename

export default function QRSettings() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://sync-my-pill.vercel.app';
  const qrUrl = `${site}/welcome`;   // opens the Welcome page when scanned

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
    <main className="min-h-screen flex flex-col items-center justify-center bg-pink-50 p-6 text-center space-y-8">
      {/* logo + app name */}
      <div className="flex flex-col items-center">
        <Image src={logo} alt="SheSync logo" width={140} height={140} className="mb-2" />
        <h1 className="text-4xl font-semibold text-gray-800 tracking-wide">SheSync</h1>
      </div>

      {/* QR block */}
      <div className="bg-white p-8 rounded-2xl shadow-lg inline-block">
        <QRCodeCanvas
          id="qr-visible"
          value={qrUrl}
          size={300}
          includeMargin
          bgColor="#ffffff"
          fgColor="#000000"
        />
        <div className="text-center mt-4 text-sm text-gray-600">{qrUrl}</div>
      </div>

      {/* action buttons */}
      <div className="flex justify-center gap-4">
        <button onClick={downloadPNG} className="px-6 py-2 rounded bg-black text-white">
          Download PNG
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2 rounded border border-black text-black bg-white"
        >
          Print
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          body { background: white !important; }
          nav, header, footer, .no-print { display: none !important; }
          main { justify-content: center; align-items: center; height: 100vh; }
        }
      `}</style>
    </main>
  );
}
