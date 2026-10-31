import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pause, Play } from 'lucide-react';
import Cutout from './Cutout';
import { COLOURS, HERO_SLIDES, getProductById } from '../data/products';

const INTERVAL_MS = 4500;

/**
 * Editorial campaign hero: cut-out models standing directly on the black page,
 * cross-fading automatically through every design + colour that has model photos.
 */
export const Hero: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const count = HERO_SLIDES.length;

  // Respect "reduce motion": start paused, the visitor can still press play.
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPaused(true);
  }, []);

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || hovered || count < 2) return;
    const t = window.setTimeout(() => go(index + 1), INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [index, paused, hovered, count, go]);

  const slide = HERO_SLIDES[index];
  const product = slide ? getProductById(slide.productId) : undefined;
  const swatch = COLOURS.find(c => c.name === slide?.colour)?.swatch;

  return (
    <section className="relative overflow-hidden">
      {/* Warm stage light falling behind the models */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[120%] w-[900px] max-w-full opacity-90"
        style={{ background: 'radial-gradient(closest-side, rgba(224,122,71,0.18), rgba(224,122,71,0.04) 60%, transparent)' }}
      />

      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-6 grid grid-cols-1 lg:grid-cols-12 items-end gap-6 lg:gap-0 lg:min-h-[calc(100svh-7rem)]">
        {/* Copy */}
        <div className="lg:col-span-6 flex flex-col gap-5 lg:pb-24 z-10 animate-fade-in">
          <p className="font-body text-xs sm:text-[13px] font-bold tracking-[0.24em] text-brick-bright uppercase">
            Winter ’26 · Pre-order open
          </p>
          <h1 className="font-anton text-[clamp(3.4rem,9vw,7.5rem)] leading-[0.88] uppercase text-paper">
            Wear<br />the campus.
          </h1>
          <p className="font-body text-base sm:text-lg leading-relaxed text-muted max-w-md">
            Two designs. Three colours. Your batch on the back. 300+ GSM heavyweight fleece, made for CUETians.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/products/the-gateway" className="btn-primary min-h-12 px-7">
              01 · The Gateway <ArrowRight size={15} />
            </Link>
            <Link to="/products/bus-stories" className="btn-outline min-h-12 px-7">
              02 · Bus Stories <ArrowRight size={15} />
            </Link>
          </div>
          <div className="flex items-center gap-4 pt-3 font-body text-xs uppercase tracking-[0.18em] text-muted">
            {COLOURS.map(c => (
              <span key={c.name} className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full ring-1 ring-line" style={{ backgroundColor: c.swatch }} />
                {c.name}
              </span>
            ))}
          </div>
        </div>

        {/* Model slideshow */}
        <div
          className="lg:col-span-6 relative h-[480px] sm:h-[580px] lg:h-[min(780px,calc(100svh-8rem))]"
          role="region"
          aria-roledescription="carousel"
          aria-label="Models wearing the hoodies"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <span className="absolute right-0 top-6 font-anton text-[clamp(4rem,10vw,9rem)] leading-none text-paper/[0.04] select-none" aria-hidden="true">
            CUET
          </span>

          {HERO_SLIDES.map((s, i) => {
            const p = getProductById(s.productId);
            const active = i === index;
            return (
              <div
                key={`${s.productId}-${s.colour}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}: ${p?.name} in ${s.colour}`}
                aria-hidden={!active}
                className={`absolute inset-x-0 top-0 bottom-16 transition-all duration-700 ease-out ${
                  active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6 pointer-events-none'
                }`}
              >
                {s.back && (
                  <Cutout
                    src={s.back}
                    alt={`${p?.name} hoodie in ${s.colour}, back view with the batch print`}
                    loading="eager"
                    fade
                    glow={false}
                    className="absolute bottom-0 left-[2%] w-[48%] h-[88%] opacity-90"
                    imgClassName="object-bottom"
                  />
                )}
                <Cutout
                  src={s.front}
                  alt={`${p?.name} hoodie in ${s.colour}, front view`}
                  loading="eager"
                  fade
                  className={`absolute bottom-0 ${s.back ? 'right-0 w-[64%] h-[82%]' : 'left-1/2 -translate-x-1/2 w-[72%] h-full'}`}
                  imgClassName="object-bottom"
                />
              </div>
            );
          })}

          {/* Caption + controls */}
          <div className="absolute inset-x-0 bottom-0 h-16 flex items-center justify-between gap-4 z-10">
            {product && (
              <Link
                to={`/products/${product.id}?colour=${encodeURIComponent(slide.colour)}`}
                className="group flex items-center gap-2.5 font-body text-xs uppercase tracking-[0.16em] text-paper/85 hover:text-paper min-h-11"
                aria-live="polite"
              >
                <span className="w-3 h-3 rounded-full ring-1 ring-white/20" style={{ backgroundColor: swatch }} />
                <span>
                  {product.designNumber} · {product.name} — <span className="text-brick-bright">{slide.colour}</span>
                </span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}

            {count > 1 && (
              <div className="flex items-center gap-1">
                {HERO_SLIDES.map((s, i) => (
                  <button
                    key={`${s.productId}-${s.colour}-dot`}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Show slide ${i + 1}`}
                    aria-current={i === index}
                    className="w-8 h-11 flex items-center justify-center cursor-pointer"
                  >
                    <span className={`h-0.5 rounded-full transition-all duration-500 ${i === index ? 'w-7 bg-brick-bright' : 'w-4 bg-paper/30'}`} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPaused(p => !p)}
                  aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
                  className="w-11 h-11 flex items-center justify-center text-paper/60 hover:text-paper cursor-pointer"
                >
                  {paused ? <Play size={14} /> : <Pause size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
