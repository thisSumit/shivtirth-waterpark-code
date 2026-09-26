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

const readNumber = (value: string | number | undefined, fallback = 0) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback
  if (!value) return fallback
  const str = String(value).trim()
  const leading = str.split(/[:|_\s]/)[0]
  const parsed = Number(leading)
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

export const parseAddOnsFromSummary = (summary: string): BookingAddon[] => {
  if (!summary || summary === 'None') return []
  return summary
    .split(',')
    .map((item) => item.trim())
    .map((item) => {
      const match = item.match(/^(.*)\s+x\s+(\d+)$/i)
      if (!match) return null
      return {
        name: match[1].trim(),
        qty: Number(match[2]),
      }
    })
    .filter((addon): addon is BookingAddon => addon !== null && addon.qty > 0)
}

export const buildBookingFromPayuCallback = (
  payload: PayuCallbackPayload,
  fallbackTxnId: string = ''
): CheckoutBooking => {
  const rawProductinfo = payload.productinfo || ''
  const [productMain, productMeta] = rawProductinfo.split('|')
  const productParts = (productMain || '').split('-')
  const ticketQtyFromProduct = readNumber(productParts.at(-1), 1)
  const ticketTypeFromProduct = productParts.length > 1 ? productParts.at(-2) || '' : ''
  const planNameFromProduct = productParts.length > 2 ? productParts.slice(0, -2).join('-') : productMain

  const detailMeta = productMeta ? productMeta.split(',') : []
  const adultQtyFromProduct = detailMeta[0] ? Number(detailMeta[0]) : 0
  const kids1QtyFromProduct = detailMeta[1] ? Number(detailMeta[1]) : 0
  const kids2QtyFromProduct = detailMeta[2] ? Number(detailMeta[2]) : 0
  const cityFromProduct = detailMeta[3] || ''

  let adultQtyFromUdf: number | undefined
  let kids1QtyFromUdf: number | undefined
  let kids2QtyFromUdf: number | undefined

  if (payload.udf4 && payload.udf4.includes(':')) {
    const parts = payload.udf4.split(':')
    if (parts[1]) {
      const breakdown = parts[1].split(',')
      if (breakdown.length >= 3) {
        adultQtyFromUdf = Number(breakdown[0])
        kids1QtyFromUdf = Number(breakdown[1])
        kids2QtyFromUdf = Number(breakdown[2])
      }
    }
  }

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
  const kids1Qty = readNumber(
    payload.kids1Qty || payload.udf13,
    kids1QtyFromUdf !== undefined && Number.isFinite(kids1QtyFromUdf)
      ? kids1QtyFromUdf
      : kids1QtyFromProduct
  )
  const kids2Qty = readNumber(
    payload.kids2Qty || payload.udf14,
    kids2QtyFromUdf !== undefined && Number.isFinite(kids2QtyFromUdf)
      ? kids2QtyFromUdf
      : kids2QtyFromProduct
  )
  const adultQty = readNumber(
    payload.adultQty || payload.udf12,
    adultQtyFromUdf !== undefined && Number.isFinite(adultQtyFromUdf)
      ? adultQtyFromUdf
      : (detailMeta[0] !== undefined ? adultQtyFromProduct : Math.max(0, ticketQty - kids1Qty - kids2Qty))
  )

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
    addOns: parseAddOnsFromSummary(addOnSummary),
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
const CONFIRMED_STORAGE_KEY = 'shivtirth.lastConfirmedBooking'

export const formatBookingStatusLabel = (status: BookingStatus, name: string) => {
  return `${status} (${name})`
}

export const storePendingBooking = (booking: CheckoutBooking) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(booking))
  } catch {}
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

export const storeConfirmedBooking = (booking: CheckoutBooking) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONFIRMED_STORAGE_KEY, JSON.stringify(booking))
  } catch {}
}

export const readConfirmedBooking = () => {
  if (typeof window === 'undefined') return null

  const raw = window.localStorage.getItem(CONFIRMED_STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as CheckoutBooking
  } catch {
    return null
  }
}

export const clearPendingBooking = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

export const clearConfirmedBooking = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(CONFIRMED_STORAGE_KEY)
  } catch {}
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

    // 1. Fetch existing record if any to prevent wiping out pre-existing valid booking fields
    let existing: any = null
    if (booking.txnid) {
      const { data } = await client
        .from('bookings')
        .select('*')
        .eq('txnid', booking.txnid)
        .maybeSingle()
      existing = data
    }

    const finalName = booking.name || existing?.name || ''
    const finalMobile = booking.mobile || existing?.mobile || ''
    const finalEmail = booking.email || existing?.email || ''
    const finalCity = booking.city || existing?.city || ''
    const finalAdultQty = typeof booking.adultQty === 'number' ? booking.adultQty : Number(existing?.adult_qty || 0)
    const finalKid1Qty = typeof booking.kids1Qty === 'number' ? booking.kids1Qty : Number(existing?.kid1_qty || 0)
    const finalKid2Qty = typeof booking.kids2Qty === 'number' ? booking.kids2Qty : Number(existing?.kid2_qty || 0)
    const finalVisitDate = booking.visitDate || existing?.visit_date || ''
    const finalPlanName = booking.planName || existing?.plan_name || ''
    const finalTicketType = booking.ticketType || existing?.ticket_type || ''
    const finalTicketPrice = booking.ticketPrice || Number(existing?.ticket_price || 0)
    const finalTicketQty = booking.ticketQty || Number(existing?.ticket_qty || 1)
    const finalTicketSubtotal = booking.ticketSubtotal || Number(existing?.ticket_subtotal || 0)
    const finalAddonSummary = (booking.addOnSummary && booking.addOnSummary !== 'None') ? booking.addOnSummary : (existing?.addon_summary || 'None')
    const finalAddonSubtotal = booking.addOnSubtotal || Number(existing?.addon_subtotal || 0)
    const finalTotalAmount = booking.totalAmount || Number(existing?.total_amount || 0)

    const payload: Record<string, any> = {
      txnid: booking.txnid,
      gateway_txnid: gatewayMeta.gatewayTxnId || existing?.gateway_txnid || null,
      gateway_status: gatewayMeta.gatewayStatus || existing?.gateway_status || null,
      gateway_response: gatewayMeta.gatewayResponse || existing?.gateway_response || null,
      payment_status: paymentStatus,
      payment_status_label: formatBookingStatusLabel(paymentStatus, finalName),
      booked_date: booking.bookedDate || existing?.booked_date || new Date().toISOString(),
      name: finalName,
      mobile: finalMobile,
      email: finalEmail,
      visit_date: finalVisitDate,
      plan_name: finalPlanName,
      ticket_type: finalTicketType,
      ticket_price: finalTicketPrice,
      ticket_qty: finalTicketQty,
      ticket_subtotal: finalTicketSubtotal,
      addon_summary: finalAddonSummary,
      addon_subtotal: finalAddonSubtotal,
      total_amount: finalTotalAmount,
      source: booking.source || existing?.source || 'checkout-page',
      rules_accepted: booking.rulesAccepted ?? existing?.rules_accepted ?? true,
      consent_accepted: booking.consentAccepted ?? existing?.consent_accepted ?? true,
      city: finalCity,
      adult_qty: finalAdultQty,
      kid1_qty: finalKid1Qty,
      kid2_qty: finalKid2Qty,
    }

    const currentPayload = { ...payload }
    let attempts = 0
    let error: any = null

    while (attempts < 10) {
      attempts++
      const res = await client.from('bookings').upsert(currentPayload, { onConflict: 'txnid' })
      error = res.error
      if (!error) break

      if (error.code === 'PGRST204' || error.message?.includes('column')) {
        const match = error.message?.match(/Could not find the '([^']+)' column/i)
        if (match && match[1] && currentPayload[match[1]] !== undefined) {
          console.warn(`Stripping missing column '${match[1]}' from bookings payload and retrying...`)
          delete currentPayload[match[1]]
          continue
        }
      }
      break
    }

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

