'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { toSvg } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  QrCode,
  CheckCircle,
  IndianRupee,
} from 'lucide-react';
import PosterPreview from '@/components/PosterPreview';
import { DEFAULT_POSTER_CONFIG } from '@/types/poster';

export default function Home() {
  const config = DEFAULT_POSTER_CONFIG;
  const [zoom, setZoom] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [amountInput, setAmountInput] = useState('');
  const [amountError, setAmountError] = useState('');
  const [activePayment, setActivePayment] = useState<{ amount: string } | null>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const previewConfig = activePayment
    ? { ...config, amount: activePayment.amount }
    : config;

  useEffect(() => {
    if (!activePayment) return;

    const timer = window.setTimeout(() => setActivePayment(null), 15000);
    return () => window.clearTimeout(timer);
  }, [activePayment]);

  const handleAmountSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = amountInput.trim();

    if (!/^\d+(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
      setAmountError('Enter an amount greater than ₹0 (up to 2 decimals).');
      return;
    }

    setAmountError('');
    setActivePayment({ amount });
  };

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);

    try {
      const node = posterRef.current;
      const { width, height } = node.getBoundingClientRect();
      const pixelRatio = 3; // Ultra-high resolution 3x for print & display

      // Build the SVG ourselves instead of using html-to-image's toPng:
      // its image loader waits on requestAnimationFrame, which never fires
      // when the browser window is minimized/occluded, so the export hangs.
      let svgDataUrl: string;
      try {
        svgDataUrl = await Promise.race([
          toSvg(node, { cacheBust: true }),
          new Promise<never>((_, reject) =>
            window.setTimeout(() => reject(new Error('SVG generation timed out')), 15000)
          ),
        ]);
      } catch {
        // Font embedding can stall on slow networks; retry without web fonts.
        svgDataUrl = await toSvg(node, { cacheBust: true, skipFonts: true });
      }

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        const timer = window.setTimeout(
          () => reject(new Error('Poster image render timed out')),
          20000
        );
        img.onload = () => {
          window.clearTimeout(timer);
          resolve();
        };
        img.onerror = () => {
          window.clearTimeout(timer);
          reject(new Error('Poster image render failed'));
        };
        img.src = svgDataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      const filename = `${(config.storeNameLine1 || 'POSTER')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase()}_qr_poster.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e6005c', '#ffea00', '#056a33', '#3b82f6'],
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to export poster image', err);
      alert('Could not export poster image. Please try printing to PDF instead.');
    } finally {
      setIsDownloading(false);
    }
  }, [config]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-gray-100 flex flex-col font-poppins selection:bg-pink-600 selection:text-white">
      {/* Top Header Navbar */}
      <header className="no-print border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md sticky top-0 z-50 px-3.5 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-y-2">
        <div className="order-1 flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-lg shadow-pink-600/30 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-gray-950 rounded-[10px] sm:rounded-[14px] flex items-center justify-center">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-white uppercase font-poppins">
              KHERWAL BAZAAR
            </h1>
            <p className="text-[10px] sm:text-[11px] text-gray-400 hidden sm:block">
              UPI Payment QR Code & Poster Studio
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAmountSubmit}
          className="order-3 basis-full sm:order-2 sm:basis-auto sm:flex-1 sm:max-w-xs sm:mx-6"
        >
          <div className="flex gap-2">
            <label className="sr-only" htmlFor="payment-amount">
              Payment amount in rupees
            </label>
            <div className="relative min-w-0 flex-1">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="payment-amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="Enter amount"
                value={amountInput}
                onChange={(event) => {
                  setAmountInput(event.target.value);
                  if (amountError) setAmountError('');
                }}
                aria-invalid={Boolean(amountError)}
                aria-describedby={amountError ? 'payment-amount-error' : undefined}
                className="h-10 w-full rounded-xl border border-gray-700 bg-gray-900 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/30"
              />
            </div>
            <button
              type="submit"
              className="h-10 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-5 text-sm font-extrabold text-white shadow-md transition hover:from-pink-500 hover:to-rose-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Go
            </button>
          </div>
          {amountError && (
            <p id="payment-amount-error" role="alert" className="mt-1 text-xs text-rose-300">
              {amountError}
            </p>
          )}
        </form>

        <div className="order-2 flex items-center gap-1.5 sm:order-3 sm:gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl px-2 py-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.1).toFixed(1)))}
              className="p-1 text-gray-400 hover:text-white transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-gray-300 w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))}
              className="p-1 text-gray-400 hover:text-white transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          {/* Download & Print Quick Buttons */}
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 py-1.5 sm:py-2 px-3 text-xs font-bold text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl transition"
          >
            <Printer className="w-3.5 h-3.5 text-yellow-300" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-3.5 text-xs font-extrabold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-md transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Exporting...' : 'Export PNG'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-0 sm:px-6 sm:pt-6 sm:pb-12 lg:p-8 flex flex-col justify-center">
        {downloadSuccess && (
          <div className="no-print mb-4 p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-2xl flex items-center justify-between text-emerald-200 text-xs sm:text-sm animate-fade-in shadow-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Poster exported in high resolution 3x successfully!</span>
            </div>
            <span className="text-[11px] text-emerald-400/80">Ready for print & digital display</span>
          </div>
        )}

        <div className="w-full flex justify-center">
          {/* Live Poster Canvas */}
          <div className="w-full flex flex-col items-center justify-center p-0 pb-0 sm:p-6 bg-transparent md:bg-gray-950/40 rounded-none border-0 md:border md:border-gray-800/60 backdrop-blur-sm min-h-0 md:min-h-[600px] overflow-x-auto">
            <div className="hidden md:flex w-full justify-between items-center mb-4 px-2 no-print max-w-[440px]">
              <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Scannable Preview
              </span>
              <span className="text-[11px] text-gray-500 font-mono">
                Aspect 1:1.86 (Poster Ratio)
              </span>
            </div>

            {/* The Actual Poster */}
            <PosterPreview config={previewConfig} posterRef={posterRef} scale={zoom} />
          </div>
        </div>
      </main>

      {/* Footer (Hidden on mobile) */}
      <footer className="no-print hidden md:block mt-auto border-t border-gray-900 py-4 px-6 text-center text-xs text-gray-500">
        <p>Kherwal Bazaar QR Code Generator • Built with Next.js & Tailwind CSS</p>
      </footer>
    </div>
  );
}
