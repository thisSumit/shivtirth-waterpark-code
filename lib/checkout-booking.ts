export type BookingAddon = {
  name: string
  qty: number
}

export type BookingStatus = 'Paid' | 'Failed' | 'Not Paid'

export type CheckoutBooking = {
  txnid: string
  name: string
  mobile: string
  email: string
  city: string
  adultQty: number
  kids1Qty: number
  kids2Qty: number
  bookedDate: string
  visitDate: string
  checkInDate?: string
  checkOutDate?: string
  numberOfNights?: number
  planName: string
  ticketType: string
  ticketPrice: number
  ticketQty: number
  ticketSubtotal: number
  addOns: BookingAddon[]
  addOnSummary: string
  addOnSubtotal: number
  totalAmount: number
  rulesAccepted: boolean
  consentAccepted: boolean
  source: 'checkout-page'
  submittedAt: string
}

export type PaymentGatewayMeta = {
  gatewayTxnId?: string
  gatewayStatus?: string
  gatewayResponse?: string
}

export type SheetSubmissionPayload = CheckoutBooking & {
  paymentStatus: BookingStatus
  paymentStatusLabel: string
  notifyAdminEmail?: string
} & PaymentGatewayMeta

export type PayuCallbackPayload = Record<string, string>

const readNumber = (value: string | undefined, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const ADD_ON_PRICE_MAP: Record<string, number> = {
  Breakfast: 50,
  Lunch: 250,
  Dinner: 250,
  'Combined Coupon (All 3 Meals)': 550,
}

const parseAddOnSubtotalFromSummary = (summary: string) => {
  if (!summary || summary === 'None') return 0

  return summary
    .split(',')
    .map((item) => item.trim())
    .reduce((sum, item) => {
      const match = item.match(/^(.*)\s+x\s+(\d+)$/i)
      if (!match) return sum

      const name = match[1].trim()
      const qty = Number(match[2])
      const unitPrice = ADD_ON_PRICE_MAP[name]

      if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(unitPrice)) {
        return sum
      }

      return sum + unitPrice * qty
    }, 0)
}

export const buildBookingFromPayuCallback = (
  payload: PayuCallbackPayload,
  fallbackTxnId: string = ''
): CheckoutBooking => {
  const productinfo = payload.productinfo || ''
  const productParts = productinfo.split('-')
  const ticketQtyFromProduct = readNumber(productParts.at(-1), 1)
  const ticketTypeFromProduct = productParts.length > 1 ? productParts.at(-2) || '' : ''
  const planNameFromProduct = productParts.length > 2 ? productParts.slice(0, -2).join('-') : productinfo

  const infoTokenParts = productinfo.split('|')
  const detailMeta = infoTokenParts.length > 1 ? infoTokenParts[1]?.split(',') || [] : []
  const adultQtyFromProduct = detailMeta[0] ? Number(detailMeta[0]) : 0
  const kids1QtyFromProduct = detailMeta[1] ? Number(detailMeta[1]) : 0
  const kids2QtyFromProduct = detailMeta[2] ? Number(detailMeta[2]) : 0
  const cityFromProduct = detailMeta[3] || ''

  const addOnSummary = payload.udf3 || 'None'
  const derivedAddOnSubtotal = parseAddOnSubtotalFromSummary(addOnSummary)
  const ticketQty = readNumber(payload.udf4, 0) || ticketQtyFromProduct || 1
  const addOnSubtotal = readNumber(payload.udf7, derivedAddOnSubtotal)
  const totalAmount = readNumber(
    payload.udf8 || payload.amount,
    readNumber(payload.udf6, 0) + addOnSubtotal
  )
  const ticketSubtotal = readNumber(
    payload.udf6,
    totalAmount > 0 ? Math.max(totalAmount - addOnSubtotal, 0) : 0
  )
  const ticketPrice = ticketQty > 0 ? Math.round(ticketSubtotal / ticketQty) : 0
  const bookedDate = new Date().toISOString()
  const name = payload.firstname || ''
  const mobile = payload.udf9 || payload.phone || payload.mobile || ''
  const email = payload.udf10 || payload.email || ''
  const city = payload.city || cityFromProduct || ''
  const adultQty = readNumber(payload.adultQty || payload.udf12, adultQtyFromProduct)
  const kids1Qty = readNumber(payload.kids1Qty || payload.udf13, kids1QtyFromProduct)
  const kids2Qty = readNumber(payload.kids2Qty || payload.udf14, kids2QtyFromProduct)

  return {
    txnid: payload.txnid || fallbackTxnId,
    name,
    mobile,
    email,
    city,
    adultQty,
    kids1Qty,
    kids2Qty,
    bookedDate,
    visitDate: payload.udf1 || '',
    planName: payload.udf5 || planNameFromProduct || payload.productinfo || '',
    ticketType: payload.udf2 || ticketTypeFromProduct || '',
    ticketPrice,
    ticketQty,
    ticketSubtotal,
    addOns: [],
    addOnSummary,
    addOnSubtotal,
    totalAmount,
    rulesAccepted: true,
    consentAccepted: true,
    source: 'checkout-page',
    submittedAt: new Date().toISOString(),
  }
}

const STORAGE_KEY = 'shivtirth.pendingCheckoutBooking'

export const formatBookingStatusLabel = (status: BookingStatus, name: string) => {
  return `${status} (${name})`
}

export const storePendingBooking = (booking: CheckoutBooking) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(booking))
}

export const readPendingBooking = () => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as CheckoutBooking
  } catch {
    return null
  }
}

export const clearPendingBooking = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export const buildSheetSubmissionPayload = (
  booking: CheckoutBooking,
  paymentStatus: BookingStatus,
  gatewayMeta: PaymentGatewayMeta = {}
): SheetSubmissionPayload => {
  const notifyAdminEmail =
    process.env.BOOKING_NOTIFICATION_EMAIL ||
    process.env.NEXT_PUBLIC_BOOKING_NOTIFICATION_EMAIL ||
    ''

  return {
    ...booking,
    ...gatewayMeta,
    paymentStatus,
    paymentStatusLabel: formatBookingStatusLabel(paymentStatus, booking.name),
    notifyAdminEmail: notifyAdminEmail || undefined,
  }
}

export const submitBookingToGoogleSheet = async (
  booking: CheckoutBooking,
  paymentStatus: BookingStatus,
  gatewayMeta: PaymentGatewayMeta = {}
) => {
  const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_SCRIPT_URL || ''
  if (!scriptUrl) return false

  const payload = buildSheetSubmissionPayload(booking, paymentStatus, gatewayMeta)

  try {
    const isBrowser = typeof window !== 'undefined'
    await fetch(scriptUrl, {
      method: 'POST',
      ...(isBrowser ? { mode: 'no-cors' as const } : {}),
      headers: isBrowser
        ? { 'Content-Type': 'text/plain;charset=UTF-8' }
        : { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    return true
  } catch {
    return false
  }
}

export const submitBookingToDestinations = async (
  booking: CheckoutBooking,
  paymentStatus: BookingStatus,
  gatewayMeta: PaymentGatewayMeta = {}
) => {
  const [sheetResult, supabaseResult] = await Promise.all([
    submitBookingToGoogleSheet(booking, paymentStatus, gatewayMeta),
    submitBookingToSupabase(booking, paymentStatus, gatewayMeta, true),
  ])

  if (!sheetResult || !supabaseResult) {
    console.error('Booking sync incomplete:', { sheetResult, supabaseResult })
  }

  return { sheetResult, supabaseResult }
}

export const submitBookingToSupabase = async (
  booking: CheckoutBooking,
  paymentStatus: BookingStatus,
  gatewayMeta: PaymentGatewayMeta = {},
  useAdminClient = false
) => {
  try {
    const client = useAdminClient
      ? (await import('./supabaseAdmin')).supabaseAdmin
      : (await import('./supabase')).supabase

    const payload = {
      txnid: booking.txnid,
      gateway_txnid: gatewayMeta.gatewayTxnId || null,
      gateway_status: gatewayMeta.gatewayStatus || null,
      gateway_response: gatewayMeta.gatewayResponse || null,
      payment_status: paymentStatus,
      payment_status_label: formatBookingStatusLabel(paymentStatus, booking.name),
      booked_date: booking.bookedDate || new Date().toISOString(),
      name: booking.name,
      mobile: booking.mobile,
      email: booking.email,
      city: booking.city || '',
      adult_qty: booking.adultQty || 0,
      kid1_qty: booking.kids1Qty || 0,
      kid2_qty: booking.kids2Qty || 0,
      visit_date: booking.visitDate,
      plan_name: booking.planName,
      ticket_type: booking.ticketType,
      ticket_price: booking.ticketPrice,
      ticket_qty: booking.ticketQty,
      ticket_subtotal: booking.ticketSubtotal,
      addon_summary: booking.addOnSummary || 'None',
      addon_subtotal: booking.addOnSubtotal,
      total_amount: booking.totalAmount,
      source: booking.source || 'checkout-page',
      rules_accepted: booking.rulesAccepted,
      consent_accepted: booking.consentAccepted,
    }

    const { error } = await client.from('bookings').upsert(payload, { onConflict: 'txnid' })
    if (error) {
      console.error('Supabase booking sync error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Supabase booking sync exception:', err)
    return false
  }
}

