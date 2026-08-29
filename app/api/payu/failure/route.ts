import { NextRequest, NextResponse } from 'next/server'
import {
  buildBookingFromPayuCallback,
  submitBookingToDestinations,
} from '@/lib/checkout-booking'

const normalizePayload = (payload: unknown) => {
  if (!payload || typeof payload !== 'object') return {}

  return Object.fromEntries(
    Object.entries(payload as Record<string, unknown>).map(([key, value]) => [
      key,
      typeof value === 'string' ? value : String(value ?? ''),
    ])
  )
}

const isFailureStatus = (status: string) => {
  const normalized = status.trim().toLowerCase()
  return (
    normalized.includes('failure') ||
    normalized.includes('failed') ||
    normalized.includes('cancel') ||
    normalized.includes('error')
  )
}

const processFailureCallback = async (callbackPayload: Record<string, string>) => {
  const booking = buildBookingFromPayuCallback(callbackPayload)
  const meta = {
    gatewayTxnId: callbackPayload.mihpayid || callbackPayload.txnid || booking.txnid,
    gatewayStatus: callbackPayload.status || 'failure',
    gatewayResponse: JSON.stringify(callbackPayload),
  }
  await submitBookingToDestinations(booking, 'Failed', meta)
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
    console.log('PayU failure callback received:', payload)

    const callbackPayload = normalizePayload(payload)
    if (!isFailureStatus(callbackPayload.status || '')) {
      return NextResponse.redirect(new URL('/checkout/failed', request.nextUrl.origin), 303)
    }

    await processFailureCallback(callbackPayload)
  } catch (err) {
    console.error('Error handling PayU failure callback:', err)
  }

  return NextResponse.redirect(new URL('/checkout/failed', request.nextUrl.origin), 303)
}

export async function GET(request: NextRequest) {
  try {
    const callbackPayload = Object.fromEntries(request.nextUrl.searchParams.entries())

    if (Object.keys(callbackPayload).length) {
      console.log('PayU failure GET callback received:', callbackPayload)
      if (!isFailureStatus(callbackPayload.status || '')) {
        return NextResponse.redirect(new URL('/checkout/failed', request.nextUrl.origin), 303)
      }
      await processFailureCallback(callbackPayload)
    }
  } catch (err) {
    console.error('Error handling PayU failure GET callback:', err)
  }

  return NextResponse.redirect(new URL('/checkout/failed', request.nextUrl.origin), 303)
}
