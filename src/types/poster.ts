export interface PosterFeature {
  id: string;
  icon: string;
  title: string;
}

export interface PosterConfig {
  storeNameLine1: string;
  storeNameLine2: string;
  bannerText: string;
  footerText: string;
  paymentMode: 'upi' | 'custom';
  upiId: string;
  payeeName: string;
  amount: string;
  currency: string;
  transactionNote: string;
  customQrData: string;
  qrCenterType: 'text' | 'image' | 'none';
  qrCenterText: string;
  qrCenterImage: string | null;
  theme: 'crimson' | 'emerald' | 'royal' | 'purple';
  showPaymentLogos: boolean;
  features: PosterFeature[];
}

export const DEFAULT_POSTER_CONFIG: PosterConfig = {
  storeNameLine1: 'KHERWAL',
  storeNameLine2: 'BAZAAR',
  bannerText: 'Scan QR Code & Pay',
  footerText: 'Thank you for shopping with us! Visit again',
  paymentMode: 'upi',
  upiId: '9583252256-3@axl',
  payeeName: 'Kherwal Bazaar',
  amount: '',
  currency: 'INR',
  transactionNote: 'Payment to Kherwal Bazaar',
  customQrData: 'https://kherwalbazaar.com',
  qrCenterType: 'text',
  qrCenterText: 'KB',
  qrCenterImage: null,
  theme: 'crimson',
  showPaymentLogos: true,
  features: [
    { id: '1', icon: 'shield', title: 'Secure Payment' },
    { id: '2', icon: 'bolt', title: 'Fast Checkout' },
    { id: '3', icon: 'truck', title: 'Home Delivery' },
    { id: '4', icon: 'shopping-bag', title: 'Wide Products' },
  ],
};

export const THEME_STYLES: Record<
  PosterConfig['theme'],
  {
    name: string;
    bgClass: string;
    bracketColor: string;
    waveColor1: string;
    waveColor2: string;
    topBadgeBg: string;
    topBadgeBorder: string;
    cartBorder: string;
    cartText: string;
  }
> = {
  crimson: {
    name: 'Kherwal Crimson (Original)',
    bgClass: 'from-[#e6005c] via-[#b80048] to-[#8a0035]',
    bracketColor: 'border-pink-600',
    waveColor1: 'bg-[#0ea543]',
    waveColor2: 'bg-[#056a33]',
    topBadgeBg: 'bg-pink-600/60',
    topBadgeBorder: 'border-pink-400',
    cartBorder: 'border-pink-600',
    cartText: 'text-pink-600',
  },
  emerald: {
    name: 'Forest Emerald',
    bgClass: 'from-[#059669] via-[#047857] to-[#064e3b]',
    bracketColor: 'border-emerald-600',
    waveColor1: 'bg-[#10b981]',
    waveColor2: 'bg-[#047857]',
    topBadgeBg: 'bg-emerald-600/60',
    topBadgeBorder: 'border-emerald-400',
    cartBorder: 'border-emerald-600',
    cartText: 'text-emerald-700',
  },
  royal: {
    name: 'Royal Blue',
    bgClass: 'from-[#2563eb] via-[#1d4ed8] to-[#1e3a8a]',
    bracketColor: 'border-blue-600',
    waveColor1: 'bg-[#3b82f6]',
    waveColor2: 'bg-[#1e40af]',
    topBadgeBg: 'bg-blue-600/60',
    topBadgeBorder: 'border-blue-400',
    cartBorder: 'border-blue-600',
    cartText: 'text-blue-600',
  },
  purple: {
    name: 'Neon Violet',
    bgClass: 'from-[#9333ea] via-[#7e22ce] to-[#581c87]',
    bracketColor: 'border-purple-600',
    waveColor1: 'bg-[#a855f7]',
    waveColor2: 'bg-[#6b21a8]',
    topBadgeBg: 'bg-purple-600/60',
    topBadgeBorder: 'border-purple-400',
    cartBorder: 'border-purple-600',
    cartText: 'text-purple-600',
  },
};
