import React from 'react'
import {
  Accessibility,
  Baby,
  Camera,
  CarFront,
  CheckCircle2,
  Droplets,
  HeartPulse,
  MapPinned,
  ShieldCheck,
  Ticket,
  Wallet,
  Waves,
  Wifi,
} from 'lucide-react'

const facilities = [
  { icon: CarFront, text: 'Free Parking' },
  { icon: Droplets, text: 'Free Drinking Water Facility at Every Point' },
  { icon: Wifi, text: 'Free Savari for Activity Points' },
  { icon: Waves, text: 'Free Life Jackets & Tubes' },
  { icon: ShieldCheck, text: 'Trained Staff & Lifeguards for Safety at Every Point' },
  { icon: Camera, text: 'Various Selfie Points' },
  { icon: HeartPulse, text: 'Washrooms, First Aid, Resting Sheds & Seating Arrangement at Every Point' },
  { icon: Camera, text: 'CCTV Surveillance & Announcement System' },
  { icon: Accessibility, text: 'Wheelchair Assistance (On Request)' },
  { icon: Baby, text: 'Baby Care Facility' },
  { icon: Ticket, text: 'Costume (₹80) & Locker (₹100) available on Rent. Refundable Deposit ₹200.' },
  { icon: Wallet, text: 'Online Booking Available' },
  { icon: MapPinned, text: 'Easy to Access, Highway Touch, 47 km from Nagpur.' },
]

const CommonFR = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
          Common Facilities
        </h2>
        <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600">
          Comfortable, safe, and family-friendly conveniences designed to make every visit effortless and memorable.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {facilities.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
          >
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent text-accent">
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-700">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CommonFR