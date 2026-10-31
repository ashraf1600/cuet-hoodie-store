import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Cutout from './Cutout';

interface ImageSliderProps {
  images: string[];
  productName: string;
}

/** Frameless gallery of transparent cut-outs; thumbnails are small cut-outs too. */
export const ImageSlider: React.FC<ImageSliderProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return <div className="aspect-[4/5] flex items-center justify-center text-muted font-body text-sm">No image available</div>;
  }

  const prev = () => setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  const next = () => setCurrentIndex((currentIndex + 1) % images.length);
  const isModel = (src: string) => src.includes('/model-');

  return (
    <div className="flex flex-col gap-6 select-none">
      <div
        className="relative aspect-[4/5]"
        tabIndex={0}
        role="region"
        aria-label={`${productName} photos${images.length > 1 ? ' — use the arrow keys to browse' : ''}`}
        onKeyDown={e => {
          if (e.key === 'ArrowLeft') prev();
          if (e.key === 'ArrowRight') next();
        }}
      >
        <Cutout
          key={images[currentIndex]}
          src={images[currentIndex]}
          alt={`${productName} — photo ${currentIndex + 1} of ${images.length}`}
          loading="eager"
          floor={!isModel(images[currentIndex])}
          fade={isModel(images[currentIndex])}
          className="absolute inset-0 animate-fade-in"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-paper/70 hover:text-paper cursor-pointer"
            >
              <ChevronLeft size={26} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-paper/70 hover:text-paper cursor-pointer"
            >
              <ChevronRight size={26} />
            </button>
            <span className="absolute bottom-0 right-2 font-mono text-xs text-muted">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Photos">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Show photo ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`w-16 h-20 shrink-0 border-b-2 pb-1 transition-colors cursor-pointer ${
                idx === currentIndex ? 'border-brick-bright' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-contain" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
