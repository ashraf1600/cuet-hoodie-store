import { Order } from '../types';
import { ORDER_COLUMNS, orderToRow } from './orderColumns';

/**
 * Sends a placed order to Google so every order lands in one place.
 *
 * Option 1 (recommended): Google Apps Script web app → Google Sheet.
 *   Set VITE_GOOGLE_SHEET_WEBHOOK_URL. The script (google-apps-script/Code.gs) replies
 *   with { ok: true }, so the website knows the order really arrived.
 *
 * Option 2: Google Form. Set VITE_GOOGLE_FORM_URL and every VITE_GF_ENTRY_* id.
 *   Google Forms never reply to the website, so delivery can't be confirmed.
 */

export type SubmissionStatus =
  /** Google Sheet confirmed it saved the order */
  | 'saved'
  /** Request was sent but Google can't confirm it (Google Form, or browser blocked the reply) */
  | 'sent'
  /** No Google Sheet / Form is set up in .env */
  | 'not-configured'
  /** Network error — the order did not reach Google */
  | 'failed';

export interface SubmissionResult {
  status: SubmissionStatus;
  method: 'sheet' | 'form' | 'none';
  detail?: string;
}

const TIMEOUT_MS = 15000;

const withTimeout = async (url: string, init: RequestInit): Promise<Response> => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
};

const FORM_ENTRY_ENV: Record<string, string | undefined> = {
  'Order Number': import.meta.env.VITE_GF_ENTRY_ORDER_NUMBER,
  Name: import.meta.env.VITE_GF_ENTRY_NAME,
  'Student ID': import.meta.env.VITE_GF_ENTRY_STUDENT_ID,
  'University Email': import.meta.env.VITE_GF_ENTRY_EMAIL,
  Phone: import.meta.env.VITE_GF_ENTRY_PHONE,
  Batch: import.meta.env.VITE_GF_ENTRY_BATCH,
  Design: import.meta.env.VITE_GF_ENTRY_HOODIE,
  Colour: import.meta.env.VITE_GF_ENTRY_COLOUR,
  Size: import.meta.env.VITE_GF_ENTRY_SIZE,
  Quantity: import.meta.env.VITE_GF_ENTRY_QTY,
  'Total Price': import.meta.env.VITE_GF_ENTRY_TOTAL,
  'bKash Number': import.meta.env.VITE_GF_ENTRY_BKASH,
  'Transaction ID': import.meta.env.VITE_GF_ENTRY_TRXID,
  'Delivery Address': import.meta.env.VITE_GF_ENTRY_ADDRESS,
  Notes: import.meta.env.VITE_GF_ENTRY_NOTES,
};

const REQUIRED_FORM_FIELDS = ['Order Number', 'Name', 'Phone', 'Design', 'Colour', 'Size', 'Transaction ID'];

const isRealUrl = (u?: string) => !!u && /^https:\/\//.test(u.trim()) && !/your-(script|form)-id/.test(u);

export const getSubmissionMethod = (): 'sheet' | 'form' | 'none' => {
  if (isRealUrl(import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL)) return 'sheet';
  const formReady =
    isRealUrl(import.meta.env.VITE_GOOGLE_FORM_URL) && REQUIRED_FORM_FIELDS.every(f => !!FORM_ENTRY_ENV[f]);
  return formReady ? 'form' : 'none';
};

const submitToSheet = async (order: Order): Promise<SubmissionResult> => {
  const url = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL!.trim();
  // text/plain keeps this a "simple" request, so Apps Script accepts it without a CORS preflight.
  const body = JSON.stringify({ headers: ORDER_COLUMNS.map(c => c.header), row: orderToRow(order) });
  try {
    const res = await withTimeout(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body,
      redirect: 'follow',
    });
    const data = await res.json().catch(() => null);
    if (data && data.ok) return { status: 'saved', method: 'sheet', detail: data.duplicateTrx ? 'duplicate-trx' : undefined };
    return { status: 'failed', method: 'sheet', detail: data?.error || `HTTP ${res.status}` };
  } catch (err) {
    // Some browsers/extensions block reading the reply. Fall back to a fire-and-forget send.
    try {
      await withTimeout(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body });
      return { status: 'sent', method: 'sheet' };
    } catch (err2) {
      return { status: 'failed', method: 'sheet', detail: String(err2 || err) };
    }
  }
};

const submitToForm = async (order: Order): Promise<SubmissionResult> => {
  const postUrl = import.meta.env.VITE_GOOGLE_FORM_URL!.trim().replace(/\/viewform(\?.*)?$/, '/formResponse');
  const row = orderToRow(order);
  const formData = new FormData();
  Object.entries(FORM_ENTRY_ENV).forEach(([header, entry]) => {
    if (entry && row[header] !== undefined && row[header] !== '') formData.append(entry, String(row[header]));
  });
  try {
    await withTimeout(postUrl, { method: 'POST', mode: 'no-cors', body: formData });
    return { status: 'sent', method: 'form' };
  } catch (err) {
    return { status: 'failed', method: 'form', detail: String(err) };
  }
};

export const submitOrderToGoogleService = async (order: Order): Promise<SubmissionResult> => {
  const method = getSubmissionMethod();
  if (method === 'sheet') return submitToSheet(order);
  if (method === 'form') return submitToForm(order);
  return { status: 'not-configured', method: 'none' };
};
