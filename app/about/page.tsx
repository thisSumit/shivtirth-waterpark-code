import Image from "next/image";

import type { Metadata } from "next";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Description from "@/components/Description";
import Logos from "@/components/Logos";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Our Story & Promise | Shivtirth Water Park Nagpur",
  description:
    "Discover the story of Shivtirth Water Park built on joy, safety, and unforgettable memories for families, friends, and adventurers in Nagpur.",
  keywords: [
    "shivtirth water park",
    "best water park in nagpur",
    "family water park nagpur",
    "safe water park near nagpur",
    "amusement park nagpur",
  ],
  openGraph: {
    title: "Our Story & Promise | Shivtirth Water Park",
    description:
      "A destination built on joy, safety, and unforgettable memories crafted for families, friends, and adventurers alike.",
    siteName: "Shivtirth Water Park",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};


const AboutPage = () => {
  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 md:pt-46 pb-18 py-28 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-white">
            Shivtirth Best Water Park
          </h1>
          
          <p className="text-slate-300 max-w-4xl mx-auto mb-8 text-sm md:text-base">
            Located in Umari (Dam), Saoner, Nagpur,  surrounded by the serene Satpuda mountain range, lush forests, and the peaceful dam valley. Perfect for school picnics, family outings, corporate groups, weddings, and birthday celebrations.
          </p>
        </div>
      </div>
      {/* <Description/> */}

      {/* Introduction & History */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
        <div className="lg:col-span-2 relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl">
          <Image
            src="/g1.png"
            alt="Shivtirth Water Park"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Shivtirth Best Water Park</h2>
          <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
            Founded with a vision to bring world-class recreation to central India, Shivtirth Best Water Park blends thrilling attractions with serene natural surroundings. We continue to evolve with safety, hospitality, and innovation at the core.
          </p>
          <p className="text-lg text-slate-700 leading-relaxed">
            Over the years, we have welcomed families, schools, corporates, and adventure seekers crafting experiences that combine excitement, comfort, and memorable service.
          </p>
        </div>
      </section>

      <Logos/>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-linear-to-br from-blue-50 to-cyan-50 p-8 md:p-10 shadow-xl border border-blue-200 hover:shadow-2xl transition-shadow">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Our Mission</h3>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Our mission is to create a joyful and refreshing destination where families and students can reconnect with nature, adventure, and togetherness. At Shivtirth Water Park & Boating, we aim to offer a safe, thrilling, and nature-friendly experience through exciting water rides, boating rides, adventure, amusement, while promoting fun, relaxation, and harmony with the environment. We strive to make every visitor leave with smiles, cherished memories, and a renewed love for nature and outdoor fun.
          </p>
        </div>
        <div className="rounded-3xl bg-linear-to-br from-emerald-50 to-teal-50 p-8 md:p-10 shadow-xl border border-emerald-200 hover:shadow-2xl transition-shadow">
          <div className="text-5xl mb-4">🚀</div>
          <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Our Vision</h3>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">
            Our vision is to make Shivtirth the most loved and eco-friendly destination for recreation and adventure in Central India,  a place where fun meets nature. We aspire to inspire happiness, wellness, and togetherness by offering world-class water and boating experiences surrounded by the natural beauty of the Satpuda mountains. Through continuous innovation and sustainable practices, we aim to make Shivtirth a symbol of joy, adventure, and harmony with nature for families and visitors of all ages.
          </p>
        </div>
      </section>

      {/* Our Achievements */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Our Achievements Speak for Themselves
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Here's what makes Shivtirth Best Waterpark special for thousands of visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-16 items-stretch">
          <div className="rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center border border-blue-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">100K+</div>
            <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Happy People</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-6 md:p-8 text-center border border-emerald-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">150+</div>
            <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Activities</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-orange-50 to-yellow-50 p-6 md:p-8 text-center border border-orange-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">4.7</div>
            <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Rating</p>
          </div>
          <div className="rounded-2xl bg-linear-to-br from-pink-50 to-rose-50 p-6 md:p-8 text-center border border-pink-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
            <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">15K+</div>
            <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Reviews</p>
          </div>
        </div>
      </section>

      {/* Affiliations & Certifications */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
            Our Affiliations & Certifications
          </h2>
          <p className="text-lg text-slate-600">
            Shivtirth Water Park is proud to be recognized by trusted organizations and institutions for our commitment to safety, quality, and eco-friendly tourism.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-8 border border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">ISO 9001:2015 Certified</h3>
            <p className="text-slate-700 leading-relaxed">
              For maintaining high standards in safety and service quality.
            </p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100 p-8 border border-emerald-300 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">Eco-Friendly Tourism Partner</h3>
            <p className="text-slate-700 leading-relaxed">
              Recognized for promoting sustainable and nature-based recreation.
            </p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-purple-50 to-purple-100 p-8 border border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">Educational Tour Certified</h3>
            <p className="text-slate-700 leading-relaxed">
              Approved as a safe and learning destination for school & college trips.
            </p>
          </div>

          <div className="rounded-2xl bg-linear-to-br from-orange-50 to-orange-100 p-8 border border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🏅</div>
            <h3 className="text-2xl font-black mb-2 text-slate-900">Tourism Excellence Award</h3>
            <p className="text-slate-700 leading-relaxed">
              Awarded for outstanding hospitality and family-friendly tourism.
            </p>
          </div>
        </div>
      </section>
      <InteractiveHoverButton
        href={"/offers"}
        className='flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center z-20 px-8 py-3'
      >
        BOOK NOW
      </InteractiveHoverButton>
    </main>
  );
};

export default AboutPage;