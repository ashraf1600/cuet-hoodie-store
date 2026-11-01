import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-2 border-t border-line text-paper">
      {/* Value Badges Banner */}
      <div className="border-b border-line/60 py-8">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-ink-3 border border-line flex items-center justify-center text-brick-bright">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-anton text-sm uppercase tracking-wide">300+ GSM Heavy Fleece</p>
              <p className="font-body text-xs text-muted">Premium cotton blend with DTF print.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-ink-3 border border-line flex items-center justify-center text-brick-bright">
              <Truck size={20} />
            </div>
            <div>
              <p className="font-anton text-sm uppercase tracking-wide">Campus Pickup &amp; Courier</p>
              <p className="font-body text-xs text-muted">Direct hall delivery or courier across BD.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-ink-3 border border-line flex items-center justify-center text-brick-bright">
              <RefreshCw size={20} />
            </div>
            <div>
              <p className="font-anton text-sm uppercase tracking-wide">Custom Batch on Back</p>
              <p className="font-body text-xs text-muted">Printed with your CUET batch number.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-ink-3 border border-line flex items-center justify-center text-brick-bright">
              <Heart size={20} />
            </div>
            <div>
              <p className="font-anton text-sm uppercase tracking-wide">By Students, For Students</p>
              <p className="font-body text-xs text-muted">Independent university merchandise.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5 space-y-4">
          <span className="font-anton text-3xl uppercase tracking-wider text-paper">
            2STITCH
          </span>
          <p className="font-body text-xs uppercase tracking-[0.24em] text-brick-bright -mt-2">Stitched with purpose.</p>
          <p className="font-body text-sm leading-relaxed text-muted max-w-sm">
            Premium university streetwear merchandise inspired by CUET&apos;s campus identity, engineering culture, and student community. Built for students, alumni, and campus life.
          </p>
          <div className="font-body text-xs uppercase tracking-wider text-muted-dark">
            Chittagong University of Engineering &amp; Technology · Raozan, Chattogram
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h4 className="font-anton text-sm uppercase tracking-wider text-paper">Shop &amp; Collections</h4>
          <ul className="space-y-2 font-body text-xs text-muted">
            <li>
              <Link to="/products" className="hover:text-brick-bright transition-colors">
                All Hoodies
              </Link>
            </li>
            <li>
              <Link to="/products/the-gateway" className="hover:text-brick-bright transition-colors">
                Design 01: The Gateway
              </Link>
            </li>
            <li>
              <Link to="/products/bus-stories" className="hover:text-brick-bright transition-colors">
                Design 02: Bus Stories
              </Link>
            </li>
            <li>
              <Link to="/order" className="hover:text-brick-bright transition-colors">
                Pre-order (Black · Camel · Maroon)
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4 space-y-3">
          <h4 className="font-anton text-sm uppercase tracking-wider text-paper">Ordering</h4>
          <ul className="space-y-2 font-body text-xs text-muted">
            <li>
              <Link to="/how-to-order" className="hover:text-brick-bright transition-colors">
                How to order
              </Link>
            </li>
            <li>
              <Link to="/how-to-order#size-chart" className="hover:text-brick-bright transition-colors">
                Size chart (M · L · XL · XXL)
              </Link>
            </li>
            <li>
              <span className="text-muted-dark">Payment: bKash &quot;Send Money&quot; with TrxID</span>
            </li>
            <li>
              <span className="text-muted-dark">300+ GSM heavyweight cotton fleece</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-line/40 py-6 text-center font-body text-xs text-muted-dark">
        &copy; {new Date().getFullYear()} 2Stitch · Stitched with purpose. CUET Campus Merchandise. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
