import React, { useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, HelpCircle } from 'lucide-react';
import ImageSlider from '../components/ImageSlider';
import SizeChart from '../components/SizeChart';
import { COLOURS, PRODUCTS, getProductById, getVariant, normaliseColour } from '../data/products';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Old links (e.g. /products/the-gateway-hoodie) still land on the right design
  const product = id ? getProductById(id) || PRODUCTS.find(p => id.startsWith(p.id)) : undefined;

  const [selectedColour, setSelectedColour] = useState(
    product ? normaliseColour(product, searchParams.get('colour') || undefined) : '',
  );
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || product?.sizes[0] || '');
  const [selectedBatch, setSelectedBatch] = useState(product?.batches[0] || "CUET'21");
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  if (!product) {
    return (
      <div className="max-w-[1240px] mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-anton text-3xl uppercase text-paper">Product Not Found</h2>
        <p className="font-body text-sm text-muted">The requested hoodie could not be located.</p>
        <Link to="/products" className="btn-outline inline-flex text-xs">
          ← Back to Catalog
        </Link>
      </div>
    );
  }

  const displayImages = getVariant(product, selectedColour).images;

  const handleOrderNow = () => {
    navigate('/order', {
      state: {
        productId: product.id,
        hoodieName: product.name,
        colour: selectedColour,
        size: selectedSize,
        batch: selectedBatch,
        quantity,
        unitPrice: product.price,
      },
    });
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back Link */}
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-wider text-muted hover:text-paper transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to All Hoodies</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Slider */}
        <div className="lg:col-span-7">
          <ImageSlider key={product.id + selectedColour} images={displayImages} productName={product.name} />
        </div>

        {/* Right Column: Product Options & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-line/60 pb-5">
            <span className="font-body text-[11px] uppercase font-bold tracking-[0.2em] text-brick-bright">
              Design {product.designNumber}
            </span>
            <h1 className="font-anton text-3xl sm:text-4xl uppercase text-paper tracking-wide">
              {product.name}
            </h1>
            <p className="font-anton text-2xl sm:text-3xl text-brick-bright">
              ৳{product.price.toLocaleString()}
            </p>
          </div>

          <p className="font-body text-sm text-muted leading-relaxed">
            {product.description}
          </p>

          {/* Option: Design */}
          <div className="space-y-2.5">
            <span className="font-body text-xs uppercase font-bold tracking-wider text-paper">Design</span>
            <div className="grid grid-cols-2 gap-2">
              {PRODUCTS.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}?colour=${encodeURIComponent(selectedColour)}`}
                  aria-current={p.id === product.id ? 'page' : undefined}
                  className={`min-h-11 flex items-center justify-center px-3 border text-xs font-bold uppercase tracking-wider transition-colors ${
                    p.id === product.id ? 'bg-paper text-ink border-paper' : 'border-line text-muted hover:border-paper/60 hover:text-paper'
                  }`}
                >
                  {p.designNumber} · {p.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Option: Colour Selection */}
          <div className="space-y-2.5">
            <label className="font-body text-xs uppercase font-bold tracking-wider text-paper flex items-center justify-between">
              <span>Colour: <strong className="text-brick-bright font-normal">{selectedColour}</strong></span>
            </label>
            <div className="flex gap-3">
              {COLOURS.filter(c => product.colours.includes(c.name)).map(c => (
                <button
                  key={c.name}
                  type="button"
                  aria-pressed={selectedColour === c.name}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setSelectedColour(c.name)}
                  className={`w-12 h-12 rounded-full p-1 border-2 transition-colors cursor-pointer ${
                    selectedColour === c.name ? 'border-brick-bright' : 'border-line hover:border-paper/60'
                  }`}
                >
                  <span className="block w-full h-full rounded-full ring-1 ring-white/10" style={{ backgroundColor: c.swatch }} />
                </button>
              ))}
            </div>
          </div>

          {/* Option: Size Selection */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-body text-xs uppercase font-bold tracking-wider text-paper">
                Size: <strong className="text-brick-bright font-normal">{selectedSize}</strong>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="font-body text-[11px] text-muted-dark hover:text-paper flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle size={12} />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-10 rounded-xs border text-xs font-bold uppercase transition-all cursor-pointer flex items-center justify-center ${
                    selectedSize === size
                      ? 'bg-paper text-ink border-paper ring-1 ring-paper'
                      : 'bg-ink-2 text-muted border-line hover:border-paper/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Collapsible Size Guide Modal/Drawer */}
            {showSizeGuide && (
              <div className="bg-ink-3 border border-line p-3.5 rounded-xs space-y-2 animate-fade-in">
                <SizeChart selected={selectedSize} compact />
                <p className="font-body text-[11px] text-muted">
                  Inches, measured on the hoodie. Between sizes? Go one up.{' '}
                  <Link to="/how-to-order#size-chart" className="underline underline-offset-2 hover:text-paper">How to measure</Link>
                </p>
              </div>
            )}
          </div>

          {/* Option: Batch Selection */}
          <div className="space-y-2.5">
            <label className="font-body text-xs uppercase font-bold tracking-wider text-paper">
              CUET Batch (printed on the back): <strong className="text-brick-bright font-normal">{selectedBatch}</strong>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {product.batches.map(batch => (
                <button
                  key={batch}
                  type="button"
                  onClick={() => setSelectedBatch(batch)}
                  className={`px-2.5 py-1 rounded-xs border text-[11px] font-semibold transition-all cursor-pointer ${
                    selectedBatch === batch
                      ? 'bg-brick-bright text-white border-brick-bright'
                      : 'bg-ink-2 text-muted border-line hover:border-paper/40'
                  }`}
                >
                  {batch}
                </button>
              ))}
            </div>
          </div>


          {/* Option: Quantity Selector */}
          <div className="space-y-2">
            <label className="font-body text-xs uppercase font-bold tracking-wider text-paper">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-line rounded-xs bg-ink-2">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-paper hover:bg-ink-3 transition-colors cursor-pointer text-base"
                >
                  -
                </button>
                <span className="w-12 text-center font-anton text-lg text-paper">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-paper hover:bg-ink-3 transition-colors cursor-pointer text-base"
                >
                  +
                </button>
              </div>

              <div className="font-body text-xs text-muted">
                Total: <strong className="text-paper text-sm font-anton">৳{(product.price * quantity).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          {/* Order Now CTA */}
          <div className="pt-2">
              <button
                type="button"
                onClick={handleOrderNow}
                className="w-full btn-primary py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag size={16} />
                <span>Pre-order {product.name} · ৳{(product.price * quantity).toLocaleString()}</span>
              </button>
          </div>

          {/* Fabric & Specs Accordion Box */}
          <div className="border border-line bg-ink-2 p-4 rounded-xs space-y-2 text-xs font-body">
            <div className="flex items-center gap-2 text-paper font-semibold uppercase tracking-wider text-[11px]">
              <ShieldCheck size={14} className="text-brick-bright" />
              <span>Fabric &amp; Manufacturing Specifications</span>
            </div>
            <p className="text-muted leading-relaxed">
              {product.fabric}
            </p>
            <div className="flex items-center gap-2 text-muted-dark pt-1 text-[11px]">
              <Truck size={12} />
              <span>Pickup available directly on campus or courier delivery to any district in Bangladesh.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
