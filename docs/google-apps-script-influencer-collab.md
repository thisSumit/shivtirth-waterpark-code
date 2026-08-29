# Google Apps Script for Influencer Collaboration Form

Use this script in the Apps Script editor attached to your Google Sheet. It stores influencer collaboration submissions in a sheet and sends a notification email to your team.

## Setup

1. Open the Google Sheet you want to use for submissions.
2. Go to `Extensions > Apps Script`.
3. Replace the script with the code below.
4. Update `ADMIN_EMAIL` if needed.
5. Deploy as a Web App.
6. Set access to `Anyone`.
7. Copy the Web App URL and use it in your Next.js app.

## Apps Script

```javascript
const SHEET_NAME = 'Influencer Collaborations';
const ADMIN_EMAIL = 'shivtirthbookings@gmail.com';

function doPost(e) {
  try {
    const payload = parsePayload(e);

    if (!payload.fullName || !payload.mobile || !payload.email) {
      return jsonResponse({ success: false, error: 'fullName, mobile, and email are required.' });
    }

    const sheet = ensureSheet();
    const submittedAt = new Date();

    sheet.appendRow([
      submittedAt,
      payload.formType || 'influencer-collaboration',
      payload.fullName || '',
      payload.mobile || '',
      payload.email || '',
      payload.birthDate || '',
      payload.followers || '',
      payload.profileLink || '',
      payload.city || '',
      payload.niche || '',
      payload.message || '',
      normalizeBoolean(payload.acceptGuidelines),
      normalizeBoolean(payload.acceptConsent),
      submittedAt.toISOString(),
    ]);

    sendNotificationEmail(payload, submittedAt);

    return jsonResponse({ success: true, message: 'Influencer collaboration request received.' });
  } catch (error) {
    return jsonResponse({ success: false, error: String(error) });
  }
}

function parsePayload(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    return {};
  }
}

function ensureSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'Timestamp',
      'Form Type',
      'Full Name',
      'Mobile',
      'Email',
      'Birth Date',
      'Followers / Subscribers',
      'Profile Link',
      'City',
      'Niche',
      'Message',
      'Accepted Guidelines',
      'Accepted Consent',
      'Submitted At',
    ]);
  }

  return sheet;
}

function sendNotificationEmail(payload, submittedAt) {
  const subject = 'New Influencer Collaboration Request - Shivtirth Waterpark';
  const htmlBody = buildEmailHtml(payload, submittedAt);

  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: subject,
    htmlBody: htmlBody,
  });

  if (payload.email) {
    MailApp.sendEmail({
      to: payload.email,
      subject: 'Your Shivtirth influencer collaboration request was received',
      htmlBody: buildAcknowledgementHtml(payload, submittedAt),
    });
  }
}

function buildEmailHtml(payload, submittedAt) {
  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
      <div style="max-width:720px;margin:0 auto;padding:24px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;box-shadow:0 12px 30px rgba(15,23,42,.08);">
          <div style="padding:24px 28px;background:linear-gradient(135deg,#0f172a,#334155);color:#fff;">
            <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.8;">Shivtirth Waterpark</div>
            <h1 style="margin:10px 0 0;font-size:28px;line-height:1.2;">New Influencer Collaboration Request</h1>
          </div>
          <div style="padding:28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;color:#0f172a;">
              <tr><td style="padding:8px 0;color:#64748b;width:180px;">Submitted At</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(submittedAt.toString())}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Full Name</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.fullName || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Mobile</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.mobile || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.email || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Birth Date</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.birthDate || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Followers / Subscribers</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.followers || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Profile Link</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.profileLink || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">City</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.city || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Niche</td><td style="padding:8px 0;font-weight:bold;">${escapeHtml(payload.niche || '')}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Guidelines Accepted</td><td style="padding:8px 0;font-weight:bold;">${normalizeBoolean(payload.acceptGuidelines)}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Consent Accepted</td><td style="padding:8px 0;font-weight:bold;">${normalizeBoolean(payload.acceptConsent)}</td></tr>
            </table>
            <div style="margin-top:20px;">
              <div style="color:#64748b;font-size:13px;margin-bottom:8px;">Message</div>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;color:#0f172a;line-height:1.6;">${escapeHtml(payload.message || 'No message provided.')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildAcknowledgementHtml(payload, submittedAt) {
  return `
    <div style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
      <div style="max-width:680px;margin:0 auto;padding:24px;">
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;">
          <div style="padding:24px 28px;background:linear-gradient(135deg,#0f172a,#334155);color:#fff;">
            <h1 style="margin:0;font-size:26px;">We received your request</h1>
          </div>
          <div style="padding:28px;color:#0f172a;line-height:1.7;">
            <p style="margin-top:0;">Thanks, ${escapeHtml(payload.fullName || 'there')}. Our team will review your influencer collaboration request and get back to you soon.</p>
            <p style="margin-bottom:0;color:#64748b;font-size:13px;">Submitted at ${escapeHtml(submittedAt.toString())}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function normalizeBoolean(value) {
  return value === true || value === 'true' ? 'Yes' : 'No';
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Frontend Payload

This script expects the same fields sent by [components/InfluencerCollab.tsx](../components/InfluencerCollab.tsx): `fullName`, `mobile`, `email`, `birthDate`, `followers`, `profileLink`, `city`, `niche`, `message`, `acceptGuidelines`, and `acceptConsent`.