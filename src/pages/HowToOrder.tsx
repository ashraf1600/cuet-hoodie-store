import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Ruler } from 'lucide-react';
import SizeChart from '../components/SizeChart';
import { BATCHES, PRODUCTS } from '../data/products';

const price = PRODUCTS[0]?.price ?? 700;

const STEPS = [
  {
    t: 'Choose your design & colour',
    d: (
      <>
        <strong className="text-paper">01 · The Gateway</strong> or <strong className="text-paper">02 · Bus Stories</strong> — each comes in Black, Camel and Maroon.
      </>
    ),
  },
  {
    t: 'Pick your size',
    d: <>Sizes M, L, XL and XXL. Check the size chart below — if you’re between two sizes, take the bigger one.</>,
  },
  {
    t: 'Choose your batch',
    d: <>Your batch is printed on the back: {BATCHES.join(', ')}.</>,
  },
  {
    t: 'Pay with bKash',
    d: (
      <>
        Use bKash <strong className="text-paper">“Send Money”</strong> to send the total (৳{price.toLocaleString()} per hoodie) to the number shown on the order form. Keep the SMS — it has your <strong className="text-paper">Transaction ID (TrxID)</strong>.
      </>
    ),
  },
  {
    t: 'Fill in the order form',
    d: <>Enter your name, student ID, CUET email, phone, the bKash number you paid from and the TrxID, then press Submit.</>,
  },
  {
    t: 'Get your order number',
    d: <>You’ll see an order number like <strong className="text-paper">CUET-261101-7KQ4</strong>. Save it — we’ll use it when your hoodie is ready for campus pickup or courier.</>,
  },
];

export const HowToOrder: React.FC = () => (
  <div className="max-w-[1040px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
    <header className="space-y-3">
      <p className="font-body text-xs uppercase font-bold tracking-[0.24em] text-brick-bright">Pre-order guide</p>
      <h1 className="font-anton text-5xl sm:text-7xl uppercase leading-[0.92] text-paper">How to order</h1>
      <p className="font-body text-base text-muted max-w-xl">Six quick steps. Payment is by bKash only — no cash on delivery.</p>
    </header>

    <section aria-labelledby="steps">
      <h2 id="steps" className="sr-only">Steps</h2>
      <ol className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
        {STEPS.map((s, i) => (
          <li key={s.t} className="border-t border-line pt-5 flex gap-5">
            <span className="font-anton text-4xl text-brick-bright leading-none tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <div className="space-y-1.5">
              <h3 className="font-body text-base font-semibold uppercase tracking-wide text-paper">{s.t}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <section id="size-chart" aria-labelledby="size-heading" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-4">
        <p className="font-body text-xs uppercase font-bold tracking-[0.24em] text-brick-bright">Fit</p>
        <h2 id="size-heading" className="font-anton text-4xl sm:text-5xl uppercase leading-[0.95] text-paper">Size chart</h2>
        <p className="font-body text-sm text-muted leading-relaxed">
          Regular unisex fit — not oversized, not drop-shoulder. Measurements are of the hoodie itself, in inches.
        </p>
        <div className="space-y-3 pt-2">
          <h3 className="font-body text-xs uppercase font-bold tracking-[0.16em] text-paper flex items-center gap-2">
            <Ruler size={14} className="text-brick-bright" /> How to measure
          </h3>
          <ul className="font-body text-sm text-muted space-y-2 leading-relaxed">
            <li><strong className="text-paper">Chest</strong> — all the way around the hoodie, just under the arms.</li>
            <li><strong className="text-paper">Length</strong> — from the top of the shoulder (next to the hood) down to the hem.</li>
            <li><strong className="text-paper">Sleeve</strong> — from the shoulder seam to the end of the cuff.</li>
          </ul>
          <p className="font-body text-sm text-muted leading-relaxed">
            Easiest way: measure a hoodie or sweatshirt you already like and pick the closest size.
          </p>
        </div>
      </div>
      <div className="lg:col-span-7">
        <SizeChart />
      </div>
    </section>

    <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-line pt-10">
      <p className="font-anton text-3xl sm:text-4xl uppercase text-paper">Ready to order?</p>
      <Link to="/order" className="btn-primary min-h-12 px-8">
        Pre-order now <ArrowRight size={15} />
      </Link>
    </section>
  </div>
);

export default HowToOrder;
