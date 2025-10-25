// app/settings/qr/page.tsx
'use client';

import { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRSettings() {
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const qrUrl = `${site}/q`;

  // we'll grab the canvas via a ref for downloading
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SyncMyPill-QR.png';
    a.click();
  }

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Universal QR</h1>
      <p className="text-gray-600">
        Scan opens <code>/q</code> (currently redirects into your auth flow, then Today).
      </p>

      <div className="bg-white p-6 rounded-xl shadow inline-block print:shadow-none print:p-0">
        {/* Use the named export: QRCodeCanvas. Attach a ref to the underlying <canvas> */}
        <QRCodeCanvas
          value={qrUrl}
          size={300}
          includeMargin
          // @ts-expect-error the lib forwards ref to the underlying canvas element
          ref={canvasRef}
        />
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
          body { background: #fff; }
          nav, header, footer, .no-print { display: none !important; }
        }
      `}</style>
    </main>
  );
}

