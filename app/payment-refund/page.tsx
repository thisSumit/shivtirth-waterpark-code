'use client'

import Link from 'next/link'

export default function PaymentRefundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-500 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500 blur-3xl"></div>
      </div>

      <div className="relative">
        <div className="bg-slate-900 pt-12 text-slate-200">
          <div className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-accent">
              Payment & Refund Policy
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-black text-white">
              Shivtirth Best Water Park
            </h1>
            <p className="mt-3 text-slate-300 max-w-3xl">
              This policy explains how ticket payments, cancellations, rescheduling, and refunds are handled
              for bookings made online, offline, or through authorized payment channels including PayU.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16">
          <div className="space-y-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Applicability</h2>
              <p className="text-slate-700 leading-relaxed">
                This Payment & Refund Policy applies to every guest who purchases tickets, passes, packages,
                school group passes, corporate packages, or event bookings from Shivtirth Water Park, whether
                through our website, ticket counter, call booking, WhatsApp support, or any authorized channel.
              </p>
              <p className="mt-3 text-slate-700 leading-relaxed">
                By making a payment and booking with us, the guest confirms that they understand, accept, and agree
                to all payment, refund, cancellation, rescheduling, and safety conditions described in this policy.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Payment Terms</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>All payments are accepted through secure payment methods, including PayU payment gateway.</li>
                <li>Tickets are confirmed only after the payment is successfully processed and confirmation is generated.</li>
                <li>We may cancel a booking if the payment is incomplete, declined, duplicate, fraudulent, or not verified.</li>
                <li>Any transaction processed through a third-party gateway is subject to the rules and timelines of that platform.</li>
                <li>We do not store complete card or UPI details directly on our website. The payment is processed securely through the payment gateway.</li>
                <li>In the case of a failed or stuck payment, guests must wait for the bank or PayU response and contact support with the transaction details.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Payment Issues, Failed Transactions & PayU</h2>
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="text-slate-900 font-semibold mb-2">Failed Transaction</h3>
                  <p>
                    If the payment is debited but the booking is not confirmed, the guest must contact Shivtirth support
                    immediately with the transaction ID, order details, and proof of payment. We will verify the transaction
                    with the payment gateway and assist at the earliest possible time.
                  </p>
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold mb-2">Duplicate Payment</h3>
                  <p>
                    If a duplicate payment is detected, we will verify the payment status through PayU and initiate the
                    necessary refund or adjustment in accordance with the payment gateway rules and our internal policy.
                  </p>
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold mb-2">Stuck / Pending Payment</h3>
                  <p>
                    If a payment appears pending or stuck, the final confirmation depends on the bank or PayU status. Guests
                    are requested not to make another payment immediately unless advised by support.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Refund Eligibility</h2>
              <div className="space-y-4 text-slate-700">
                <div>
                  <h3 className="text-slate-900 font-semibold mb-2">Eligible For Refund or Reschedule</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>If the cancellation request is made one day before the booked date or planned arrival date.</li>
                    <li>If the guest informs us before the visit date and the request is approved by management.</li>
                    <li>If the booking is cancelled for valid reasons and the guest requests a refund or reschedule before the planned visit.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-slate-900 font-semibold mb-2">Not Eligible For Refund or Reschedule</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>If the cancellation is requested on the same day of the booked visit or on the arrival day.</li>
                    <li>If the guest does not report before entry time and arrives late without prior approval.</li>
                    <li>If the ticket is used, partially used, or misused.</li>
                    <li>If the guest is denied entry due to rule violations, misconduct, unsafe behaviour, intoxication, or prohibited items.</li>
                    <li>If the booking is cancelled due to no-show, non-appearance, or unapproved late request.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Rescheduling Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                Guests may request a reschedule when the booking is cancelled in advance as per the refund policy. A valid
                reschedule can be allowed within 6 months from the original visit date, subject to availability and approval
                by management.
              </p>
              <ul className="mt-3 list-disc list-inside text-slate-700 space-y-2">
                <li>Rescheduling is allowed only if the request is made before the booked date or the arrival date, as per management rules.</li>
                <li>Same-day or arrival-day reschedule requests are not allowed.</li>
                <li>Reschedule requests are subject to ticket availability and may be approved or rejected depending on capacity and park operations.</li>
                <li>Any rescheduled booking must be used within the permitted time frame and cannot be carried forward indefinitely.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Refund Calculation</h2>
              <p className="text-slate-700 leading-relaxed">
                If a refund is approved, the guest will receive the refundable amount after deduction of applicable charges.
                In all eligible cases:
              </p>
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                <p className="font-semibold text-slate-900">Refund Amount = Total Paid Amount - 18% Deduction - Platform Fee (if any)</p>
              </div>
              <ul className="mt-4 list-disc list-inside text-slate-700 space-y-2">
                <li>18% will be deducted from the refundable amount in approved cancellation cases.</li>
                <li>Any payment gateway / platform fee charged by PayU or another payment provider will also be deducted.</li>
                <li>Taxes, if any, will be handled as applicable under the payment gateway and local tax laws.</li>
                <li>Refunds are calculated on the amount actually paid, excluding any non-refundable service charges if specifically disclosed.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Refund Processing Timeline</h2>
              <p className="text-slate-700 leading-relaxed">
                Approved refund requests will be processed within 15 working days from the date of approval, subject to
                the payment gateway, bank, UPI network, and financial institution processing time.
              </p>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Depending on payment mode, the final credit may reflect in the customer’s account within the timeline
                set by the respective bank or digital wallet provider. Shivtirth is not responsible for delays beyond our
                control once the refund has been initiated.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Park Cancellation by Shivtirth</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Shivtirth Water Park may cancel or suspend bookings due to weather, safety concerns, force majeure, technical issues, or operational needs.</li>
                <li>If the park cancels an event or booking, the guest may be offered a refund or reschedule as per management decision.</li>
                <li>In a park-initiated cancellation, the guest may not be charged the 18% deduction if the cancellation is not caused by the guest.</li>
                <li>Any such decision will be communicated in writing or through the booking contact details.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Misuse, Behavioral Violations & Non-Refund Conditions</h2>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>No refund or reschedule will be given if a guest is removed due to misconduct, abusive behaviour, intoxication, violation of rules, or unsafe conduct.</li>
                <li>If guests disturb other visitors, damage park property, or fail to comply with staff instructions, the ticket can be cancelled without refund.</li>
                <li>Any misuse of ride equipment, lifeguards area, locker items, swimwear rules, or access passes may result in cancellation and penalty.</li>
                <li>The management may deny entry to anyone who appears intoxicated, aggressive, or medically unfit for the activity.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Pre-Booking & After-Purchase Support</h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  For any ticket booking, refund request, payment issue, or reschedule request, guests should contact Shivtirth support
                  and provide order reference, name, mobile number, transaction ID, and ticket details.
                </p>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="mb-2"><span className="text-slate-900 font-semibold">Phone:</span> +91 86053 62212</p>
                  <p className="mb-2"><span className="text-slate-900 font-semibold">Email:</span> support@shivtirthwaterpark.com</p>
                  <p><span className="text-slate-900 font-semibold">Address:</span> Shivtirth Water Park, Umari Dam, near Saoner, Nagpur</p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Final Agreement</h2>
              <p className="text-slate-700 leading-relaxed">
                All bookings from Shivtirth Water Park are governed by this Payment & Refund Policy alongside our general
                Terms & Conditions. Guests are expected to understand these policies before booking. Shivtirth reserves
                the right to interpret, apply, and enforce these rules in the best interest of safety, operations, and guest experience.
              </p>
              <p className="mt-3 text-slate-900 font-semibold">
                Managed by SHIVTIRTH ASSOCIATES PRIVATE LIMITED
              </p>
            </section>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 font-semibold text-black shadow-lg shadow-accent/20 transition hover:scale-[1.03]"
              >
                Back to Home
              </Link>
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-2 font-semibold text-slate-800 transition hover:bg-accent/10 hover:text-slate-900"
              >
                Read Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
