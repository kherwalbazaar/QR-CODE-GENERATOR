'use client';

import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import {
  Printer,
  Download,
  ZoomIn,
  ZoomOut,
  QrCode,
  CheckCircle,
} from 'lucide-react';
import PosterPreview from '@/components/PosterPreview';
import { DEFAULT_POSTER_CONFIG } from '@/types/poster';

export default function Home() {
  const config = DEFAULT_POSTER_CONFIG;
  const [zoom, setZoom] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const posterRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return;
    setIsDownloading(true);

    try {
      // Small delay to allow any pending font or DOM renders
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(posterRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Ultra-high resolution 3x for print & display
        quality: 0.98,
      });

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
      {/* Top Navbar (Hidden on mobile and when printing) */}
      <header className="no-print hidden md:flex border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-8 py-3.5 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-lg shadow-pink-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
              <QrCode className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
              Kherwal Bazaar <span className="text-pink-500 text-xs px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30">Next.js Studio</span>
            </h1>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Dynamic UPI Payment Poster Generator & High-Res Print Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            className="hidden sm:flex items-center gap-1.5 py-2 px-3 text-xs font-bold text-gray-200 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-xl transition"
          >
            <Printer className="w-3.5 h-3.5 text-yellow-300" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 py-2 px-3.5 text-xs font-extrabold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl shadow-md transition disabled:opacity-50"
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
                Aspect 1:1.5 (Poster Ratio)
              </span>
            </div>

            {/* The Actual Poster */}
            <PosterPreview config={config} posterRef={posterRef} scale={zoom} />
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
