# CUET Hoodie Store — Premium University Merchandise

A complete, modern, premium-looking, frontend-only e-commerce website for CUET-themed hoodie merchandise. Built for CUET students and alumni to explore collections, inspect product details, select hoodie variations, and place orders with sequential order numbering, LocalStorage archiving, CSV reporting, and centralized Google Form integration.

Featuring two signature CUET campus designs:
1. **The Gateway** (Active drop: 300+ GSM heavyweight fleece, DTF print, Midnight Black / Sand Beige / Crimson Maroon).
2. **Bus Stories** (Coming Soon: celebrating the historic CUET student bus commute).

---

## 1. Project Overview & Features

### Core Customer Experience
1. **Homepage**: Fashion-house hero section showcasing "The Gateway" hoodie collection, two-design roadmap, CUET campus heritage storytelling, and ordering walkthrough.
2. **Product Catalog (`/products`)**: Filterable product grid featuring "The Gateway" editions and "Bus Stories" teaser.
3. **Product Details (`/products/:id`)**:
   - Interactive multi-angle image slider with thumbnails and smooth transitions.
   - Dynamic colour, size, batch, and department selectors.
   - Quantity counter with live total pricing calculations.
   - Comprehensive fabric and production specifications.
   - Expandable size guide table.
4. **Order Checkout (`/order`)**:
   - 4-section structured form: Student Verification, Product & Pricing (locked), bKash Payment with TrxID, and Delivery Destination.
   - Real-time client-side validation (Student ID, `@cuet.ac.bd` email, BD phone format `01XXXXXXXXX`, and bKash TrxID).
   - Live sticky order summary card.
5. **Unique order numbers**:
   - Format `CUET-YYMMDD-XXXX` (e.g. `CUET-261101-7KQ4`): Bangladesh date + random code, unique across all customers.
   - Kept in session storage during checkout, so refreshing or retrying keeps the same number.
6. **Order Confirmation (`/confirmation/:orderNumber`)**:
   - Shown only after the Google Sheet has received the order. Printable receipt and "what happens next".
7. **Order Management & CSV Export (`/orders`)** — only orders placed *in that browser*:
   - Metrics: Total orders, total pieces ordered, total bKash volume, and orders grouped by batch.
   - Search by order number, student ID, customer name, or TrxID.
   - Filter by batch.
   - **Export Orders as CSV**: same columns as the Google Sheet, UTF-8 BOM for Excel, phone numbers and TrxIDs kept as text.
8. **How to Order (`/how-to-order`)**: ordering steps and the size chart (`SIZE_CHART` in `src/data/products.ts`). `/google-form` redirects here.

---

## Designs, colours & images

| Design | Colours | Sizes | Batch (printed on back) | Price |
|---|---|---|---|---|
| 01 · The Gateway | Black, Camel, Maroon | M, L, XL, XXL | CUET'21 – CUET'25 | ৳700 |
| 02 · Bus Stories | Black, Camel, Maroon | M, L, XL, XXL | CUET'21 – CUET'25 | ৳700 |

Products, colours and image lists live in `src/data/products.ts`.

- `public/assets/cutouts/*.webp` — transparent-background cut-outs (models and hoodies) cut from the photos in `Hoddie/`. They are shown straight on the black page with the `Cutout` component (`src/components/Cutout.tsx`): soft spotlight, floor shadow and bottom fade, no frames or boxes.
- `Hoddie/cutouts/*.png` — full-quality transparent PNG masters of the same cut-outs (not deployed).
- `public/assets/photos/*.jpg` — optimised copies of the posters and artwork.
- `Hoddie/Architectural Minimalist Hoodie Mockup.png` is a different design, so it isn't used.

**Adding more model photos:** the folder only has one male model (The Gateway in Black and Camel, front and back). To add female models or Bus Stories / Maroon model shots, cut the background out (e.g. `rembg i -m isnet-general-use -a photo.jpg out.png`), save as WebP in `public/assets/cutouts/`, and add the path to that colour's `images` list in `src/data/products.ts`.

## 2. Technology Stack & Constraints

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Vanilla CSS tokens
- **Routing**: React Router DOM v7 (SPA with `vercel.json` rewrites)
- **Icons**: Lucide React
- **Storage**: Browser LocalStorage & SessionStorage
- **Export**: Browser Blob API for UTF-8 CSV generation

### Strict Architecture Constraints
- **100% Frontend-Only**: No Django, No Express, No Firebase, No Supabase, No SQL/NoSQL databases, and No server-side authentication.
- **Static Deployment**: Runs completely in client browsers and can be hosted on Vercel, Netlify, or GitHub Pages.

---

## 3. Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Running
```bash
# Navigate to the project directory
cd cuet-hoodie-store

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will launch at `http://localhost:5174/`.

### Production Build
```bash
npm run build
npm run preview
```

---

## 4. Environment Variables

Create a `.env` file in the project root (copy `.env.example`):

```env
# Where orders go — see "Connect the Google Sheet" below (required for the live site)
VITE_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec

# bKash number customers send money to
VITE_BKASH_MERCHANT_NUMBER=017XXXXXXXX
```

Restart `npm run dev` after changing `.env`. On Vercel, add the same variables under Project → Settings → Environment Variables and redeploy.

### Connect the Google Sheet (5 minutes)

Every order from every customer lands in one Google Sheet. This is your real order list.

1. Create a new Google Sheet (e.g. "CUET Hoodie Orders").
2. **Extensions → Apps Script**. Delete what's there, paste everything from `google-apps-script/Code.gs`, press **Save**.
3. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Press **Deploy** and allow access (Google shows an "unverified app" warning for your own script: Advanced → Go to project).
4. Copy the **Web app URL** (ends in `/exec`) into `.env` as `VITE_GOOGLE_SHEET_WEBHOOK_URL`.
5. Check it: open that URL in your browser — it should say `"CUET Hoodie order receiver is running."`
6. Restart `npm run dev`, place a test order, and see it appear in the **Orders** tab. Delete the test row afterwards.

What the sheet does for you:
- One row per order, with the same columns as the website's CSV export, plus **Received At**, **Status** and **Check**.
- Phone numbers, student IDs and TrxIDs stay as text, so leading zeros aren't lost.
- If the same order arrives twice (double click, retry), it's only saved once.
- If a TrxID was already used in an earlier order, the row turns red and **Check** says `CHECK: TrxID used before`.
- Change **Status** yourself as you go (e.g. Paid → Printed → Delivered).
- To download everything as CSV: **File → Download → Comma-separated values**.

If you edit `Code.gs` later: **Deploy → Manage deployments → Edit → Version: New version → Deploy** (the URL stays the same).

Using a Google Form instead is still supported (`VITE_GOOGLE_FORM_URL` + every `VITE_GF_ENTRY_*` id), but Google Forms can't tell the website whether the order arrived, so the Sheet script is recommended.

---

## 5. Important Business & Data Limitations

As this project is an independent static frontend application:
1. **The Google Sheet is the order list.** Each order is sent to it automatically when the customer presses Submit; the customer only sees "confirmed" after it arrives. If the sheet isn't set up, the live site refuses orders (during `npm run dev` it allows test orders and shows a warning).
2. **Browser copy**: a copy of each order is also kept in the customer's own browser for their receipt. The `/orders` page and its CSV export only show orders placed in *that* browser — use the Google Sheet for all orders.
3. **bKash is checked by you**: the website can't verify a TrxID with bKash. Match each TrxID against your bKash statement before printing.
4. **Security Notice**: LocalStorage is not an encrypted database. Never store sensitive passwords or financial credentials.

---

## 6. Vercel Deployment

This project is pre-configured for Vercel deployment:
- `vercel.json` includes SPA rewrites (`source: "/(.*)" -> destination: "/index.html"`).
- All static hoodie images are bundled inside `public/assets/`.
- No server runtime is required.

Deploy via Vercel CLI:
```bash
npx vercel
```
Or import the repository directly into the Vercel dashboard with Framework Preset: **Vite**.
