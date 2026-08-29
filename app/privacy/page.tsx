'use client'

import Link from 'next/link'

export default function PrivacyPage() {
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
              Privacy Policy
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-black text-white">
              Shivtirth Best Water Park
            </h1>
            <p className="mt-3 text-slate-300 max-w-3xl">
              Your privacy matters. This policy explains what we collect, how we use it, and the choices
              you have.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-16">
          <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              At Shivtirth Water Park, we are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and process your personal information.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li><span className="text-slate-900 font-semibold">Personal Information:</span> Name, email, phone number, address when booking tickets or creating accounts.</li>
              <li><span className="text-slate-900 font-semibold">Payment Information:</span> Card or UPI details are processed securely through payment gateways.</li>
              <li><span className="text-slate-900 font-semibold">Usage Data:</span> Browser type, IP address, pages visited, and interaction patterns.</li>
              <li><span className="text-slate-900 font-semibold">Location Data:</span> Geographic information used for service improvements.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Process ticket bookings and reservations.</li>
              <li>Send confirmations, updates, and important notices.</li>
              <li>Improve park facilities, safety, and guest experience.</li>
              <li>Share promotional offers and newsletters (with opt-out).</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed">
              We use SSL encryption, secure servers, and access controls to protect your personal
              information. No method of transmission over the Internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <ul className="list-disc list-inside text-slate-700 space-y-2">
              <li>Access your personal information.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Opt-out of marketing communications.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
              <p className="mb-2"><span className="text-slate-900 font-semibold">Email:</span> info@shivtirth.com</p>
              <p className="mb-2"><span className="text-slate-900 font-semibold">Phone:</span> +91 82757 37577</p>
              <p><span className="text-slate-900 font-semibold">Address:</span> Umari Dam, near Saoner, Nagpur</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">No Refund Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              As per our company policy, once a service is purchased, it is non-refundable. No refunds
              will be issued under any circumstances for these offerings.
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
