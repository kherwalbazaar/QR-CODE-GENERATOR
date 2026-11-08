'use client';

import React, { useState, useEffect, useRef } from 'react';
import PosterPreview from '@/components/PosterPreview';
import { DEFAULT_POSTER_CONFIG } from '@/types/poster';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const config = DEFAULT_POSTER_CONFIG;
  const [activePayment, setActivePayment] = useState<{ amount: string } | null>(null);
  const [supabaseError, setSupabaseError] = useState('');
  const latestRequest = useRef(0);
  const previewConfig = activePayment
    ? { ...config, amount: activePayment.amount }
    : config;

  useEffect(() => {
    if (!activePayment) return;

    const timer = window.setTimeout(() => setActivePayment(null), 30000);
    return () => window.clearTimeout(timer);
  }, [activePayment]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setSupabaseError(
        'Live amounts unavailable: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in your hosting settings, then redeploy.'
      );
      return;
    }

    let isMounted = true;
    const fetchLatestAmount = async () => {
      const request = ++latestRequest.current;
      const { data, error } = await client
        .from('amount_value')
        .select('id, amount')
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!isMounted || request !== latestRequest.current) return;
      if (error) {
        console.error('Failed to read the latest Supabase amount', error);
        if (error.code === '42703' || error.code === '42P01') {
          setSupabaseError(
            'Supabase setup is incomplete. Apply the amount_value migration to add the amount column.'
          );
        } else {
          setSupabaseError('Could not read the latest Supabase amount. Check Supabase table access.');
        }
        return;
      }

      setSupabaseError('');
      if (!data) {
        setActivePayment(null);
        return;
      }

      const amount = Number(data.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        setActivePayment(null);
        setSupabaseError('The latest Supabase amount is invalid.');
        return;
      }

      setActivePayment({ amount: amount.toFixed(2) });
    };

    void fetchLatestAmount();

    const channel = client
      .channel('amount-value-live-qr')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'amount_value' },
        () => {
          void fetchLatestAmount();
        }
      )
      .subscribe((status, error) => {
        if (!isMounted) return;

        if (status === 'SUBSCRIBED') {
          setSupabaseError('');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('Supabase realtime subscription failed', error);
          setSupabaseError('Live Supabase updates are unavailable.');
        }
      });

    return () => {
      isMounted = false;
      latestRequest.current += 1;
      void client.removeChannel(channel);
    };
  }, []);

  return (
    <div className="h-screen h-[100dvh] overflow-hidden bg-[#070b12] text-gray-100 flex flex-col font-poppins selection:bg-pink-600 selection:text-white">
      {/* Main Content Area */}
      <main className="flex-1 min-h-0 w-full mx-auto p-0 flex flex-col overflow-hidden">
        {supabaseError && (
          <p role="alert" className="no-print px-3 py-1 text-center text-[11px] text-rose-300">
            {supabaseError}
          </p>
        )}
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
