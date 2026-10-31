export interface ProductVariant {
  /** Transparent-background product shot for this colour */
  cutout: string;
  /** Gallery images for this colour (all transparent cutouts) */
  images: string[];
}

export interface Product {
  id: string;
  name: string;
  designNumber: string;
  tagline: string;
  description: string;
  price: number;
  colours: string[];
  sizes: string[];
  batches: string[];
  fabric: string;
  category: string;
  featured: boolean;
  /** Images per colour, keyed by colour name */
  variants: Record<string, ProductVariant>;
  /** Campaign posters (rectangular photos) shown in the story section */
  posters: string[];
  /** Artwork / story images */
  story: string[];
}

export interface Order {
  orderNumber: string;
  customerName: string;
  studentId: string;
  universityEmail: string;
  personalEmail?: string;
  phoneNumber: string;
  batch: string;
  department?: string;

  hoodieName: string;
  colour: string;
  size: string;
  quantity: number;

  unitPrice: number;
  totalPrice: number;

  paymentMethod: string;
  bkashNumber: string;
  transactionId: string;

  deliveryAddress: string;
  instructions?: string;

  orderDate: string;
}

export interface OrderFilter {
  searchQuery: string;
  batch: string;
}
