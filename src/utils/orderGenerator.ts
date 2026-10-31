/**
 * Order number generator.
 *
 * Format: CUET-YYMMDD-XXXX  (e.g. CUET-261101-7KQ4)
 * The date is the Bangladesh date; XXXX is random, using only characters that
 * can't be confused when read aloud or typed (no 0/O, 1/I/L).
 *
 * Numbers are unique across every customer and device — the old CUET-0001 counter
 * lived in each browser, so every customer's first order got the same number.
 * The number for an in-progress checkout is kept in sessionStorage, so refreshing
 * the checkout page keeps the same number until the order is placed.
 */

const ACTIVE_CHECKOUT_ORDER_KEY = 'cuet_active_checkout_order_number';
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

const randomCode = (length: number): string => {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, b => ALPHABET[b % ALPHABET.length]).join('');
};

const dhakaDateStamp = (date = new Date()): string => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? '00';
  return `${get('year')}${get('month')}${get('day')}`;
};

export const generateOrderNumber = (): string => `CUET-${dhakaDateStamp()}-${randomCode(4)}`;

/** Gets (or creates) the order number for the checkout in progress. */
export const getOrCreateCheckoutOrderNumber = (): string => {
  try {
    const existing = sessionStorage.getItem(ACTIVE_CHECKOUT_ORDER_KEY);
    if (existing && /^CUET-\d{6}-[A-Z0-9]{4}$/.test(existing)) return existing;
    const orderNumber = generateOrderNumber();
    sessionStorage.setItem(ACTIVE_CHECKOUT_ORDER_KEY, orderNumber);
    return orderNumber;
  } catch {
    return generateOrderNumber();
  }
};

/** Call once the order is placed, so the next checkout gets a fresh number. */
export const commitOrderNumber = (_orderNumber?: string): void => {
  try {
    sessionStorage.removeItem(ACTIVE_CHECKOUT_ORDER_KEY);
  } catch {
    /* storage unavailable — nothing to clear */
  }
};

export const cancelActiveCheckoutOrder = (): void => commitOrderNumber();
