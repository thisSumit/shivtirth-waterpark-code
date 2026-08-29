"use client"

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Printer } from 'lucide-react'
import {
  clearPendingBooking,
  type CheckoutBooking,
  readPendingBooking,
} from '@/lib/checkout-booking'

export default function PaymentConfirmContent() {
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState<CheckoutBooking | null>(null)

  const payuTxnId = useMemo(
    () => searchParams.get('txnid') || searchParams.get('mihpayid') || booking?.txnid || '',
    [booking?.txnid, searchParams]
  )

  useEffect(() => {
    const pendingBooking = readPendingBooking()
    setBooking(pendingBooking)
    if (pendingBooking) {
      clearPendingBooking()
    }

    window.alert('You have booked successfully.')
  }, [])

  return (
    <section className="no-hover-effects relative min-h-screen overflow-hidden px-3 py-4 md:px-6 md:py-6 flex items-center justify-center print:min-h-0 print:p-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 blur-[2px] print:hidden"
        style={{ backgroundImage: 'url(/adishakti.jpeg)' }}
      />
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm print:hidden" />

      <div className="print-ticket print-ticket-compact relative z-10 w-full max-w-xl overflow-hidden rounded-[28px] border border-white/20 bg-white/15 shadow-2xl backdrop-blur-xl text-white print:bg-white print:text-slate-900 print:shadow-none print:border-slate-300">
        <div className="px-4 py-5 md:px-6 md:py-6 print-ticket-compact">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/90 print:text-slate-700">
                Shivtirth Waterpark
              </div>
              <h1 className="mt-3 text-2xl md:text-3xl font-black leading-tight text-accent print:text-slate-900">Payment Confirmed</h1>
              <p className="mt-1.5 text-xs md:text-sm text-white/90 print:text-slate-700">
                Your ticket has been confirmed successfully.
              </p>
            </div>
            <CheckCircle2 className="h-12 w-12 shrink-0 text-emerald-400 print:text-emerald-600" strokeWidth={2.2} />
          </div>

          <div className="mt-4 rounded-2xl border border-white/15 bg-black/20 p-3.5 md:p-4 print:border-slate-200 print:bg-white">
            <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2 md:gap-x-5 md:gap-y-3.5 print:text-slate-800">
              <div>
                <p className="text-white/60 print:text-slate-500">Name</p>
                <p className="mt-0.5 font-semibold">{booking?.name || 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Mobile</p>
                <p className="mt-0.5 font-semibold">{booking?.mobile || 'Not available'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-white/60 print:text-slate-500">Email</p>
                <p className="mt-0.5 font-semibold break-all">{booking?.email || 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Visit Date</p>
                <p className="mt-0.5 font-semibold">{booking?.visitDate || 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Transaction ID</p>
                <p className="mt-0.5 font-semibold break-all">{payuTxnId || 'Not available'}</p>
              </div>
              <div className="md:col-span-2 border-t border-white/10 pt-3 print:border-slate-200 print:pt-3">
                <p className="text-white/60 print:text-slate-500">Selected Package</p>
                <p className="mt-0.5 font-semibold">{booking?.planName || 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Ticket Type</p>
                <p className="mt-0.5 font-semibold">{booking?.ticketType || 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">People / Quantity</p>
                <p className="mt-0.5 font-semibold">{booking?.ticketQty || 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Ticket Subtotal</p>
                <p className="mt-0.5 font-semibold">{booking ? `₹${booking.ticketSubtotal}` : 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Add-on Subtotal</p>
                <p className="mt-0.5 font-semibold">{booking ? `₹${booking.addOnSubtotal}` : 'Not available'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-white/60 print:text-slate-500">Add-ons</p>
                <p className="mt-0.5 font-semibold">{booking?.addOnSummary || 'None'}</p>
                {booking?.addOns?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {booking.addOns.map((addon) => (
                      <span key={addon.name} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold print:border-slate-300 print:bg-slate-100">
                        {addon.name} x {addon.qty}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="md:col-span-2 border-t border-white/10 pt-3 print:border-slate-200 print:pt-3">
                <p className="text-white/60 print:text-slate-500">Total Amount</p>
                <p className="mt-0.5 text-lg font-black text-emerald-300 print:text-emerald-700">{booking ? `₹${booking.totalAmount}` : 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Rules Accepted</p>
                <p className="mt-0.5 font-semibold">{booking?.rulesAccepted ? 'Yes' : 'Not available'}</p>
              </div>
              <div>
                <p className="text-white/60 print:text-slate-500">Policy / Consent Accepted</p>
                <p className="mt-0.5 font-semibold">{booking?.consentAccepted ? 'Yes' : 'Not available'}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2.5 text-xs md:text-sm text-emerald-50 print:border-slate-200 print:bg-slate-50 print:text-slate-700">
            Please show this ticket at the counter at Shivtirth Water Park.
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 font-bold text-slate-950"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <Link href="/" className="inline-flex justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 font-semibold text-white">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
