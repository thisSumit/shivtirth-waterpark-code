# PayU + Google Apps Script Email and Sheet Logging

Use this Apps Script in your Google Sheet so successful and failed PayU payments are stored in separate tabs, the customer receives one final HTML email, and paid bookings notify `shivtirthbookings@gmail.com` with the full booking details.

## Setup

1. Open your Google Sheet.
2. Go to `Extensions > Apps Script`.
3. Replace the script with the code below.
4. Update the sheet tab names if you want different names.
5. Deploy as a Web App.
6. Set `Who has access` to `Anyone`.
7. Copy the Web App URL.
8. Add it to your app environment file:

```env
NEXT_PUBLIC_GOOGLE_SHEET_SCRIPT_URL=""
BOOKING_NOTIFICATION_EMAIL="shivtirthbookings@gmail.com"
```

## Apps Script

```javascript
const PAID_SHEET_NAME = 'Paid Bookings';
const FAILED_SHEET_NAME = 'Failed Bookings';
const OWNER_NOTIFICATION_EMAIL = 'shivtirthbookings@gmail.com';
const FINAL_STATUSES = ['Paid', 'Failed'];
const ADD_ON_PRICE_MAP = {
  Breakfast: 50,
  Lunch: 250,
  Dinner: 250,
  'Combined Coupon (All 3 Meals)': 550,
};

function doPost(e) {
  try {
    const payload = parsePayload(e);
    const paymentStatus = String(payload.paymentStatus || '').trim();

    if (!payload.email) {
      return jsonResponse({ success: false, error: 'Email is required.' });
    }

    const sheetName = paymentStatus === 'Paid' ? PAID_SHEET_NAME : FAILED_SHEET_NAME;
    const sheet = ensureSheet(sheetName);
    const txnId = String(payload.txnid || payload.gatewayTxnId || '').trim();
    const row = buildRow(payload, paymentStatus);

    const existingRow = findRowByTxn(sheet, txnId);
    const paidSheet = ssGetSheet(PAID_SHEET_NAME);
    const paidRowExists = paymentStatus === 'Failed' ? Boolean(findRowByTxn(paidSheet, txnId)) : false;
    const rowNumber = upsertRow(sheet, txnId, row, existingRow);

    const notificationSent = hasNotificationSent(sheet, rowNumber, paymentStatus);
    if (FINAL_STATUSES.includes(paymentStatus) && !paidRowExists && !notificationSent) {
      sendStatusEmail(payload, paymentStatus);
      markNotification(sheet, rowNumber, paymentStatus);
    }

    return jsonResponse({ success: true, sheet: sheetName });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function ensureSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow([
      'Timestamp',
      'Payment Status',
      'Payment Label',
      'Transaction ID',
      'Gateway Transaction ID',
      'Gateway Status',
      'Booking Date',
      'Name',
      'Mobile',
      'Email',
      'Visit Date',
      'Plan Name',
      'Ticket Type',
      'Ticket Price',
      'Ticket Qty',
      'Ticket Subtotal',
      'Add-ons',
      'Add-ons Subtotal',
      'Total Amount',
      'Source',
      'Submitted At',
      'Notification Status',
      'Notified At'
    ]);
  }

  return sheet;
}

function ssGetSheet(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

function findRowByTxn(sheet, txnId) {
  if (!sheet || !txnId) return null;

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][3]) === String(txnId)) {
      return { rowNumber: i + 1, values: values[i] };
    }
  }

  return null;
}

function hasNotificationSent(sheet, rowNumber, paymentStatus) {
  if (!sheet || !rowNumber) return false;
  const value = String(sheet.getRange(rowNumber, 22).getValue() || '').trim();
  return value === paymentStatus;
}

function markNotification(sheet, rowNumber, paymentStatus) {
  if (!sheet || !rowNumber) return;
  sheet.getRange(rowNumber, 22, 1, 2).setValues([[paymentStatus, new Date()]]);
}

function buildRow(payload, paymentStatus) {
  const ticketQty = Number(payload.ticketQty || 0);
  const addOnSubtotal = Number(payload.addOnSubtotal || parseAddOnSubtotal(payload.addOnSummary || 'None'));
  const totalAmount = Number(payload.totalAmount || 0);
  const ticketSubtotal = Number(
    payload.ticketSubtotal || (totalAmount > 0 ? Math.max(totalAmount - addOnSubtotal, 0) : 0)
  );
  const ticketPrice = Number(
    payload.ticketPrice || (ticketQty > 0 ? Math.round(ticketSubtotal / ticketQty) : 0)
  );
  const bookingDate = payload.bookedDate || payload.submittedAt || new Date().toISOString();

  return [
    new Date(),
    paymentStatus,
    payload.paymentStatusLabel || '',
    payload.txnid || '',
    payload.gatewayTxnId || '',
    payload.gatewayStatus || '',
    bookingDate,
    payload.name || '',
    payload.mobile || '',
    payload.email || '',
    payload.visitDate || '',
    payload.planName || '',
    payload.ticketType || '',
    ticketPrice || '',
    ticketQty || '',
    ticketSubtotal || '',
    payload.addOnSummary || 'None',
    addOnSubtotal || '',
    totalAmount || '',
    payload.source || '',
    payload.submittedAt || '',
    '',
    ''
  ];
}

function upsertRow(sheet, txnId, row, existingRow) {
  if (!txnId) {
    sheet.appendRow(row);
    return sheet.getLastRow();
  }

  if (existingRow && existingRow.rowNumber) {
    sheet.getRange(existingRow.rowNumber, 1, 1, row.length).setValues([row]);
    return existingRow.rowNumber;
  }

  sheet.appendRow(row);
  return sheet.getLastRow();
}

function sendStatusEmail(payload, paymentStatus) {
  const subject = paymentStatus === 'Paid'
    ? 'Your Shivtirth Waterpark ticket is confirmed'
    : 'Your Shivtirth Waterpark payment failed';

  const htmlBody = buildEmailHtml(payload, paymentStatus);

  MailApp.sendEmail({
    to: payload.email,
    subject: subject,
    htmlBody: htmlBody,
  });

  const ownerEmail = String(payload.notifyAdminEmail || OWNER_NOTIFICATION_EMAIL || '').trim();
  if (ownerEmail) {
    MailApp.sendEmail({
      to: ownerEmail,
      subject: paymentStatus === 'Paid'
        ? 'New paid booking received - Shivtirth Waterpark'
        : 'Failed payment notification - Shivtirth Waterpark',
      htmlBody: htmlBody,
    });
  }
}

function buildEmailHtml(payload, paymentStatus) {
  const accent = paymentStatus === 'Paid' ? '#0f172a' : '#991b1b';
  const statusColor = paymentStatus === 'Paid' ? '#16a34a' : '#dc2626';
  const statusText = paymentStatus === 'Paid'
    ? 'Ticket Confirmed'
    : 'Payment Failed';
  const ticketQty = Number(payload.ticketQty || 0);
  const addOnSubtotal = Number(payload.addOnSubtotal || parseAddOnSubtotal(payload.addOnSummary || 'None'));
  const totalAmount = Number(payload.totalAmount || 0);
  const ticketSubtotal = Number(
    payload.ticketSubtotal || (totalAmount > 0 ? Math.max(totalAmount - addOnSubtotal, 0) : 0)
  );
  const ticketPrice = Number(
    payload.ticketPrice || (ticketQty > 0 ? Math.round(ticketSubtotal / ticketQty) : 0)
  );
  const bookingDate = payload.bookedDate || payload.submittedAt || new Date().toISOString();

  return `
  <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
    <div style="max-width:680px;margin:0 auto;padding:28px 16px;">
      <div style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 12px 40px rgba(15,23,42,.08);">
        <div style="padding:28px;background:linear-gradient(135deg, ${accent}, #334155);color:#fff;">
          <div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;opacity:.8;margin-bottom:10px;">Shivtirth Waterpark</div>
          <h1 style="margin:0;font-size:28px;line-height:1.2;">${statusText}</h1>
          <p style="margin:10px 0 0;opacity:.92;">${paymentStatus === 'Paid' ? 'Thank you for booking with us.' : 'Please try again to complete your booking.'}</p>
        </div>

        <div style="padding:28px;">
          <div style="display:inline-block;padding:8px 14px;border-radius:999px;background:${statusColor};color:#fff;font-size:12px;font-weight:bold;margin-bottom:18px;">${payload.paymentStatusLabel || paymentStatus}</div>

          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;color:#0f172a;">
            <tr><td style="padding:8px 0;color:#64748b;">Booking Date</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(bookingDate)}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Transaction ID</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.txnid || payload.gatewayTxnId || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Name</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.name || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Mobile</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.mobile || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.email || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Visit Date</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.visitDate || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Plan / Package</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.planName || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Ticket Type</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.ticketType || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Ticket Price</td><td style="padding:8px 0;font-weight:bold;">₹${escapeHtml(String(ticketPrice || '0'))}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">People / Quantity</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(String(ticketQty || ''))}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Ticket Subtotal</td><td style="padding:8px 0;font-weight:bold;">₹${escapeHtml(String(ticketSubtotal || '0'))}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Add-ons</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.addOnSummary || 'None')}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Add-ons Subtotal</td><td style="padding:8px 0;font-weight:bold;">₹${escapeHtml(String(addOnSubtotal || '0'))}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Total Amount</td><td style="padding:8px 0;font-weight:bold;">₹${escapeHtml(String(totalAmount || '0'))}</td></tr>
          </table>

          <div style="margin-top:24px;padding:18px;border-radius:18px;background:#f8fafc;border:1px solid #e2e8f0;color:#334155;">
            ${paymentStatus === 'Paid'
              ? 'Please take a screenshot of this confirmation email and keep the transaction ID for your records.'
              : 'Your payment was not completed. Please try again using the checkout page.'}
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseAddOnSubtotal(summary) {
  if (!summary || summary === 'None') return 0;

  return String(summary)
    .split(',')
    .map(function (item) {
      return item.trim();
    })
    .reduce(function (sum, item) {
      var match = item.match(/^(.*)\s+x\s+(\d+)$/i);
      if (!match) return sum;

      var name = match[1].trim();
      var qty = Number(match[2]);
      var unitPrice = ADD_ON_PRICE_MAP[name];

      if (!isFinite(qty) || qty <= 0 || !isFinite(unitPrice)) {
        return sum;
      }

      return sum + unitPrice * qty;
    }, 0);
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
```

## Notes

- Paid bookings go into the `Paid Bookings` tab.
- Failed bookings go into the `Failed Bookings` tab.
- The customer receives a styled HTML email only for the final success or final failure state.
- If `BOOKING_NOTIFICATION_EMAIL` is set, paid bookings also trigger an owner/admin notification email.
- If you change the tab names, update the constants at the top.
- The app sends the same booking payload from PayU success/failure callbacks, so you get consistent records even if the user closes the browser.
