'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Zap,
  Truck,
  ShoppingBag,
  ShoppingCart,
  Shirt,
  QrCode,
  Sparkles,
  Lock,
  Headphones,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { PosterConfig, THEME_STYLES } from '@/types/poster';

interface PosterPreviewProps {
  config: PosterConfig;
  posterRef?: React.RefObject<HTMLDivElement>;
  scale?: number;
}

export const getIconComponent = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'shield':
    case 'security':
      return <ShieldCheck className="w-5 h-5 text-yellow-300" />;
    case 'bolt':
    case 'zap':
    case 'fast':
      return <Zap className="w-5 h-5 text-yellow-300" />;
    case 'truck':
    case 'delivery':
      return <Truck className="w-5 h-5 text-yellow-300" />;
    case 'shopping-bag':
    case 'bag':
      return <ShoppingBag className="w-5 h-5 text-yellow-300" />;
    case 'lock':
      return <Lock className="w-5 h-5 text-yellow-300" />;
    case 'headphones':
    case 'support':
      return <Headphones className="w-5 h-5 text-yellow-300" />;
    case 'award':
    case 'quality':
      return <Award className="w-5 h-5 text-yellow-300" />;
    default:
      return <CheckCircle2 className="w-5 h-5 text-yellow-300" />;
  }
};

export default function PosterPreview({
  config,
  posterRef,
  scale = 1,
}: PosterPreviewProps) {
  const theme = THEME_STYLES[config.theme] || THEME_STYLES.crimson;

  // Construct UPI or Custom link
  const qrValue = React.useMemo(() => {
    if (config.paymentMode === 'upi') {
      const vpa = config.upiId.trim() || '9583252256-3@axl';
      const name = encodeURIComponent(config.payeeName.trim() || 'Kherwal Bazaar');
      const currency = config.currency.trim() || 'INR';
      let url = `upi://pay?pa=${vpa}&pn=${name}&cu=${currency}`;
      if (config.amount && parseFloat(config.amount) > 0) {
        url += `&am=${config.amount.trim()}`;
      }
      if (config.transactionNote.trim()) {
        url += `&tn=${encodeURIComponent(config.transactionNote.trim())}`;
      }
      return url;
    }
    return config.customQrData.trim() || 'https://kherwalbazaar.com';
  }, [config]);

  return (
    <div
      className="flex items-center justify-center transition-transform duration-200 select-none print:m-0 print:p-0 my-3 md:my-0 pb-6 md:pb-0"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Poster Container (Ratio ~ 1:1.45) */}
      <div
        ref={posterRef}
        id="poster-canvas"
        className={`relative w-full max-w-[440px] aspect-[1/1.45] poster-bg-${config.theme} rounded-none shadow-2xl overflow-hidden flex flex-col justify-between p-4 sm:p-6 pb-6 sm:pb-8 text-white print-area transition-all duration-1000 ease-in-out`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
        }}
      >
        {/* Decorative Background Sweeping Green / Accent Waves */}
        <div
          className={`absolute inset-x-0 top-[25%] h-[60%] ${theme.waveColor1} rounded-[100%] scale-150 z-0 opacity-90 pointer-events-none transform -rotate-6 transition-all duration-1000 ease-in-out`}
        />
        <div
          className={`absolute inset-x-0 top-[30%] h-[55%] ${theme.waveColor2} rounded-[100%] scale-150 z-0 opacity-80 pointer-events-none transform rotate-3 transition-all duration-1000 ease-in-out`}
        />

        {/* TOP SECTION: Icons & Store Title */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Top Floating Decorative Shopping Icons & Yellow Flashes */}
          <div className="w-full flex justify-between items-center px-4 mb-1">
            {/* Left Bag Icon */}
            <div
              className={`${theme.topBadgeBg} p-2 rounded-2xl border ${theme.topBadgeBorder} shadow-md transform -rotate-12 transition-transform hover:scale-110`}
            >
              <ShoppingBag className="w-5 h-5 text-yellow-300" />
            </div>

            {/* Center Shopping Cart */}
            <div className="flex flex-col items-center">
              <div
                className={`relative bg-white ${theme.cartText} px-3 py-1.5 rounded-2xl border-4 ${theme.cartBorder} shadow-xl transform hover:scale-105 transition`}
              >
                <ShoppingCart className="w-6 h-6 stroke-[2.5]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full" />
              </div>
            </div>

            {/* Right T-shirt Icon */}
            <div
              className={`${theme.topBadgeBg} p-2 rounded-2xl border ${theme.topBadgeBorder} shadow-md transform rotate-12 transition-transform hover:scale-110`}
            >
              <Shirt className="w-5 h-5 text-yellow-300" />
            </div>
          </div>

          {/* Yellow Flash Accents around Cart */}
          <div className="w-full flex justify-between px-16 -mt-2 mb-1">
            <div className="w-6 h-2 bg-yellow-300 transform -rotate-45 rounded-full shadow-sm" />
            <div className="w-6 h-2 bg-yellow-300 transform rotate-45 rounded-full shadow-sm" />
          </div>

          {/* STORE TITLE: Line 1 & Line 2 */}
          <div className="text-center relative my-1">
            {/* Green Accent Dashes under title */}
            <div className="absolute -bottom-2 left-0 right-0 flex justify-between px-6 opacity-80 pointer-events-none">
              <div className="w-12 h-3 bg-green-500 transform -rotate-12 rounded-full shadow" />
              <div className="w-12 h-3 bg-green-500 transform rotate-12 rounded-full shadow" />
            </div>

            {/* Line 1 (White Bold Text with heavy black stroke) */}
            <h1
              className="text-4xl sm:text-5xl font-black italic tracking-wider text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] leading-tight uppercase font-poppins text-stroke-thick"
              style={{
                WebkitTextStroke: '6px #000',
                paintOrder: 'stroke fill',
              }}
            >
              {config.storeNameLine1 || 'KHERWAL'}
            </h1>

            {/* Line 2 (Golden Yellow gradient with heavy black stroke) */}
            <h2
              className="text-4xl sm:text-5xl font-black italic tracking-wider gold-yellow-gradient drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] -mt-2 uppercase font-poppins"
              style={{
                WebkitTextStroke: '5px #000',
                paintOrder: 'stroke fill',
              }}
            >
              {config.storeNameLine2 || 'BAZAAR'}
            </h2>
          </div>

          {/* SCAN QR CODE & PAY BANNER */}
          <div className="mt-2 relative z-20 w-full max-w-[320px]">
            <div className="banner-gradient py-2.5 px-6 rounded-full text-center border-2 border-yellow-300 shadow-xl flex items-center justify-center space-x-2">
              <QrCode className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-white font-extrabold text-base sm:text-lg tracking-wide uppercase drop-shadow">
                {config.bannerText || 'Scan QR Code & Pay'}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: DYNAMIC QR CODE CARD */}
        <div className="relative z-10 flex justify-center my-auto py-2">
          <div
            className={`bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-4 ${theme.bracketColor} relative w-[250px] sm:w-[275px] aspect-square flex items-center justify-center`}
          >
            {/* Corner Accent L-Brackets */}
            <div
              className={`absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 ${theme.bracketColor} rounded-tl-lg pointer-events-none`}
            />
            <div
              className={`absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 ${theme.bracketColor} rounded-tr-lg pointer-events-none`}
            />
            <div
              className={`absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 ${theme.bracketColor} rounded-bl-lg pointer-events-none`}
            />
            <div
              className={`absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 ${theme.bracketColor} rounded-br-lg pointer-events-none`}
            />

            {/* High Definition Scannable QR Code */}
            <div className="relative flex items-center justify-center p-1 bg-white rounded-xl">
              <QRCodeSVG
                value={qrValue}
                size={220}
                level="H"
                includeMargin={false}
                className="w-full h-full max-w-[210px] max-h-[210px]"
              />

              {/* Center Logo / Watermark Badge */}
              {config.qrCenterType === 'text' && config.qrCenterText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`bg-white px-2.5 py-1 rounded-md shadow-lg border-2 ${theme.bracketColor} ${theme.cartText} font-black text-sm tracking-wider uppercase transform hover:scale-110 transition`}
                  >
                    {config.qrCenterText}
                  </div>
                </div>
              )}

              {config.qrCenterType === 'image' && config.qrCenterImage && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.qrCenterImage}
                    alt="Store Logo"
                    className="w-12 h-12 object-contain bg-white p-1 rounded-lg shadow-md border-2 border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Payment Apps & Features Footer */}
        <div className="relative z-10 flex flex-col space-y-2.5 mt-2">
          {/* Payment Provider Logos Card */}
          {config.showPaymentLogos && (
            <div className="bg-white rounded-2xl py-2 px-3 shadow-lg flex items-center justify-between text-black">
              {/* Google Pay */}
              <div className="flex flex-col items-center flex-1 border-r border-gray-300 pr-1">
                <div className="flex items-center space-x-0.5 font-bold">
                  <span className="text-blue-600 font-extrabold text-base sm:text-lg">G</span>
                  <span className="text-red-500 font-extrabold text-base sm:text-lg">P</span>
                  <span className="text-yellow-500 font-extrabold text-base sm:text-lg">a</span>
                  <span className="text-green-600 font-extrabold text-base sm:text-lg">y</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 -mt-0.5">
                  G Pay
                </span>
              </div>

              {/* PhonePe */}
              <div className="flex flex-col items-center flex-1 border-r border-gray-300 px-1">
                <div className="bg-[#5f259f] text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow">
                  पे
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 mt-0.5">
                  PhonePe
                </span>
              </div>

              {/* Paytm */}
              <div className="flex flex-col items-center flex-1 border-r border-gray-300 px-1">
                <div className="flex items-center font-black italic text-xs tracking-tighter">
                  <span className="text-[#002e6e] text-sm">Pay</span>
                  <span className="text-[#00b9f5] text-sm">tm</span>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 mt-0.5">
                  Paytm
                </span>
              </div>

              {/* UPI */}
              <div className="flex flex-col items-center flex-1 pl-1">
                <div className="flex items-center text-xs sm:text-sm font-black italic text-gray-800">
                  <span>UPI</span>
                  <div className="flex ml-0.5">
                    <div className="w-1.5 h-3 bg-orange-500 transform skew-x-12" />
                    <div className="w-1.5 h-3 bg-green-600 transform skew-x-12" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-800 mt-0.5">
                  UPI
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Features Banner Section */}
          <div className="bg-black/25 backdrop-blur-md rounded-2xl p-2 border border-white/10 shadow-xl">
            <div className="grid grid-cols-4 gap-1 text-center text-white">
              {config.features.map((feature, idx) => (
                <div
                  key={feature.id}
                  className={`flex flex-col items-center ${
                    idx < config.features.length - 1 ? 'border-r border-white/20 pr-1' : 'pl-1'
                  }`}
                >
                  <div className="bg-white/20 p-1.5 sm:p-2 rounded-xl mb-1 shadow-inner">
                    {getIconComponent(feature.icon)}
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-extrabold leading-tight tracking-tight">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Thank You Banner Section */}
          {config.footerText && (
            <div className="text-center pt-1.5 pb-0.5">
              <p className="text-[10px] sm:text-xs font-black tracking-wider text-yellow-300 drop-shadow flex items-center justify-center gap-1.5 uppercase font-poppins">
                <span className="text-xs">✨</span>
                <span>{config.footerText}</span>
                <span className="text-xs">✨</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
