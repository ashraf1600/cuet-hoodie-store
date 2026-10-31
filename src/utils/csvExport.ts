import { Order } from '../types';
import { ORDER_COLUMNS } from './orderColumns';

const quote = (s: string) => `"${s.replace(/"/g, '""')}"`;

/**
 * Builds the CSV text (same columns as the Google Sheet).
 * Phone numbers, TrxIDs etc. are written as ="..." so Excel keeps leading zeros
 * and doesn't turn codes like 8E52... into scientific notation.
 */
export const buildOrdersCsv = (orders: Order[]): string => {
  const header = ORDER_COLUMNS.map(c => quote(c.header)).join(',');
  const rows = orders.map(order =>
    ORDER_COLUMNS.map(c => {
      const raw = c.value(order);
      const str = raw === undefined || raw === null ? '' : String(raw);
      if (c.text && /^[0-9+]/.test(str)) return `=${quote(str)}`;
      return quote(str);
    }).join(',')
  );
  return [header, ...rows].join('\r\n');
};

/**
 * Downloads a CSV of the given orders. Includes a UTF-8 BOM so Excel shows Bangla text correctly.
 */
export const exportOrdersToCsv = (orders: Order[], filename = 'CUET_Hoodie_Orders.csv'): boolean => {
  if (!orders || orders.length === 0) {
    alert('No orders available to export.');
    return false;
  }

  const blob = new Blob(['﻿' + buildOrdersCsv(orders)], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
};
