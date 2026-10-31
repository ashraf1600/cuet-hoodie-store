import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import Cutout from '../components/Cutout';
import { getFeaturedProducts } from '../data/products';

const C = '/assets/cutouts';
const P = '/assets/photos';

const container = 'max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8';
const kicker = 'font-body text-xs uppercase font-bold tracking-[0.24em] text-brick-bright';
const title = 'font-anton text-5xl sm:text-7xl uppercase leading-[0.92] text-paper';

const STEPS = [
  { n: '01', t: 'Pick design & colour', d: 'The Gateway or Bus Stories, in Black, Camel or Maroon. Then your size and batch.' },
  { n: '02', t: 'Pay with bKash', d: 'Send the total with bKash "Send Money" and enter the transaction ID (TrxID) in the order form.' },
  { n: '03', t: 'Get your order number', d: 'Your order goes straight to our order sheet. Pick up on campus or get it by courier.' },
];

/** Artwork shown with softly faded edges so it melts into the black page. */
const StoryArt: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={`w-full h-auto ${className}`}
    style={{
      WebkitMaskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)',
      maskImage: 'radial-gradient(ellipse 50% 50% at 50% 50%, #000 62%, transparent 100%)',
    }}
  />
);

export const Home: React.FC = () => {
  const products = getFeaturedProducts();

  return (
    <div className="space-y-28 sm:space-y-36 pb-8">
      <Hero />

      {/* The two designs */}
      <section id="designs" className={`${container} scroll-mt-24`}>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-14">
          <div className="space-y-3">
            <p className={kicker}>The collection</p>
            <h2 className={title}>Two designs.<br />Three colours.</h2>
          </div>
          <p className="font-body text-sm sm:text-base text-muted max-w-sm">
            Tap a colour to see it. Every hoodie is 300+ GSM fleece with your batch printed on the back.
          </p>
        </div>
        <ProductGrid products={products} showFilters={false} />
      </section>

      {/* Batch on the back — models */}
      <section className="relative overflow-hidden">
        <div className={`${container} grid grid-cols-1 lg:grid-cols-12 items-end gap-10`}>
          <div className="lg:col-span-5 space-y-5 lg:pb-24">
            <p className={kicker}>Your batch, your back</p>
            <h2 className={title}>CUET’21<br />to CUET’25.</h2>
            <p className="font-body text-base text-muted max-w-md leading-relaxed">
              Choose your batch at checkout and it’s printed across the back — the front carries the design, the back carries your year.
            </p>
            <Link to="/order" className="btn-primary min-h-12 px-7">
              Pre-order now <ArrowRight size={15} />
            </Link>
          </div>
          <div className="lg:col-span-7 relative h-[440px] sm:h-[600px]">
            <Cutout
              src={`${C}/model-black-back.webp`}
              alt="Model in the Black hoodie from behind, CUET'21 printed across the back"
              fade
              className="absolute bottom-0 left-0 w-[50%] h-full"
              imgClassName="object-bottom"
            />
            <Cutout
              src={`${C}/model-camel-back.webp`}
              alt="Model in the Camel hoodie from behind, CUET'21 printed across the back"
              fade
              className="absolute bottom-0 right-0 w-[50%] h-[92%]"
              imgClassName="object-bottom"
            />
          </div>
        </div>
      </section>

      {/* Story: The Gateway */}
      <section className={`${container} grid grid-cols-1 lg:grid-cols-12 items-center gap-10`}>
        <div className="lg:col-span-6 order-2 lg:order-1">
          <StoryArt src={`${P}/gateway-artwork.jpg`} alt="The Gateway artwork: the CUET gateway building with the university name" />
        </div>
        <div className="lg:col-span-6 order-1 lg:order-2 space-y-5">
          <p className={kicker}>Design 01 · The Gateway</p>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase leading-[0.95] text-paper">The first thing you saw of campus.</h2>
          <p className="font-body text-base text-muted leading-relaxed max-w-lg">
            Chittagong University of Engineering &amp; Technology, since 1968 — the gateway building, set in brick-red type.
          </p>
          <div className="flex gap-6 items-end">
            <Cutout src={`${C}/gateway-camel-flat-front.webp`} alt="The Gateway hoodie in Camel, front" floor className="w-28 h-32 sm:w-36 sm:h-40" />
            <Cutout src={`${C}/gateway-maroon.webp`} alt="The Gateway hoodie in Maroon" floor className="w-28 h-32 sm:w-36 sm:h-40" />
          </div>
          <Link to="/products/the-gateway" className="btn-outline min-h-12 px-7">Shop The Gateway <ArrowRight size={15} /></Link>
        </div>
      </section>

      {/* Story: Bus Stories */}
      <section className={`${container} grid grid-cols-1 lg:grid-cols-12 items-center gap-10`}>
        <div className="lg:col-span-6 space-y-5">
          <p className={kicker}>Design 02 · Bus Stories</p>
          <h2 className="font-anton text-4xl sm:text-6xl uppercase leading-[0.95] text-paper">The ride we all remember.</h2>
          <p className="font-body text-base text-muted leading-relaxed max-w-lg">
            The campus bus under a starry sky, the old tree, the ribbon of colour — the songs, laughter and journeys that shaped our university days.
          </p>
          <div className="flex gap-6 items-end">
            <Cutout src={`${C}/bus-black.webp`} alt="Bus Stories hoodie in Black" floor className="w-28 h-32 sm:w-36 sm:h-40" />
            <Cutout src={`${C}/bus-camel.webp`} alt="Bus Stories hoodie in Camel" floor className="w-28 h-32 sm:w-36 sm:h-40" />
            <Cutout src={`${C}/bus-maroon.webp`} alt="Bus Stories hoodie in Maroon" floor className="w-28 h-32 sm:w-36 sm:h-40" />
          </div>
          <Link to="/products/bus-stories" className="btn-outline min-h-12 px-7">Shop Bus Stories <ArrowRight size={15} /></Link>
        </div>
        <div className="lg:col-span-6">
          <StoryArt src={`${P}/bus-artwork.jpg`} alt="Bus Stories artwork: the CUET bus beside a tree under a swirling starry sky" />
        </div>
      </section>

      {/* How it works */}
      <section className={container}>
        <div className="mb-12 space-y-3">
          <p className={kicker}>How it works</p>
          <h2 className={title}>Order in 3 steps.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(s => (
            <div key={s.n} className="border-t border-paper pt-5 space-y-3">
              <div className="font-anton text-5xl text-brick-bright">{s.n}</div>
              <h3 className="font-body text-lg font-semibold uppercase tracking-wide text-paper">{s.t}</h3>
              <p className="font-body text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing band */}
      <section className="bg-paper text-ink">
        <div className={`${container} py-20 sm:py-24 flex flex-col md:flex-row md:items-end justify-between gap-8`}>
          <h2 className="font-anton text-5xl sm:text-7xl uppercase leading-[0.9] text-ink">
            Made by CUETians.<br />For CUETians.
          </h2>
          <Link
            to="/order"
            className="inline-flex items-center justify-center gap-2 bg-ink text-paper font-body font-bold text-xs uppercase tracking-[0.16em] min-h-12 px-8 shrink-0 hover:bg-brick-bright transition-colors"
          >
            Pre-order now <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
