import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

type CheckoutPayload = {
  name: string
  mobile: string
  email: string
  city: string
  adultQty: number
  kids1Qty: number
  kids2Qty: number
  visitDate: string
  planName: string
  ticketType: string
  ticketQty: number
  ticketSubtotal: number
  addOnSubtotal: number
  addOnSummary: string
  addons: Array<{ name: string; qty: number }>
  totalAmount: number
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutPayload
    const mobile = body?.mobile?.trim()
    const email = body?.email?.trim()

    if (
      !body?.name ||
      !mobile ||
      !email ||
      !body?.visitDate ||
      !body?.planName ||
      !body?.ticketType ||
      !body?.ticketQty ||
      !body?.totalAmount
    ) {
      return NextResponse.json(
        { error: 'Missing required checkout fields.' },
        { status: 400 }
      )
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number.' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const payuKey = process.env.PAYU_KEY
    const payuSalt = process.env.PAYU_SALT

    const payuPaymentUrl =
      process.env.PAYU_PAYMENT_URL || 'https://secure.payu.in/_payment'

    const city = (body.city || '').trim()
    const adultQty = Number(body.adultQty || 0)
    const kids1Qty = Number(body.kids1Qty || 0)
    const kids2Qty = Number(body.kids2Qty || 0)

    if (!city) {
      return NextResponse.json(
        { error: 'Please enter your city.' },
        { status: 400 }
      )
    }

    if (!payuKey || !payuSalt) {
      return NextResponse.json(
        {
          error:
            'PayU is not configured. Please set PAYU_KEY and PAYU_SALT.',
        },
        { status: 400 }
      )
    }

    // SHORT UNIQUE TRANSACTION ID
    const txnid = `TXN${Date.now()}`

    // ALWAYS 2 DECIMAL FORMAT
    const amount = Number(body.totalAmount).toFixed(2)

    // SAFE PRODUCT INFO WITH CITY + VISITOR BREAKDOWN TO PRESERVE ADMIN INFO IN CALLBACKS
    const productinfo = `${body.planName}-${body.ticketType}-${body.ticketQty}|${adultQty},${kids1Qty},${kids2Qty},${city}`

    const firstname = body.name.trim()

    const phone = mobile

    const udf1 = body.visitDate || ''
    const udf2 = body.ticketType || ''
    const udf3 = body.addOnSummary || ''
    const udf4 = String(body.ticketQty || '')
    const udf5 = body.planName || ''
    const udf6 = String(body.ticketSubtotal || '')
    const udf7 = String(body.addOnSubtotal || '')
    const udf8 = String(body.totalAmount || '')
    const udf9 = mobile
    const udf10 = email

    // Use API callback routes so PayU can POST response data reliably.
    const surl = `${request.nextUrl.origin}/api/payu/success`
    const furl = `${request.nextUrl.origin}/api/payu/failure`

    // Correct PayU request hash formula for the transaction request:
    // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
    const hashString = [
      payuKey,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      udf6,
      udf7,
      udf8,
      udf9,
      udf10,
      payuSalt,
    ].join('|')

    const hash = crypto
      .createHash('sha512')
      .update(hashString)
      .digest('hex')

    return NextResponse.json({
      action: payuPaymentUrl,

      fields: {
        key: payuKey,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        phone,
        surl,
        furl,
        hash,

        // REMOVE service_provider

        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        udf6,
        udf7,
        udf8,
        udf9,
        udf10,
      },
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Unable to initiate payment. Please try again.',
      },
      { status: 500 }
    )
  }
}