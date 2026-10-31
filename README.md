# Kherwal Bazaar QR Code Generator & Poster Studio (Next.js)

A high-performance, responsive **Next.js & Tailwind CSS** payment poster generator and QR design studio converted from the original static HTML poster (`kherwal_bazaar_poster.html`).

---

## 🚀 Key Features

1. **Exact Faithful Reproduction of Original Design**:
   - Preserves the vibrant **Kherwal Crimson** gradient background.
   - Flowing emerald green curved accent waves with geometric rotations.
   - Dual-tone store title:
     - **Line 1** (e.g. `KHERWAL`): Bold white typography with 6px black stroke effect.
     - **Line 2** (e.g. `BAZAAR`): Shimmering golden-yellow gradient with heavy black stroke effect.
   - Emerald "Scan QR Code & Pay" pill banner with pulsing QR icon.
   - 4-Corner pink L-bracket framing on the QR card.
   - Branded Indian Payment Gateway badges: **Google Pay**, **PhonePe**, **Paytm**, and **UPI**.
   - 4 Frosted glass feature pills: **Secure Payment**, **Fast Checkout**, **Home Delivery**, and **Wide Products**.

2. **Real, Scannable Dynamic QR Generation**:
   - Generates valid, NPCI-standard **UPI Payment links** (`upi://pay?pa=...`) scannable by Google Pay, PhonePe, Paytm, BHIM, Cred, and all mobile banking apps.
   - Supports custom URL / text mode (for website links, WiFi, vCards, etc.).
   - Error Correction Level **H (High)** with custom center watermark badge ("KB" or uploaded store logo).

3. **Interactive Studio & Customization Controls**:
   - **Store Details**: Edit Title Line 1, Title Line 2, Banner pill text, and Center watermark/logo.
   - **Payment & Pricing**: Customize UPI ID (VPA), Merchant Name, Optional Fixed Amount, Currency, and Transaction Notes.
   - **Color Themes**:
     - *Kherwal Crimson (Original)*
     - *Forest Emerald*
     - *Royal Blue*
     - *Neon Violet*
     - *Midnight Gold*
   - **Badges**: Edit feature highlights and switch icons (Shield, Bolt, Truck, Bag, Lock, Award, Support).
   - **Presets**: 1-click presets for *Kherwal Bazaar*, *Grocery Supermart*, *Fashion Boutique*, and *Cafe & Bakery*.

4. **Export & Print Ready**:
   - 📥 **Export High-Res PNG**: Ultra-sharp 3x pixel ratio rendering for digital signage or print.
   - 🖨️ **Print**: Specially formatted `@media print` rules for A4 and photo paper.
   - 📋 **Copy Link**: One-click clipboard copy for the generated UPI payment URI.

---

## 🛠️ Getting Started

### 1. Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
QR CODE GENERATOR/
├── kherwal_bazaar_poster.html   # Original static HTML reference
├── package.json                 # Next.js 14, React 18, Tailwind, Lucide, qrcode.react
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
├── next.config.js               # Next.js configuration
├── src/
│   ├── app/
│   │   ├── globals.css          # Typography, strokes, gradients, print styles
│   │   ├── layout.tsx           # Root Next.js layout & metadata
│   │   └── page.tsx             # Interactive Studio UI & live canvas
│   ├── components/
│   │   ├── PosterPreview.tsx    # Pixel-perfect scannable poster component
│   │   └── PosterEditor.tsx     # Customization sidebar controls & presets
│   └── types/
│       └── poster.ts            # Type definitions, presets & theme palettes
└── README.md
```
