'use client';

import React, { useEffect, useState } from 'react';
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
  Tag,
  Gift,
  Store,
  CreditCard,
  Wallet,
  Percent,
  Package,
} from 'lucide-react';
import { PosterConfig } from '@/types/poster';

interface PosterPreviewProps {
  config: PosterConfig;
  scale?: number;
}

interface DecorIcon {
  Icon: typeof ShoppingCart;
  style: React.CSSProperties;
  rotate: string;
  size: string;
  color: string;
  lightColor: string;
}

/** Rotating poster backgrounds: medium pink, blue, green, yellow-white. */
const AUTO_BG_THEMES = [
  {
    id: 'pink',
    label: 'Medium Pink',
    bgClass: 'poster-bg-cycle-pink',
    isLight: false,
    waveColor1: 'bg-[#e6005c]',
    waveColor2: 'bg-[#a61e4d]',
    topBadgeBg: 'bg-pink-600/60',
    topBadgeBorder: 'border-pink-400',
    bracketColor: 'border-pink-600',
    strokeColor: 'border-[#a30045]',
    cartText: 'text-pink-600',
    iconColor: 'text-yellow-300',
  },
  {
    id: 'blue',
    label: 'Blue',
    bgClass: 'poster-bg-cycle-blue',
    isLight: false,
    waveColor1: 'bg-[#3b82f6]',
    waveColor2: 'bg-[#1e40af]',
    topBadgeBg: 'bg-blue-600/60',
    topBadgeBorder: 'border-blue-400',
    bracketColor: 'border-blue-600',
    strokeColor: 'border-[#1e40af]',
    cartText: 'text-blue-600',
    iconColor: 'text-yellow-300',
  },
  {
    id: 'green',
    label: 'Green',
    bgClass: 'poster-bg-cycle-green',
    isLight: false,
    waveColor1: 'bg-[#10b981]',
    waveColor2: 'bg-[#047857]',
    topBadgeBg: 'bg-emerald-600/60',
    topBadgeBorder: 'border-emerald-400',
    bracketColor: 'border-emerald-600',
    strokeColor: 'border-[#166534]',
    cartText: 'text-emerald-700',
    iconColor: 'text-yellow-300',
  },
  {
    id: 'yellow',
    label: 'Yellow White',
    bgClass: 'poster-bg-cycle-yellow',
    isLight: true,
    waveColor1: 'bg-[#fde68a]',
    waveColor2: 'bg-[#fcd34d]',
    topBadgeBg: 'bg-[#a30045]/10',
    topBadgeBorder: 'border-[#a30045]/40',
    bracketColor: 'border-[#a30045]',
    strokeColor: 'border-[#b8860b]',
    cartText: 'text-[#a30045]',
    iconColor: 'text-[#a30045]',
  },
] as const;

const AUTO_BG_INTERVAL_MS = 20000;

/** Shopping-themed icons scattered across the poster's blank background areas. */
const DECORATIVE_ICONS: DecorIcon[] = [
  { Icon: ShoppingCart, style: { left: '24%', top: '2%' }, rotate: '-10deg', size: 'w-5 h-5', color: 'text-yellow-300/30', lightColor: 'text-[#a30045]/25' },
  { Icon: Tag, style: { left: '37%', top: '3%' }, rotate: '14deg', size: 'w-4 h-4', color: 'text-white/25', lightColor: 'text-[#7a0038]/20' },
  { Icon: Gift, style: { left: '50%', top: '2%' }, rotate: '-8deg', size: 'w-6 h-6', color: 'text-yellow-300/30', lightColor: 'text-[#a30045]/25' },
  { Icon: Shirt, style: { left: '63%', top: '3%' }, rotate: '12deg', size: 'w-5 h-5', color: 'text-white/25', lightColor: 'text-[#7a0038]/20' },
  { Icon: Percent, style: { left: '76%', top: '2%' }, rotate: '-16deg', size: 'w-4 h-4', color: 'text-yellow-300/35', lightColor: 'text-[#a30045]/30' },
  { Icon: ShoppingCart, style: { left: '0.5%', top: '12%' }, rotate: '-18deg', size: 'w-6 h-6', color: 'text-white/25', lightColor: 'text-[#7a0038]/20' },
  { Icon: Tag, style: { right: '0.5%', top: '13%' }, rotate: '18deg', size: 'w-5 h-5', color: 'text-yellow-300/30', lightColor: 'text-[#a30045]/25' },
  { Icon: ShoppingCart, style: { left: '0.5%', top: '22%' }, rotate: '-12deg', size: 'w-7 h-7', color: 'text-white/30', lightColor: 'text-[#7a0038]/25' },
  { Icon: Tag, style: { left: '0.5%', top: '31%' }, rotate: '15deg', size: 'w-5 h-5', color: 'text-yellow-300/35', lightColor: 'text-[#a30045]/30' },
  { Icon: Gift, style: { left: '0.5%', top: '40%' }, rotate: '-8deg', size: 'w-7 h-7', color: 'text-white/25', lightColor: 'text-[#7a0038]/20' },
  { Icon: Store, style: { left: '0.5%', top: '50%' }, rotate: '12deg', size: 'w-6 h-6', color: 'text-yellow-300/30', lightColor: 'text-[#a30045]/25' },
  { Icon: Shirt, style: { left: '0.5%', top: '59%' }, rotate: '-14deg', size: 'w-7 h-7', color: 'text-white/30', lightColor: 'text-[#7a0038]/25' },
  { Icon: Percent, style: { left: '0.5%', top: '67%' }, rotate: '8deg', size: 'w-5 h-5', color: 'text-yellow-300/35', lightColor: 'text-[#a30045]/30' },
  { Icon: Shirt, style: { right: '0.5%', top: '23%' }, rotate: '12deg', size: 'w-7 h-7', color: 'text-white/30', lightColor: 'text-[#7a0038]/25' },
  { Icon: ShoppingBag, style: { right: '0.5%', top: '32%' }, rotate: '-15deg', size: 'w-6 h-6', color: 'text-yellow-300/35', lightColor: 'text-[#a30045]/30' },
  { Icon: CreditCard, style: { right: '0.5%', top: '41%' }, rotate: '8deg', size: 'w-7 h-7', color: 'text-white/25', lightColor: 'text-[#7a0038]/20' },
  { Icon: Wallet, style: { right: '0.5%', top: '51%' }, rotate: '-10deg', size: 'w-6 h-6', color: 'text-yellow-300/30', lightColor: 'text-[#a30045]/25' },
  { Icon: Tag, style: { right: '0.5%', top: '60%' }, rotate: '14deg', size: 'w-7 h-7', color: 'text-white/30', lightColor: 'text-[#7a0038]/25' },
  { Icon: Package, style: { right: '0.5%', top: '68%' }, rotate: '-6deg', size: 'w-5 h-5', color: 'text-yellow-300/35', lightColor: 'text-[#a30045]/30' },
];

export const getIconComponent = (iconName: string, colorClass = 'text-yellow-300') => {
  switch (iconName.toLowerCase()) {
    case 'shield':
    case 'security':
      return <ShieldCheck className={`w-5 h-5 ${colorClass}`} />;
    case 'bolt':
    case 'zap':
    case 'fast':
      return <Zap className={`w-5 h-5 ${colorClass}`} />;
    case 'truck':
    case 'delivery':
      return <Truck className={`w-5 h-5 ${colorClass}`} />;
    case 'shopping-bag':
    case 'bag':
      return <ShoppingBag className={`w-5 h-5 ${colorClass}`} />;
    case 'lock':
      return <Lock className={`w-5 h-5 ${colorClass}`} />;
    case 'headphones':
    case 'support':
      return <Headphones className={`w-5 h-5 ${colorClass}`} />;
    case 'award':
    case 'quality':
      return <Award className={`w-5 h-5 ${colorClass}`} />;
    default:
      return <CheckCircle2 className={`w-5 h-5 ${colorClass}`} />;
  }
};

export default function PosterPreview({
  config,
  scale = 1,
}: PosterPreviewProps) {
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setBgIndex((current) => (current + 1) % AUTO_BG_THEMES.length);
    }, AUTO_BG_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  const theme = AUTO_BG_THEMES[bgIndex];
  const isLight = theme.isLight;
  const totalAmount =
    config.amount && parseFloat(config.amount) > 0 ? config.amount.trim() : '000';
  const [totalWhole, totalFraction] = totalAmount.split('.');
  const totalDecimals = (totalFraction ?? '').padEnd(2, '0').slice(0, 2);

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
      className="poster-wrap h-full min-h-0 w-auto max-w-full aspect-[1/1.86] flex items-center justify-center transition-transform duration-200 select-none print:m-0 print:p-0 m-0"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* Poster Container (Ratio ~ 1:1.86) */}
      <div
        id="poster-canvas"
        className={`poster-stage relative h-full w-full max-w-[440px] aspect-auto ${theme.bgClass} rounded-none shadow-2xl overflow-hidden flex flex-col justify-between py-4 px-2 pb-5 print-area`}
        style={{
          color: isLight ? '#5c0027' : '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
        }}
      >
        {/* Decorative Background Sweeping Green / Accent Waves */}
        <div
          className={`absolute inset-x-0 top-[25%] h-[60%] ${theme.waveColor1} rounded-[100%] scale-150 z-0 ${isLight ? 'opacity-50' : 'opacity-90'} pointer-events-none transform -rotate-6`}
        />
        <div
          className={`absolute inset-x-0 top-[30%] h-[55%] ${theme.waveColor2} rounded-[100%] scale-150 z-0 ${isLight ? 'opacity-40' : 'opacity-80'} pointer-events-none transform rotate-3`}
        />

        {/* Decorative shopping icons scattered across the blank background */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {DECORATIVE_ICONS.map(({ Icon, style, rotate, size, color, lightColor }, idx) => (
            <Icon
              key={idx}
              className={`absolute ${size} ${isLight ? lightColor : color}`}
              style={{ ...style, transform: `rotate(${rotate})` }}
              strokeWidth={1.8}
            />
          ))}
        </div>

        {/* TOP SECTION: Icons & Store Title */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Top Floating Decorative Shopping Icons & Yellow Flashes */}
          <div className="w-full flex justify-between items-center px-4 mb-1">
            {/* Left Bag Icon */}
            <div
              className={`${theme.topBadgeBg} p-2 rounded-2xl border ${theme.topBadgeBorder} shadow-md transform -rotate-12 transition-transform hover:scale-110`}
            >
              <ShoppingBag className={`w-5 h-5 ${isLight ? 'text-[#a30045]' : 'text-yellow-300'}`} />
            </div>

            {/* Right T-shirt Icon */}
            <div
              className={`${theme.topBadgeBg} p-2 rounded-2xl border ${theme.topBadgeBorder} shadow-md transform rotate-12 transition-transform hover:scale-110`}
            >
              <Shirt className={`w-5 h-5 ${isLight ? 'text-[#a30045]' : 'text-yellow-300'}`} />
            </div>
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
              className="text-4xl font-black italic tracking-wider text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] leading-tight uppercase font-poppins text-stroke-thick"
              style={{
                WebkitTextStroke: '6px #000',
                paintOrder: 'stroke fill',
              }}
            >
              {config.storeNameLine1 || 'KHERWAL'}
            </h1>

            {/* Line 2 (Golden Yellow gradient with heavy black stroke) */}
            <h2
              className="text-4xl font-black italic tracking-wider gold-yellow-gradient drop-shadow-[0_5px_5px_rgba(0,0,0,0.9)] -mt-2 uppercase font-poppins"
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
              <span className="text-white font-extrabold text-base tracking-wide uppercase drop-shadow">
                {config.bannerText || 'Scan QR Code & Pay'}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER SECTION: DYNAMIC QR CODE CARD */}
        <div className="relative z-10 flex justify-center my-auto py-1">
          <div
            className={`bg-white p-2 rounded-3xl shadow-2xl border-[6px] ${theme.strokeColor} relative w-[calc(100%_+_16px)] max-w-[400px] shrink-0 aspect-square flex items-center justify-center`}
          >
            {/* Corner Accent L-Brackets */}
            <div
              className={`absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 ${theme.strokeColor} rounded-tl-lg pointer-events-none`}
            />
            <div
              className={`absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 ${theme.strokeColor} rounded-tr-lg pointer-events-none`}
            />
            <div
              className={`absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 ${theme.strokeColor} rounded-bl-lg pointer-events-none`}
            />
            <div
              className={`absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 ${theme.strokeColor} rounded-br-lg pointer-events-none`}
            />

            {/* High Definition Scannable QR Code */}
            <div className="poster-qr relative flex aspect-square items-center justify-center bg-white rounded-xl">
              <QRCodeSVG
                value={qrValue}
                size={352}
                level="H"
                includeMargin={false}
                className="w-full h-full max-w-[352px] max-h-[352px]"
              />

              {/* Center Logo / Watermark Badge */}
              {config.qrCenterType === 'text' && config.qrCenterText && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div
                    className={`bg-white px-2.5 py-1 rounded-md shadow-lg border-2 ${theme.strokeColor} ${theme.cartText} font-black text-sm tracking-wider uppercase transform hover:scale-110 transition`}
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
                    loading="eager"
                    decoding="sync"
                    className={`w-16 h-16 object-contain bg-white p-1 rounded-xl shadow-md border-2 ${theme.strokeColor}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TOTAL AMOUNT (directly below the QR) */}
        <div className="relative z-10 flex justify-center -mt-0.5 mb-1">
          <div className="bg-white rounded-full pl-4 pr-5 py-1 shadow-lg border-2 border-[#a30045] flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#7a0038]">
              Total
            </span>
            <span className="text-lg font-black leading-none text-[#a30045]">
              ₹{totalWhole}
              <span className="text-xs font-bold text-gray-400">.{totalDecimals}</span>
            </span>
          </div>
        </div>

        {/* LOWER SECTION: Payment Apps & Features Footer */}
        <div className="relative z-10 flex flex-col gap-2 mt-1">
          {/* Payment Provider Logos Card */}
          {config.showPaymentLogos && (
            <div className="bg-white rounded-2xl py-1.5 px-2 shadow-lg flex items-center justify-between text-black">
              {/* Google Pay */}
              <div className="flex flex-col items-center flex-1 border-r border-gray-300 pr-1">
                <div className="flex items-center space-x-0.5 font-bold">
                  <span className="text-blue-600 font-extrabold text-base">G</span>
                  <span className="text-red-500 font-extrabold text-base">P</span>
                  <span className="text-yellow-500 font-extrabold text-base">a</span>
                  <span className="text-green-600 font-extrabold text-base">y</span>
                </div>
                <span className="text-[10px] font-bold text-gray-800 -mt-0.5">
                  G Pay
                </span>
              </div>

              {/* PhonePe */}
              <div className="flex flex-col items-center flex-1 border-r border-gray-300 px-1">
                <div className="bg-[#5f259f] text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow">
                  पे
                </div>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">
                  PhonePe
                </span>
              </div>

              {/* Paytm */}
              <div className="flex flex-col items-center flex-1 border-r border-gray-300 px-1">
                <div className="flex items-center font-black italic text-xs tracking-tighter">
                  <span className="text-[#002e6e] text-sm">Pay</span>
                  <span className="text-[#00b9f5] text-sm">tm</span>
                </div>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">
                  Paytm
                </span>
              </div>

              {/* UPI */}
              <div className="flex flex-col items-center flex-1 pl-1">
                <div className="flex items-center text-xs font-black italic text-gray-800">
                  <span>UPI</span>
                  <div className="flex ml-0.5">
                    <div className="w-1.5 h-3 bg-orange-500 transform skew-x-12" />
                    <div className="w-1.5 h-3 bg-green-600 transform skew-x-12" />
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-800 mt-0.5">
                  UPI
                </span>
              </div>
            </div>
          )}

          {/* Enhanced Features Banner Section */}
          <div
            className={`rounded-2xl p-2 border shadow-xl mb-2 ${
              isLight
                ? 'bg-[#a30045]/10 border-[#a30045]/20'
                : 'bg-black/25 border-white/10 backdrop-blur-md'
            }`}
          >
            <div className={`grid grid-cols-4 gap-1 text-center ${isLight ? 'text-[#5c0027]' : 'text-white'}`}>
              {config.features.map((feature, idx) => (
                <div
                  key={feature.id}
                  className={`flex flex-col items-center ${
                    idx < config.features.length - 1
                      ? `border-r pr-1 ${isLight ? 'border-[#a30045]/20' : 'border-white/20'}`
                      : 'pl-1'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl mb-1 shadow-inner ${isLight ? 'bg-[#a30045]/10' : 'bg-white/20'}`}>
                    {getIconComponent(feature.icon, theme.iconColor)}
                  </div>
                  <span className="text-[9px] font-extrabold leading-tight tracking-tight">
                    {feature.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Thank You Banner Section */}
          {config.footerText && (
            <div className="relative -top-3 text-center pt-1 pb-0">
              <p
                className={`text-[10px] font-black tracking-wider drop-shadow flex items-center justify-center gap-1.5 uppercase font-poppins ${
                  isLight ? 'text-[#a30045]' : 'text-yellow-300'
                }`}
              >
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
