"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { clearPendingBooking } from '@/lib/checkout-booking'

export default function PaymentFailedPage() {
  useEffect(() => {
    clearPendingBooking()
  }, [])

  return (
    <section className="no-hover-effects min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-200 text-center">
        <h1 className="text-2xl font-extrabold mb-4 text-red-600">Payment Failed</h1>
        <p className="text-slate-700 mb-8">
          Your payment did not go through. Please retry or contact PayU support for assistance.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/billing" className="rounded-full bg-yellow-400 px-4 py-3 text-center font-bold text-slate-900 shadow-sm transition hover:bg-yellow-300">
            Retry Payment
          </Link>
          <a
            href="https://help.payu.in/knowledge-center"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-yellow-300 bg-yellow-50 px-4 py-3 text-center font-semibold text-slate-800 transition hover:bg-yellow-100"
          >
            Contact PayU Support
          </a>
          <Link href="/" className="text-sm text-slate-500 mt-2 underline">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  )
}
