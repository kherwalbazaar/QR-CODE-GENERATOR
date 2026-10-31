'use client';

import React, { useState } from 'react';
import {
  Store,
  CreditCard,
  Palette,
  Sparkles,
  Download,
  Printer,
  Copy,
  RotateCcw,
  Check,
  Upload,
  ExternalLink,
  Info,
  RefreshCw,
} from 'lucide-react';
import {
  PosterConfig,
  DEFAULT_POSTER_CONFIG,
  THEME_STYLES,
} from '@/types/poster';

interface PosterEditorProps {
  config: PosterConfig;
  onChange: (updated: PosterConfig) => void;
  onDownload: () => void;
  onPrint: () => void;
  isDownloading?: boolean;
  autoRotateTheme?: boolean;
  onToggleAutoRotateTheme?: () => void;
}

const PRESETS: Record<string, Partial<PosterConfig>> = {
  kherwal: {
    storeNameLine1: 'KHERWAL',
    storeNameLine2: 'BAZAAR',
    bannerText: 'Scan QR Code & Pay',
    footerText: 'Thank you for shopping with us! Visit again',
    paymentMode: 'upi',
    upiId: '9583252256-3@axl',
    payeeName: 'Kherwal Bazaar',
    amount: '',
    qrCenterType: 'text',
    qrCenterText: 'KB',
    theme: 'crimson',
    features: [
      { id: '1', icon: 'shield', title: 'Secure Payment' },
      { id: '2', icon: 'bolt', title: 'Fast Checkout' },
      { id: '3', icon: 'truck', title: 'Home Delivery' },
      { id: '4', icon: 'shopping-bag', title: 'Wide Products' },
    ],
  },
  grocery: {
    storeNameLine1: 'FRESH',
    storeNameLine2: 'SUPERMART',
    bannerText: 'Instant Payment',
    paymentMode: 'upi',
    upiId: 'freshmart@okaxis',
    payeeName: 'Fresh Supermart',
    amount: '',
    qrCenterType: 'text',
    qrCenterText: 'FM',
    theme: 'emerald',
    features: [
      { id: '1', icon: 'shield', title: '100% Organic' },
      { id: '2', icon: 'bolt', title: 'Express Billing' },
      { id: '3', icon: 'truck', title: 'Daily Fresh' },
      { id: '4', icon: 'shopping-bag', title: 'Best Price' },
    ],
  },
  boutique: {
    storeNameLine1: 'ROYAL',
    storeNameLine2: 'COLLECTIONS',
    bannerText: 'Scan & Pay Here',
    paymentMode: 'upi',
    upiId: 'royalcollections@upi',
    payeeName: 'Royal Collections',
    amount: '',
    qrCenterType: 'text',
    qrCenterText: 'RC',
    theme: 'purple',
    features: [
      { id: '1', icon: 'shield', title: 'Top Brands' },
      { id: '2', icon: 'bolt', title: 'Easy Returns' },
      { id: '3', icon: 'award', title: 'Premium Fabric' },
      { id: '4', icon: 'shopping-bag', title: 'New Arrivals' },
    ],
  },
};

export default function PosterEditor({
  config,
  onChange,
  onDownload,
  onPrint,
  isDownloading = false,
  autoRotateTheme = true,
  onToggleAutoRotateTheme,
}: PosterEditorProps) {
  const [activeTab, setActiveTab] = useState<'store' | 'payment' | 'theme' | 'features'>('store');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleUpdate = (field: keyof PosterConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleFeatureUpdate = (index: number, field: 'title' | 'icon', value: string) => {
    const updated = [...config.features];
    updated[index] = { ...updated[index], [field]: value };
    handleUpdate('features', updated);
  };

  const handleApplyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (preset) {
      onChange({
        ...config,
        ...preset,
      } as PosterConfig);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({
            ...config,
            qrCenterType: 'image',
            qrCenterImage: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyLink = () => {
    const link =
      config.paymentMode === 'upi'
        ? `upi://pay?pa=${config.upiId}&pn=${encodeURIComponent(config.payeeName || 'Store')}${
            config.amount ? `&am=${config.amount}` : ''
          }&cu=${config.currency || 'INR'}`
        : config.customQrData;

    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5 shadow-2xl flex flex-col space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide flex items-center gap-2">
            <span className="text-pink-500">Poster</span> Studio
          </h2>
          <p className="text-xs text-gray-400">
            Customize branding, live UPI payments, colors & layout
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-500 font-medium">Presets:</span>
          <button
            onClick={() => handleApplyPreset('kherwal')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-950 text-pink-300 border border-pink-800 hover:bg-pink-900 transition"
          >
            Kherwal
          </button>
          <button
            onClick={() => handleApplyPreset('grocery')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition"
          >
            Grocery
          </button>
          <button
            onClick={() => handleApplyPreset('boutique')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-950 text-purple-300 border border-purple-800 hover:bg-purple-900 transition"
          >
            Fashion
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-gray-950 rounded-2xl border border-gray-800">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'store'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Store</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'payment'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Payment</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'theme'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('features')}
          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'features'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Badges</span>
        </button>
      </div>

      {/* Tab 1: Store & Branding */}
      {activeTab === 'store' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Store Title (Line 1 - White)
              </label>
              <input
                type="text"
                value={config.storeNameLine1}
                onChange={(e) => handleUpdate('storeNameLine1', e.target.value)}
                placeholder="e.g. KHERWAL"
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Store Title (Line 2 - Gold)
              </label>
              <input
                type="text"
                value={config.storeNameLine2}
                onChange={(e) => handleUpdate('storeNameLine2', e.target.value)}
                placeholder="e.g. BAZAAR"
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Banner Pill Text
            </label>
            <input
              type="text"
              value={config.bannerText}
              onChange={(e) => handleUpdate('bannerText', e.target.value)}
              placeholder="e.g. Scan QR Code & Pay"
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Poster Footer Note
            </label>
            <input
              type="text"
              value={config.footerText || ''}
              onChange={(e) => handleUpdate('footerText', e.target.value)}
              placeholder="e.g. Thank you for shopping with us! Visit again"
              className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
            />
          </div>

          {/* QR Center Badge */}
          <div className="pt-2 border-t border-gray-800">
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              QR Center Watermark / Logo
            </label>
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleUpdate('qrCenterType', 'text')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg border transition ${
                  config.qrCenterType === 'text'
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-gray-950 border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
              >
                Text Badge
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('qrCenterType', 'image')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg border transition ${
                  config.qrCenterType === 'image'
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-gray-950 border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
              >
                Custom Logo
              </button>
              <button
                type="button"
                onClick={() => handleUpdate('qrCenterType', 'none')}
                className={`flex-1 py-1.5 px-3 text-xs font-bold rounded-lg border transition ${
                  config.qrCenterType === 'none'
                    ? 'bg-pink-600 border-pink-500 text-white'
                    : 'bg-gray-950 border-gray-700 text-gray-300 hover:bg-gray-800'
                }`}
              >
                None
              </button>
            </div>

            {config.qrCenterType === 'text' && (
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">
                  Badge Letters (Max 2-3 characters recommended)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={config.qrCenterText}
                  onChange={(e) => handleUpdate('qrCenterText', e.target.value.toUpperCase())}
                  placeholder="KB"
                  className="w-24 bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-center uppercase font-black text-pink-500 focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            )}

            {config.qrCenterType === 'image' && (
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-950 border border-dashed border-gray-600 rounded-xl hover:border-pink-500 text-xs text-gray-300 transition">
                  <Upload className="w-4 h-4 text-pink-500" />
                  <span>Upload Logo (PNG / JPG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {config.qrCenterImage && (
                  <button
                    onClick={() => handleUpdate('qrCenterImage', null)}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Payment & QR Data */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-1 bg-gray-950 rounded-xl border border-gray-800">
            <button
              onClick={() => handleUpdate('paymentMode', 'upi')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                config.paymentMode === 'upi'
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              UPI Payment QR (India)
            </button>
            <button
              onClick={() => handleUpdate('paymentMode', 'custom')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                config.paymentMode === 'custom'
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Custom URL / Text
            </button>
          </div>

          {config.paymentMode === 'upi' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  UPI ID (VPA) <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={config.upiId}
                  onChange={(e) => handleUpdate('upiId', e.target.value)}
                  placeholder="e.g. kherwalbazaar@upi or 9876543210@paytm"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition font-mono"
                />
                <p className="text-[11px] text-gray-500 mt-1">
                  Works seamlessly with Google Pay, PhonePe, Paytm, BHIM & Bank UPI apps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Payee / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={config.payeeName}
                    onChange={(e) => handleUpdate('payeeName', e.target.value)}
                    placeholder="e.g. Kherwal Bazaar"
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Fixed Amount (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-gray-500">₹</span>
                    <input
                      type="number"
                      value={config.amount}
                      onChange={(e) => handleUpdate('amount', e.target.value)}
                      placeholder="Leave blank for any"
                      className="w-full bg-gray-950 border border-gray-700 rounded-xl pl-7 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Transaction Note (Optional)
                </label>
                <input
                  type="text"
                  value={config.transactionNote}
                  onChange={(e) => handleUpdate('transactionNote', e.target.value)}
                  placeholder="e.g. Store purchase"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Target URL or QR Payload
              </label>
              <textarea
                rows={3}
                value={config.customQrData}
                onChange={(e) => handleUpdate('customQrData', e.target.value)}
                placeholder="https://example.com or any text"
                className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition font-mono"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Theme & Styling */}
      {activeTab === 'theme' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-2">
              Color Theme Palettes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(THEME_STYLES) as Array<PosterConfig['theme']>).map((themeKey) => {
                const style = THEME_STYLES[themeKey];
                const isSelected = config.theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => handleUpdate('theme', themeKey)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-pink-500 bg-gray-800/80 shadow-md ring-1 ring-pink-500'
                        : 'border-gray-800 bg-gray-950 hover:bg-gray-800/40'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${style.bgClass} flex-shrink-0 shadow`}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{style.name}</div>
                      <div className="text-[10px] text-gray-400 capitalize">{themeKey} gradient</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-pink-500 ${autoRotateTheme ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <div>
                <div className="text-xs font-semibold text-white">Random Theme Switcher (30s)</div>
                <div className="text-[11px] text-gray-400">
                  Automatically changes theme colors every 30 seconds
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoRotateTheme}
                onChange={onToggleAutoRotateTheme}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-white">Payment Provider Logos</div>
              <div className="text-[11px] text-gray-400">
                Display GPay, PhonePe, Paytm & UPI logos
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.showPaymentLogos}
                onChange={(e) => handleUpdate('showPaymentLogos', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* Tab 4: Badges & Features */}
      {activeTab === 'features' && (
        <div className="space-y-3">
          <div className="text-xs text-gray-400 mb-2">
            Customize the 4 highlight pills displayed at the bottom of the poster:
          </div>

          {config.features.map((feature, idx) => (
            <div
              key={feature.id}
              className="flex items-center gap-2 p-2 bg-gray-950 rounded-xl border border-gray-800"
            >
              <span className="text-xs font-bold text-gray-500 w-4">#{idx + 1}</span>
              <select
                value={feature.icon}
                onChange={(e) => handleFeatureUpdate(idx, 'icon', e.target.value)}
                className="bg-gray-900 border border-gray-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-pink-500"
              >
                <option value="shield">Shield</option>
                <option value="bolt">Bolt</option>
                <option value="truck">Truck</option>
                <option value="shopping-bag">Bag</option>
                <option value="lock">Lock</option>
                <option value="award">Award</option>
                <option value="headphones">Support</option>
              </select>

              <input
                type="text"
                value={feature.title}
                onChange={(e) => handleFeatureUpdate(idx, 'title', e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-pink-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-95 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Generating Image...' : 'Download High-Res PNG'}</span>
        </button>

        <button
          onClick={onPrint}
          className="w-full sm:w-auto py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-700 flex items-center justify-center gap-2 transition"
        >
          <Printer className="w-4 h-4 text-yellow-300" />
          <span>Print</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-gray-700 flex items-center justify-center gap-2 transition"
          title="Copy Payment Link / Data"
        >
          {copiedLink ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-cyan-400" />
          )}
          <span>{copiedLink ? 'Copied' : 'Copy'}</span>
        </button>

        <button
          onClick={() => onChange(DEFAULT_POSTER_CONFIG)}
          className="p-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-700 transition"
          title="Reset to Original Kherwal Bazaar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
