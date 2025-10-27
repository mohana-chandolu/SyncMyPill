'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function QRSettings() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://syncmypill.vercel.app';
  const qrUrl = `${site}/q`;

  function downloadPNG() {
    const node = document.getElementById('qr-visible') as HTMLCanvasElement | null;
    if (!node) return;
    const url = node.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SyncMyPill-QR.png';
    a.click();
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Universal QR</h1>
      <p className="text-gray-600">
        Scan opens <code>/q</code> (redirects to auth if needed, then Today).
      </p>

      <div className="bg-white p-6 rounded-xl shadow inline-block print:shadow-none print:p-0">
        {/* Note: use id, not ref */}
        <QRCodeCanvas id="qr-visible" value={qrUrl} size={300} includeMargin />
        <div className="text-center mt-3 text-sm text-gray-600">{qrUrl}</div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={downloadPNG} className="px-4 py-2 rounded bg-black text-white">
          Download PNG
        </button>
        <button onClick={() => window.print()} className="px-4 py-2 rounded border">
          Print
        </button>
      </div>

      <style jsx global>{`
        @media print {
          @page { size: A4; margin: 20mm; }
          nav, header, footer, .no-print { display: none !important; }
        }
      `}</style>
    </main>
  );
}
