'use client';

import React, { useState, useEffect } from 'react';
import { IndianRupee } from 'lucide-react';
import PosterPreview from '@/components/PosterPreview';
import { DEFAULT_POSTER_CONFIG } from '@/types/poster';

export default function Home() {
  const config = DEFAULT_POSTER_CONFIG;
  const [amountInput, setAmountInput] = useState('');
  const [amountError, setAmountError] = useState('');
  const [activePayment, setActivePayment] = useState<{ amount: string } | null>(null);
  const previewConfig = activePayment
    ? { ...config, amount: activePayment.amount }
    : config;

  useEffect(() => {
    if (!activePayment) return;

    const timer = window.setTimeout(() => setActivePayment(null), 30000);
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

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#070b12] text-gray-100 flex flex-col font-poppins selection:bg-pink-600 selection:text-white">
      {/* Main Content Area */}
      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-0 sm:px-6 sm:py-4 lg:p-6 flex flex-col overflow-hidden">
        <form
          onSubmit={handleAmountSubmit}
          className="no-print mx-auto mt-2 mb-2 w-full max-w-[440px] shrink-0 px-3 sm:px-0"
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

        <div className="flex-1 min-h-0 w-full flex justify-center overflow-hidden">
          {/* Live Poster Canvas */}
          <div className="w-full h-full min-h-0 flex flex-col items-center justify-center p-0 sm:p-2 bg-transparent md:bg-gray-950/40 rounded-none border-0 md:border md:border-gray-800/60 backdrop-blur-sm overflow-hidden">
            {/* The Actual Poster */}
            <PosterPreview config={previewConfig} />
          </div>
        </div>
      </main>
    </div>
  );
}
