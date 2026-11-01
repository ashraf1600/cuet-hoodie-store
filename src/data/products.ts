import { Product } from '../types';

const SIZES = ['M', 'L', 'XL', 'XXL'];

/** Garment measurements in inches (hoodie laid flat; chest = full round). Update to match your supplier's chart. */
export const SIZE_CHART = [
  { size: 'M', chest: 42, length: 28, sleeve: 25 },
  { size: 'L', chest: 44, length: 29, sleeve: 25.5 },
  { size: 'XL', chest: 46, length: 30, sleeve: 26 },
  { size: 'XXL', chest: 48, length: 31, sleeve: 26.5 },
];

export const getSizeInfo = (size: string) => SIZE_CHART.find(s => s.size === size);
/** Batches that can be printed on the back. */
export const BATCHES = ["CUET'18", "CUET'19", "CUET'20", "CUET'21", "CUET'22", "CUET'23", "CUET'24", "CUET'25"];
const FABRIC = '300+ GSM heavyweight cotton fleece · DTF print · double-layer hood · ribbed cuffs and hem · unisex fit';

/** Colours offered for both designs, with swatch fills for the colour picker. */
export const COLOURS = [
  { name: 'Black', swatch: '#111111' },
  { name: 'Camel', swatch: '#C9B79C' },
  { name: 'Maroon', swatch: '#6E1F24' },
] as const;

const P = '/assets/photos';
const C = '/assets/cutouts';

export const PRODUCTS: Product[] = [
  {
    id: 'the-gateway',
    name: 'The Gateway',
    designNumber: '01',
    tagline: 'Chittagong University of Engineering & Technology · Since 1968',
    description:
      'The campus gateway, rendered as a bold architectural print on the chest. Your batch (e.g. CUET\'25) goes on the back.',
    price: 700,
    colours: ['Black', 'Camel', 'Maroon'],
    sizes: SIZES,
    batches: BATCHES,
    fabric: FABRIC,
    category: 'The Gateway',
    featured: true,
    variants: {
      Black: {
        cutout: `${C}/gateway-black.webp`,
        images: [`${C}/gateway-black.webp`, `${C}/model-black-front.webp`, `${C}/model-black-back.webp`],
      },
      Camel: {
        cutout: `${C}/gateway-camel.webp`,
        images: [`${C}/gateway-camel.webp`, `${C}/gateway-camel-flat-front.webp`, `${C}/gateway-camel-flat-back.webp`, `${C}/model-camel-front.webp`, `${C}/model-camel-back.webp`],
      },
      Maroon: {
        cutout: `${C}/gateway-maroon.webp`,
        images: [`${C}/gateway-maroon.webp`, `${C}/model-maroon-front.webp`, `${C}/model-maroon-back.webp`],
      },
    },
    posters: [`${P}/gateway-black-poster.jpg`, `${P}/gateway-camel-poster.jpg`, `${P}/gateway-maroon-poster.jpg`, `${P}/gateway-maroon-lookbook.jpg`],
    story: [`${P}/gateway-artwork.jpg`, `${P}/batchwise.jpg`],
  },
  {
    id: 'bus-stories',
    name: 'Bus Stories',
    designNumber: '02',
    tagline: 'The campus bus, the tree and the ride we all remember',
    description:
      'A painted scene of the CUET bus under a starry sky — the songs, the banter and the long rides to Raozan. Your batch goes on the back.',
    price: 700,
    colours: ['Black', 'Camel', 'Maroon'],
    sizes: SIZES,
    batches: BATCHES,
    fabric: FABRIC,
    category: 'Bus Stories',
    featured: true,
    variants: {
      Black: {
        cutout: `${C}/bus-black.webp`,
        images: [`${C}/bus-black.webp`, `${C}/bus-model-black-front.webp`, `${C}/model-black-back.webp`],
      },
      Camel: {
        cutout: `${C}/bus-camel.webp`,
        images: [`${C}/bus-camel.webp`, `${C}/bus-model-camel-front.webp`, `${C}/model-camel-back.webp`],
      },
      Maroon: {
        cutout: `${C}/bus-maroon.webp`,
        images: [`${C}/bus-maroon.webp`, `${C}/bus-model-maroon-front.webp`, `${C}/bus-model-maroon-back.webp`],
      },
    },
    posters: [`${P}/bus-black-poster.jpg`, `${P}/bus-camel-poster.jpg`, `${P}/bus-maroon-poster.jpg`, `${P}/bus-black-lookbook.jpg`],
    story: [`${P}/bus-story.jpg`, `${P}/bus-artwork.jpg`],
  },
];

export const getProductById = (id: string): Product | undefined => PRODUCTS.find(p => p.id === id);

export const getFeaturedProducts = (): Product[] => PRODUCTS.filter(p => p.featured);

export const getCategories = (): string[] => Array.from(new Set(PRODUCTS.map(p => p.category)));

/** Images for one colour of a product, falling back to the first colour. */
export const getVariant = (product: Product, colour: string) =>
  product.variants[colour] || product.variants[product.colours[0]];

/** Old links used names like "Midnight Black" — map them onto the current colours. */
export const normaliseColour = (product: Product, colour?: string) => {
  if (!colour) return product.colours[0];
  const match = product.colours.find(c => colour.toLowerCase().includes(c.toLowerCase()));
  if (match) return match;
  if (/sand|beige|brown/i.test(colour)) return 'Camel';
  return product.colours[0];
};

/**
 * Home hero slideshow — one slide per design + colour that has model photos.
 * `front` is the large figure, `back` (optional) stands behind it showing the batch print.
 * Add a line here when new model cut-outs are added to public/assets/cutouts.
 */
export const HERO_SLIDES: { productId: string; colour: string; front: string; back?: string }[] = [
  { productId: 'the-gateway', colour: 'Black', front: `${C}/model-black-front.webp`, back: `${C}/model-black-back.webp` },
  { productId: 'the-gateway', colour: 'Camel', front: `${C}/model-camel-front.webp`, back: `${C}/model-camel-back.webp` },
  { productId: 'the-gateway', colour: 'Maroon', front: `${C}/model-maroon-front.webp`, back: `${C}/model-maroon-back.webp` },
  { productId: 'bus-stories', colour: 'Black', front: `${C}/bus-model-black-front.webp`, back: `${C}/model-black-back.webp` },
  { productId: 'bus-stories', colour: 'Camel', front: `${C}/bus-model-camel-front.webp`, back: `${C}/model-camel-back.webp` },
  { productId: 'bus-stories', colour: 'Maroon', front: `${C}/bus-model-maroon-front.webp`, back: `${C}/bus-model-maroon-back.webp` },
];
