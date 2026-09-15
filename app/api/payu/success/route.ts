import { NextRequest, NextResponse } from 'next/server'
import {
  buildBookingFromPayuCallback,
  parseAddOnsFromSummary,
  submitBookingToDestinations,
} from '@/lib/checkout-booking'

const getStringValue = (payload: unknown, keys: string[]) => {
  if (!payload || typeof payload !== 'object') return ''

  const record = payload as Record<string, unknown>

  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return ''
}

const normalizePayload = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return {}

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : String(value ?? ''),
    ])
  )
}

const isSuccessStatus = (status: string) => {
  const normalized = status.trim().toLowerCase()
  return normalized.includes('success') || normalized.includes('paid')
}

const processSuccessCallback = async (callbackPayload: Record<string, string>) => {
  const txnid = callbackPayload.txnid || ''
  let existingBooking: any = null

  if (txnid) {
    try {
      const { supabaseAdmin } = await import('@/lib/supabaseAdmin')
      const { data } = await supabaseAdmin.from('bookings').select('*').eq('txnid', txnid).maybeSingle()
      existingBooking = data
    } catch (e) {
      console.error('Error querying existing booking on success callback:', e)
    }
  }

  const callbackBooking = buildBookingFromPayuCallback(callbackPayload, txnid)

  const booking = existingBooking
    ? {
        txnid: existingBooking.txnid || callbackBooking.txnid,
        name: existingBooking.name || callbackBooking.name,
        mobile: existingBooking.mobile || callbackBooking.mobile,
        email: existingBooking.email || callbackBooking.email,
        city: existingBooking.city || callbackBooking.city,
        adultQty: Number(existingBooking.adult_qty || callbackBooking.adultQty || 1),
        kids1Qty: Number(existingBooking.kid1_qty || callbackBooking.kids1Qty || 0),
        kids2Qty: Number(existingBooking.kid2_qty || callbackBooking.kids2Qty || 0),
        bookedDate: existingBooking.booked_date || callbackBooking.bookedDate,
        visitDate: existingBooking.visit_date || callbackBooking.visitDate,
        planName: existingBooking.plan_name || callbackBooking.planName,
        ticketType: existingBooking.ticket_type || callbackBooking.ticketType,
        ticketPrice: Number(existingBooking.ticket_price || callbackBooking.ticketPrice || 0),
        ticketQty: Number(existingBooking.ticket_qty || callbackBooking.ticketQty || 1),
        ticketSubtotal: Number(existingBooking.ticket_subtotal || callbackBooking.ticketSubtotal || 0),
        addOns: callbackBooking.addOns?.length ? callbackBooking.addOns : (existingBooking.addon_summary ? parseAddOnsFromSummary(existingBooking.addon_summary) : []),
        addOnSummary: (existingBooking.addon_summary && existingBooking.addon_summary !== 'None') ? existingBooking.addon_summary : callbackBooking.addOnSummary,
        addOnSubtotal: Number(existingBooking.addon_subtotal || callbackBooking.addOnSubtotal || 0),
        totalAmount: Number(existingBooking.total_amount || callbackBooking.totalAmount || 0),
        rulesAccepted: Boolean(existingBooking.rules_accepted ?? true),
        consentAccepted: Boolean(existingBooking.consent_accepted ?? true),
        source: 'checkout-page' as const,
        submittedAt: existingBooking.created_at || new Date().toISOString(),
      }
    : callbackBooking

  const meta = {
    gatewayTxnId: callbackPayload.mihpayid || callbackPayload.txnid || booking.txnid,
    gatewayStatus: callbackPayload.status || 'success',
    gatewayResponse: JSON.stringify(callbackPayload),
  }
  await submitBookingToDestinations(booking, 'Paid', meta)
}

export async function POST(request: NextRequest) {
  try {
    const ct = request.headers.get('content-type') || ''
    let payload: unknown = {}

    if (ct.includes('application/json')) {
      payload = await request.json()
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      payload = Object.fromEntries(new URLSearchParams(text))
    } else {
      try {
        payload = await request.json()
      } catch {
        payload = await request.text()
      }
    }

    // Log callback for debugging (server logs)
    console.log('PayU success callback received:', payload)

    const callbackPayload = normalizePayload(payload)
    if (callbackPayload.status && !isSuccessStatus(callbackPayload.status)) {
      const redirectUrl = new URL('/checkout/confirm', request.nextUrl.origin)
      return NextResponse.redirect(redirectUrl, 303)
    }

    await processSuccessCallback(callbackPayload)

    const txnid = getStringValue(payload, ['txnid'])
    const mihpayid = getStringValue(payload, ['mihpayid'])
    const redirectUrl = new URL('/checkout/confirm', request.nextUrl.origin)

    if (txnid) redirectUrl.searchParams.set('txnid', txnid)
    if (mihpayid) redirectUrl.searchParams.set('mihpayid', mihpayid)

    return NextResponse.redirect(redirectUrl, 303)
  } catch (err) {
    console.error('Error handling PayU success callback:', err)
  }

  return NextResponse.redirect(new URL('/checkout/confirm', request.nextUrl.origin), 303)
}

export async function GET(request: NextRequest) {
  try {
    const callbackPayload = Object.fromEntries(request.nextUrl.searchParams.entries())

    if (Object.keys(callbackPayload).length) {
      console.log('PayU success GET callback received:', callbackPayload)
      if (callbackPayload.status && !isSuccessStatus(callbackPayload.status)) {
        return NextResponse.redirect(new URL('/checkout/confirm', request.nextUrl.origin), 303)
      }
      await processSuccessCallback(callbackPayload)
    }

    const txnid = callbackPayload.txnid || ''
    const mihpayid = callbackPayload.mihpayid || ''
    const redirectUrl = new URL('/checkout/confirm', request.nextUrl.origin)

    if (txnid) redirectUrl.searchParams.set('txnid', txnid)
    if (mihpayid) redirectUrl.searchParams.set('mihpayid', mihpayid)

    return NextResponse.redirect(redirectUrl, 303)
  } catch (err) {
    console.error('Error handling PayU success GET callback:', err)
  }

  return NextResponse.redirect(new URL('/checkout/confirm', request.nextUrl.origin), 303)
}
