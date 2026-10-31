import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/ProductGrid';
import { PRODUCTS } from '../data/products';

export const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All Hoodies';

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header Banner */}
      <div className="border-b border-line/60 pb-8 space-y-3">
        <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-brick-bright">
          CUET Campus Series · Two Signature Designs
        </span>
        <h1 className="font-anton text-4xl sm:text-6xl uppercase tracking-tight text-paper">
          The Hoodie Collection
        </h1>
        <p className="font-body text-sm sm:text-base text-muted max-w-2xl leading-relaxed">
          Premium 300+ GSM heavyweight cotton fleece hoodies featuring <strong className="text-paper">Design 01: The Gateway</strong> and <strong className="text-paper">Design 02: Bus Stories</strong>, each in Black, Camel and Maroon. Pick your colour and size, and get your CUET batch printed on the back.
        </p>
      </div>

      {/* Product Grid with Filters */}
      <ProductGrid products={PRODUCTS} initialCategory={categoryParam} showFilters={true} />
    </div>
  );
};

export default Products;
