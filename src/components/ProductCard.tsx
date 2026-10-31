import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { COLOURS, getVariant } from '../data/products';
import Cutout from './Cutout';

interface ProductCardProps {
  product: Product;
}

/** Floating cut-out hoodie on the black page; colour dots swap the shot. */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [colour, setColour] = useState(product.colours[0]);
  const variant = getVariant(product, colour);
  const link = `/products/${product.id}?colour=${encodeURIComponent(colour)}`;

  return (
    <article className="group flex flex-col items-center text-center">
      <Link to={link} aria-label={`${product.name} in ${colour}`} className="block w-full">
        <Cutout
          src={variant.cutout}
          alt={`${product.name} hoodie in ${colour}`}
          floor
          className="w-full aspect-[4/5] transition-transform duration-500 group-hover:-translate-y-1.5"
        />
      </Link>

      <div className="mt-5 flex flex-col items-center gap-2">
        <span className="font-body text-[11px] uppercase tracking-[0.24em] text-brick-bright font-bold">
          Design {product.designNumber}
        </span>
        <Link to={link}>
          <h3 className="font-anton text-3xl sm:text-4xl uppercase text-paper group-hover:text-brick-bright transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="font-body text-sm text-muted max-w-xs">{product.tagline}</p>

        <div className="flex items-center gap-2.5 pt-2" role="group" aria-label="Colour">
          {COLOURS.filter(c => product.colours.includes(c.name)).map(c => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColour(c.name)}
              aria-pressed={colour === c.name}
              aria-label={c.name}
              title={c.name}
              className={`w-9 h-9 rounded-full p-1 border-2 transition-colors cursor-pointer ${
                colour === c.name ? 'border-brick-bright' : 'border-transparent hover:border-line'
              }`}
            >
              <span className="block w-full h-full rounded-full ring-1 ring-white/15" style={{ backgroundColor: c.swatch }} />
            </button>
          ))}
        </div>
        <span className="font-body text-xs uppercase tracking-[0.16em] text-muted">{colour}</span>

        <div className="flex items-center gap-4 pt-3">
          <span className="font-anton text-2xl text-paper">৳{product.price.toLocaleString()}</span>
          <Link to={link} className="btn-outline min-h-11 px-6">
            Order <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
