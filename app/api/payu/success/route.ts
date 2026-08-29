import { NextRequest, NextResponse } from 'next/server'
import {
  buildBookingFromPayuCallback,
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
  const booking = buildBookingFromPayuCallback(callbackPayload)
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
