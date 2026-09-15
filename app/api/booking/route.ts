import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { parseAddOnsFromSummary, type CheckoutBooking } from '@/lib/checkout-booking'

export async function GET(request: NextRequest) {
  try {
    const txnidParam = (request.nextUrl.searchParams.get('txnid') || request.nextUrl.searchParams.get('mihpayid'))?.trim()

    let data: any = null

    if (txnidParam) {
      // 1. Try exact match on txnid
      const { data: byTxnId } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .eq('txnid', txnidParam)
        .maybeSingle()

      data = byTxnId

      // 2. If not found by txnid, try matching gateway_txnid
      if (!data) {
        const { data: byGatewayTxnId } = await supabaseAdmin
          .from('bookings')
          .select('*')
          .eq('gateway_txnid', txnidParam)
          .maybeSingle()
        data = byGatewayTxnId
      }
    }


    if (!data) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
    }

    const addOnSummary = data.addon_summary || 'None'

    const booking: CheckoutBooking = {
      txnid: data.txnid || txnidParam || '',
      name: data.name || '',
      mobile: data.mobile || '',
      email: data.email || '',
      city: data.city || '',
      adultQty: Number(data.adult_qty || 0),
      kids1Qty: Number(data.kid1_qty || 0),
      kids2Qty: Number(data.kid2_qty || 0),
      bookedDate: data.booked_date || '',
      visitDate: data.visit_date || '',
      planName: data.plan_name || '',
      ticketType: data.ticket_type || '',
      ticketPrice: Number(data.ticket_price || 0),
      ticketQty: Number(data.ticket_qty || 1),
      ticketSubtotal: Number(data.ticket_subtotal || 0),
      addOns: parseAddOnsFromSummary(addOnSummary),
      addOnSummary,
      addOnSubtotal: Number(data.addon_subtotal || 0),
      totalAmount: Number(data.total_amount || 0),
      rulesAccepted: Boolean(data.rules_accepted ?? true),
      consentAccepted: Boolean(data.consent_accepted ?? true),
      source: data.source || 'checkout-page',
      submittedAt: data.created_at || new Date().toISOString(),
    }

    return NextResponse.json({ booking })
  } catch (err) {
    console.error('Exception fetching booking:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
