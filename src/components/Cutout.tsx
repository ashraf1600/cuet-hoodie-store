import React from 'react';

interface CutoutProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Warm spotlight behind the figure so dark hoodies separate from the black page */
  glow?: boolean;
  /** Soft contact shadow under hanging / flat products */
  floor?: boolean;
  /** Fade the bottom edge into the page (for photos cropped at the waist or legs) */
  fade?: boolean;
  loading?: 'lazy' | 'eager';
}

/**
 * A transparent-background image that sits directly on the dark page —
 * no frame, box or rectangle — lit by a soft spotlight and grounded by a shadow.
 */
export const Cutout: React.FC<CutoutProps> = ({
  src, alt, className = '', imgClassName = '', glow = true, floor = false, fade = false, loading = 'lazy',
}) => (
  <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} isolate ${className}`}>
    {glow && <div aria-hidden="true" className="cutout-glow" />}
    {floor && <div aria-hidden="true" className="cutout-floor" />}
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      draggable={false}
      className={`relative w-full h-full object-contain cutout-img ${fade ? 'cutout-fade' : ''} ${imgClassName}`}
    />
  </div>
);

export default Cutout;
