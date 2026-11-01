import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-line/60">
      {/* Top Banner Notice */}
      <div className="bg-[#14110F] border-b border-line/40 py-1.5 px-4 text-center font-body text-[11px] sm:text-xs tracking-[0.2em] uppercase text-paper/80">
        [ PRE-ORDER OPEN · PAY WITH BKASH · MADE FOR CUETIANS ]
      </div>

      <nav className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-anton text-2xl sm:text-3xl uppercase tracking-wider text-paper group-hover:text-brick-bright transition-colors">
            2STITCH
          </span>
          <span className="hidden sm:inline-block font-body text-[10px] uppercase font-bold tracking-[0.25em] text-muted-dark border-l border-line pl-2 ml-1">
            CUET MERCH
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`font-body text-xs uppercase tracking-[0.16em] font-semibold transition-colors ${
              isActive('/') ? 'text-brick-bright' : 'text-paper/80 hover:text-paper'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`font-body text-xs uppercase tracking-[0.16em] font-semibold transition-colors ${
              isActive('/products') ? 'text-brick-bright' : 'text-paper/80 hover:text-paper'
            }`}
          >
            Collection
          </Link>
          <Link
            to="/how-to-order"
            className={`font-body text-xs uppercase tracking-[0.16em] font-semibold flex items-center gap-1.5 transition-colors ${
              isActive('/how-to-order') ? 'text-brick-bright' : 'text-paper/80 hover:text-paper'
            }`}
          >
            How to Order
          </Link>
        </div>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="btn-outline py-2 px-4 sm:px-5 text-xs font-bold flex items-center gap-1.5"
          >
            <ShoppingBag size={14} />
            <span>Shop Now</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-paper hover:text-brick-bright transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ink-2 border-b border-line px-6 py-6 space-y-4 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block font-body text-sm uppercase tracking-[0.18em] font-semibold ${
              isActive('/') ? 'text-brick-bright' : 'text-paper/80'
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`block font-body text-sm uppercase tracking-[0.18em] font-semibold ${
              isActive('/products') ? 'text-brick-bright' : 'text-paper/80'
            }`}
          >
            Collection
          </Link>
          <Link
            to="/how-to-order"
            onClick={() => setMobileMenuOpen(false)}
            className={`block font-body text-sm uppercase tracking-[0.18em] font-semibold flex items-center gap-2 ${
              isActive('/how-to-order') ? 'text-brick-bright' : 'text-paper/80'
            }`}
          >
            How to Order
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
