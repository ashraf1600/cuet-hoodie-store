import { Order } from '../types';

/** Order date/time shown in Bangladesh time, e.g. "2026-11-01 07:40". */
export const formatOrderDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
};

/**
 * The one list of order columns. The CSV export and the Google Sheet both use
 * these headers in this order, so the two always line up.
 * `text: true` marks values that must stay text (leading zeros, letter+digit codes).
 */
export const ORDER_COLUMNS: { header: string; value: (o: Order) => string | number; text?: boolean }[] = [
  { header: 'Order Number', value: o => o.orderNumber, text: true },
  { header: 'Order Date', value: o => formatOrderDate(o.orderDate), text: true },
  { header: 'Name', value: o => o.customerName },
  { header: 'Student ID', value: o => o.studentId, text: true },
  { header: 'University Email', value: o => o.universityEmail },
  { header: 'Personal Email', value: o => o.personalEmail || '' },
  { header: 'Phone', value: o => o.phoneNumber, text: true },
  { header: 'Batch', value: o => o.batch, text: true },
  { header: 'Design', value: o => o.hoodieName },
  { header: 'Colour', value: o => o.colour },
  { header: 'Size', value: o => o.size },
  { header: 'Quantity', value: o => o.quantity },
  { header: 'Unit Price', value: o => o.unitPrice },
  { header: 'Total Price', value: o => o.totalPrice },
  { header: 'Payment Method', value: o => o.paymentMethod },
  { header: 'bKash Number', value: o => o.bkashNumber, text: true },
  { header: 'Transaction ID', value: o => o.transactionId, text: true },
  { header: 'Delivery Address', value: o => o.deliveryAddress },
  { header: 'Notes', value: o => o.instructions || '' },
];

export const ORDER_HEADERS = ORDER_COLUMNS.map(c => c.header);

/** Order as { header: value } — what the website sends to the Google Sheet. */
export const orderToRow = (order: Order): Record<string, string | number> =>
  Object.fromEntries(ORDER_COLUMNS.map(c => [c.header, c.value(order)]));
