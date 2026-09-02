"use client";

import Image from "next/image";
import Link from "next/link";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/useSiteSettings";

const Footer = () => {
  const { settings } = useSiteSettings();
  return (
    <footer className="relative overflow-hidden bg-slate-900 text-slate-200">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className='pointer-events-none absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl'></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Shivtirth Best Water Park"
                width={160}
                height={48}
                className="h-32 w-auto"
              />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Shivtirth Best Water Park & Resort is your ultimate destination for thrilling rides, luxurious stays, wedding, unforgettable memories happiness and relax in the lap of nature on hill station of Great Satpuda Mountain near Umari Dam, Saoner, Nagpur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-slate-300">
              {/* <li><Link href="/" className="hover:text-accent transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-accent transition">About Us</Link></li>
              <li><Link href="/offers" className="hover:text-accent transition">Offers</Link></li>
              <li><Link href="/parks-experiences" className="hover:text-accent transition">Park</Link></li> */}
              {/* <li><Link href="/contact" className="hover:text-accent transition">Contact Us</Link></li> */}
            </ul>
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/shivtirthbestwaterpark/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent text-white transition"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM17.8 6.2a1 1 0 110 2 1 1 0 010-2z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/shivtirthwaterpark/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent text-white transition"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.7c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@Shivtirthpicnicspot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent text-white transition"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 00-2.1-2c-1.9-.5-9.4-.5-9.4-.5s-7.5 0-9.4.5a3 3 0 00-2.1 2C.1 8.1.1 12 .1 12s0 3.9.4 5.8a3 3 0 002.1 2c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2c.4-1.9.4-5.8.4-5.8s0-3.9-.4-5.8zM9.8 15.5V8.5l6.2 3.5-6.2 3.5z" />
                </svg>
              </a>
              <a
                href="https://maps.app.goo.gl/NwtsmknR1RDiV1C86"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-accent text-white transition"
                aria-label="Location"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a7 7 0 00-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                </svg>
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="https://maps.app.goo.gl/SETHp4mULWVmiqh57"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 font-semibold text-black shadow-lg shadow-accent/20 ring-1 ring-transparent transition hover:scale-[1.03] hover:shadow-xl hover:ring-accent/50"
              >
                Get Directions
                <span className="translate-x-0 transition group-hover:translate-x-0.5">→</span>
              </Link>
              <Link
                href={"/offers"}
                className="group inline-flex items-center gap-2 rounded-full border border-accent/60 px-6 py-2 font-semibold text-slate-200 transition hover:bg-accent/10 hover:text-white hover:border-accent"
              >
                Book Now
                <span className="translate-x-0 transition group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>
                <Link href="https://maps.app.goo.gl/yXiw1fawYjGef5co6" className="hover:text-accent transition" target="_blank" rel="noopener noreferrer">
                  Umari Dam, near Saoner, Nagpur
                </Link>
              </li>
              <li>
                <Link href={`tel:${settings.contactPhone}`} className="hover:text-accent transition">
                  {settings.contactPhone} | +91 8275737579
                </Link>
              </li>
              <li>
                <Link href={`mailto:${settings.contactEmail}`} className="hover:text-accent transition">
                  {settings.contactEmail}
                </Link>
              </li>
              <li>Park Timing: 09:00 AM – 06:00 PM</li>
              <li>Water Park: 09:00 AM – 06:00 PM</li>
              <li>Boating Park: 10:00 AM – 02:00 PM</li>
              <li>Lunch: 02:00 PM – 04:00 PM</li>
              <li>Amusement / Adventure Park: 04:00 PM – 06:00 PM</li>
              <li>High Tea: 05:00 PM – 06:00 PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400">© {new Date().getFullYear()} Shivtirth Best Water Park. All rights reserved.</p>
          <div className="flex text-xs items-center gap-6 text-slate-400">
            <Link href="/payment-refund" className="hover:text-accent transition">Payment & Refund Policy</Link>
            <Link href="/privacy" className="hover:text-accent transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition">Terms & Conditions</Link>
          </div>
          <span className="hidden md:inline">•</span>
          <span className="text-md">
            Created by{' '}
            <a
              href="https://avantula.live"
              target="_blank"
              rel="noreferrer"
              className="font-bold hover:text-accent transition"
            >
              Avantula
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;