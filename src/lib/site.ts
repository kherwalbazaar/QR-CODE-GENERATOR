/** Shared site constants used by metadata, robots, sitemap and the web manifest. */
const vercelUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')
).replace(/\/+$/, '');

export const SITE_NAME = 'UPI PYMT';
export const SITE_TITLE = 'UPI PYMT — UPI Payment QR Poster Generator';
export const SITE_DESCRIPTION =
  'Create a scannable UPI payment QR poster for Kherwal Bazaar. Accept payments through Google Pay, PhonePe, Paytm and every UPI app, then export a high-resolution poster ready for print.';

export const SITE_KEYWORDS = [
  'UPI QR code',
  'UPI payment poster',
  'QR code generator',
  'scan and pay',
  'Google Pay',
  'PhonePe',
  'Paytm',
  'Kherwal Bazaar',
  'payment poster',
  'UPI ID',
];
