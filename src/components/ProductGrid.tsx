import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { getCategories } from '../data/products';

interface ProductGridProps {
  products: Product[];
  initialCategory?: string;
  showFilters?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  initialCategory = 'All Hoodies',
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableCategories = ['All Hoodies', ...getCategories()];

  const filteredProducts = products.filter(p => {
    const matchesCategory =
      selectedCategory === 'All Hoodies' || p.category === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesName = p.name.toLowerCase().includes(query);
    const matchesDesc = p.description.toLowerCase().includes(query);
    const matchesCat = p.category.toLowerCase().includes(query);
    const matchesColour = p.colours.some(c => c.toLowerCase().includes(query));
    const matchesDept = false;

    return matchesCategory && (matchesName || matchesDesc || matchesCat || matchesColour || matchesDept);
  });

  const clearAllFilters = () => {
    setSelectedCategory('All Hoodies');
    setSearchQuery('');
  };

  return (
    <div className="space-y-8">
      {/* Search & Category Filter Toolbar */}
      {showFilters && (
        <div className="space-y-4">
          {/* Search Input Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-dark" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by hoodie name, edition, department (e.g. CSE), or colour..."
                className="w-full bg-ink-2 border border-line rounded-xs pl-10 pr-9 py-2.5 font-body text-xs text-paper placeholder:text-muted-dark focus:outline-none focus:border-paper transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-paper p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="font-body text-xs text-muted-dark sm:text-right shrink-0">
              Showing <span className="text-paper font-bold">{filteredProducts.length}</span> of {products.length} pieces
            </div>
          </div>

          {/* Category Filter Pills (Only categories with products) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] rounded-xs border transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-paper text-ink border-paper shadow-sm'
                    : 'bg-ink-2 text-muted border-line hover:text-paper hover:border-paper/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-line bg-ink-2 p-8 rounded-xs space-y-4">
          <p className="font-anton text-2xl uppercase tracking-wider text-paper">No hoodies found</p>
          <p className="font-body text-sm text-muted max-w-md mx-auto">
            {searchQuery
              ? `No hoodies matched "${searchQuery}" in ${selectedCategory === 'All Hoodies' ? 'any category' : selectedCategory}.`
              : `There are no products listed in the "${selectedCategory}" category right now.`}
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="btn-outline text-xs mt-2"
          >
            Clear Filters &amp; View All
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
