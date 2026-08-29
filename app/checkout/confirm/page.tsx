import { Suspense } from 'react'
import PaymentConfirmContent from './PaymentConfirmContent'

function PaymentConfirmFallback() {
  return (
    <section className="no-hover-effects relative min-h-screen overflow-hidden px-3 py-4 md:px-6 md:py-6 flex items-center justify-center print:min-h-0 print:p-0">
      <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Loading confirmation...</p>
      </div>
    </section>
  )
}

export default function PaymentConfirmPage() {
  return (
    <Suspense fallback={<PaymentConfirmFallback />}>
      <PaymentConfirmContent />
    </Suspense>
  )
}
