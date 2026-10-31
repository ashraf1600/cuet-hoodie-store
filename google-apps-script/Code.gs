/**
 * CUET Hoodie Store — order receiver for Google Sheets.
 *
 * Setup (5 minutes) — full steps in README.md, "Connect the Google Sheet":
 *   1. Create a Google Sheet → Extensions → Apps Script → paste this file → Save.
 *   2. Deploy → New deployment → type "Web app"
 *        Execute as: Me      Who has access: Anyone
 *   3. Copy the Web app URL (ends in /exec) into the website's .env:
 *        VITE_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
 *   4. Restart `npm run dev` (or redeploy the website).
 *
 * What it does with each order:
 *   - Adds one row to the "Orders" tab (created automatically, header row frozen).
 *   - Uses the column names sent by the website, so the Sheet always matches the CSV export.
 *   - Keeps phone numbers, student IDs and TrxIDs as text (no lost leading zeros).
 *   - Ignores a repeat of the same Order Number (e.g. a double click).
 *   - Marks a Transaction ID that was already used in an earlier order as "CHECK: TrxID used before".
 *   - Adds "Received At" (sheet time) and a "Status" column you can change to Paid / Printed / Delivered.
 */

var SHEET_NAME = 'Orders';
var EXTRA_HEADERS = ['Received At', 'Status', 'Check'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var row = payload.row || {};
    var headers = payload.headers || Object.keys(row);
    if (!row['Order Number']) return reply({ ok: false, error: 'Missing Order Number' });

    var sheet = getSheet(headers);
    var allHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var col = function (name) { return allHeaders.indexOf(name) + 1; };

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      // Same order sent twice → already saved, nothing to do.
      var orderNumbers = sheet.getRange(2, col('Order Number'), lastRow - 1, 1).getDisplayValues();
      for (var i = 0; i < orderNumbers.length; i++) {
        if (String(orderNumbers[i][0]) === String(row['Order Number'])) {
          return reply({ ok: true, duplicate: true, orderNumber: row['Order Number'] });
        }
      }
    }

    var duplicateTrx = false;
    var trx = String(row['Transaction ID'] || '').toUpperCase();
    if (trx && lastRow > 1 && col('Transaction ID') > 0) {
      var trxIds = sheet.getRange(2, col('Transaction ID'), lastRow - 1, 1).getDisplayValues();
      for (var j = 0; j < trxIds.length; j++) {
        if (String(trxIds[j][0]).toUpperCase() === trx) { duplicateTrx = true; break; }
      }
    }

    var values = allHeaders.map(function (h) {
      if (h === 'Received At') return new Date();
      if (h === 'Status') return 'New — check bKash';
      if (h === 'Check') return duplicateTrx ? 'CHECK: TrxID used before' : '';
      var v = row[h];
      return v === undefined || v === null ? '' : v;
    });

    var target = sheet.getRange(lastRow + 1, 1, 1, values.length);
    // Text format first, so "01712345678" keeps its 0 — then put numbers/dates back in their own format.
    target.setNumberFormat('@');
    ['Quantity', 'Unit Price', 'Total Price'].forEach(function (h) {
      if (col(h) > 0) sheet.getRange(lastRow + 1, col(h)).setNumberFormat('0');
    });
    if (col('Received At') > 0) sheet.getRange(lastRow + 1, col('Received At')).setNumberFormat('yyyy-mm-dd hh:mm');
    target.setValues([values]);
    if (duplicateTrx) target.setBackground('#fde2e1');

    return reply({ ok: true, orderNumber: row['Order Number'], duplicateTrx: duplicateTrx });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/** Opening the /exec URL in a browser shows this — handy to check the deployment works. */
function doGet() {
  return reply({ ok: true, message: 'CUET Hoodie order receiver is running.' });
}

function getSheet(headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  var wanted = headers.concat(EXTRA_HEADERS);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, wanted.length).setValues([wanted]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return sheet;
  }

  // Add any new column the website starts sending, without touching existing data.
  var existing = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var missing = wanted.filter(function (h) { return existing.indexOf(h) === -1; });
  if (missing.length) {
    sheet.getRange(1, existing.length + 1, 1, missing.length).setValues([missing]).setFontWeight('bold');
  }
  return sheet;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
