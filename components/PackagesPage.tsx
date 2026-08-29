"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Package = {
  name: string;
  image: string;
  originalPrice: string;
  discountedPrice: string;
  tag?: string;
  description: string;
  inclusions: string[];
  cta: string;
  link: string;
  singlePrice?: number | null;
  groupPrice?: number | null;
};

const packages: Package[] = [
  {
    name: "Water Park Package",
    image: "/waterpark-1.jpg",
    originalPrice: "₹790",
    discountedPrice: "₹590",
    tag: "Most Popular",
    description: "Complete water park experience with adventure activities",
    inclusions: ["Waterpark access", "Adventure park & 3d show", "Amusement park", "Safari experience", "Agro activities"],
    cta: "Book Water Park",
    link: '/checkout',
  },
  {
    name: "Boating Package",
    image: "/Boating-Park.jpg",
    originalPrice: "₹1000",
    discountedPrice: "₹690",
    description: "Unlimited boating fun with exciting ride options",
    inclusions: ["Banana, Speed & Disco Boat",
  "Shikara, Kayak & Paddle Boat",
  "Dragon, Train & Sofa Boat",
  "Octopus Ride","Zorbing Ball"],
    cta: "Book Boating",
    link: '/checkout',
  },
  {
    name: "Silver Combo Package",
    image: "/g8.png",
    originalPrice: "₹1280",
    discountedPrice: "₹890",
    tag: "Best Value",
    description: "Waterpark Package + Boating Park Package Activities- The perfect combo for thrill seekers",
    inclusions: ["All Water Park activities", "All Boating rides (7 rides)", "Full day access"],
    cta: "Book Silver Combo",
    link: '/checkout',
  },
  {
    name: "Golden Full Package",
    image: "/g10.png",
    originalPrice: "₹1630",
    discountedPrice: "₹1190",
    tag: "Premium",
    description: "Complete experience with food - Perfect for families",
    inclusions: ["Waterpark access", "Boating rides", "Breakfast included", "Lunch included", "Evening snacks"],
    cta: "Book Golden Package",
    link: '/checkout',
  },
  {
    name: "Day & Night Package",
    image: "/Stay-Facilities.jpg",
    originalPrice: "₹3000",
    discountedPrice: "₹2500",
    tag: "Ultimate",
    description: "Extended stay with overnight camping experience",
    inclusions: ["Waterpark + Boating", "Stay Facilities- Camping stay / Farm House", "2 Meals included", "Bonfire & activities", "Breakfast next day"],
    cta: "Book Day / Night Stay",
    link: '/checkout',
  },
];

const PackagesPage = () => {
  const [activePackages, setActivePackages] = useState<Package[]>(packages);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .in('category', ['package', 'accommodation'])
          .eq('is_hidden', false)
          .order('display_order', { ascending: true });

        const now = Date.now();
        const visibleData = (data || []).filter((item) => !item.hide_after || new Date(item.hide_after).getTime() > now);

        if (visibleData.length > 0) {
          setActivePackages(
            visibleData.map((item) => {
              const ticketOpts = Array.isArray(item.ticket_options) ? item.ticket_options : [];
              const singleOpt = ticketOpts.find((o: any) => String(o.id).includes('single') || String(o.label).toLowerCase().includes('single'));
              const groupOpt = ticketOpts.find((o: any) => String(o.id).includes('group') || String(o.label).toLowerCase().includes('group'));

              return {
                name: item.name,
                image: item.image,
                originalPrice: item.original_price ? `₹${item.original_price}` : '',
                discountedPrice: `₹${item.discounted_price}`,
                tag: item.tag || undefined,
                description: item.description || '',
                inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
                cta: item.cta || 'Book Now',
                link: item.link || '/checkout',
                singlePrice: singleOpt ? singleOpt.price : null,
                groupPrice: groupOpt ? groupOpt.price : null,
              };
            })
          );
        }
      } catch (err) {
        console.error("Error fetching packages from Supabase:", err);
      }
    }
    fetchPackages();
  }, []);

  return (
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-8 text-center">
          <h1 className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent font-semibold mb-4">
            Limited Time Offers
          </h1>
          <h1 className="text-4xl uppercase md:text-6xl font-black mb-6 leading-tight">
            Water Park Packages & Prices in Nagpur
          </h1>
          {/* <p className="text-slate-300 max-w-3xl mx-auto mb-8 text-lg">
            Explore thrilling water park packages at Shivtirth Water Park, Nagpur. Affordable prices for solo visitors, families, and groups. Book your adventure today!
          </p> */}
        </div>
      </div>
      {/* <Description/> */}

      {/* Packages Grid */}
      <div id="packages-list" className="max-w-7xl mx-auto px-4 md:px-8 py-20">
        {/* <div className="text-center mb-12">
          <h1 className="inline-block px-4 py-2 rounded-full bg-accent/20 border bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-accent font-semibold mb-4">
            Limited Time Offers
          </h1>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Pick Your Adventure</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Special discounts on all packages! Book now and save big on your next visit.
          </p>
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activePackages.map((pkg, index) => {
            const originalVal = pkg.originalPrice ? parseInt(pkg.originalPrice.replace(/[^\d]/g, '')) : 0;
            const discountedVal = pkg.discountedPrice ? parseInt(pkg.discountedPrice.replace(/[^\d]/g, '')) : 0;
            const hasSavings = originalVal > discountedVal;
            const savingsPercent = hasSavings ? Math.round(((originalVal - discountedVal) / originalVal) * 100) : 0;

            return (
              <Link
                key={pkg.name} // ✅ KEY ON TOP-LEVEL
                href={pkg.link || "#"} // ✅ fallback to prevent crash
                className={`group relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${index === 2 ? 'lg:col-span-1 lg:row-span-1' : ''
                  }`}
              >
                {/* Tag */}
                {pkg.tag && (
                  <div className="absolute top-4 right-4 z-10 px-4 py-1 rounded-full bg-accent text-black text-sm font-bold shadow-lg">
                    {pkg.tag}
                  </div>
                )}

                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden bg-slate-200">
                  <Image
                    src={pkg.image}
                    alt={pkg.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                  <p className="text-slate-600 mb-4 text-sm">{pkg.description}</p>

                  {/* Pricing */}
                  {pkg.groupPrice ? (
                    <div className="space-y-1 mb-4">
                      <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-slate-900">₹{pkg.groupPrice}</div>
                        <span className="text-xs font-bold text-slate-500 mb-1">per person (Group)</span>
                        {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                      </div>
                      {pkg.singlePrice && (
                        <p className="text-xs font-semibold text-slate-600">Single Entry Price: ₹{pkg.singlePrice}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-end gap-3 mb-4">
                      <div className="text-4xl font-black text-slate-900">{pkg.discountedPrice}</div>
                      {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                      {hasSavings && (
                        <div className="text-sm font-bold text-green-600 mb-1">
                          Save {savingsPercent}%
                        </div>
                      )}
                    </div>
                  )}

                <p className="text-xs text-slate-500 mb-4">Per person pricing</p>

                {/* Key Highlights */}
                <div className="mb-4 p-3 bg-accent/5 rounded-lg">
                  <p className="text-xs font-bold text-slate-900 mb-2">Package Includes</p>
                  {/* {pkg.name.includes("Water Park") && <p className="text-xs text-slate-600">✓ Best for water lovers</p>}
                  {pkg.name.includes("Boating") && <p className="text-xs text-slate-600">✓ Perfect for thrill seekers</p>}
                  {pkg.name.includes("Silver") && <p className="text-xs text-slate-600">✓ Water + Boating combo • Maximum fun</p>}
                  {pkg.name.includes("Golden") && <p className="text-xs text-slate-600">✓ Meals included • Best for families</p>}
                  {pkg.name.includes("Day/Night") && <p className="text-xs text-slate-600">✓ Overnight stay • Ultimate experience</p>} */}
                </div>

                {/* Inclusions */}
                <ul className="space-y-2 mb-6">
                  {pkg.inclusions.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-accent text-lg">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <span className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-bold text-black group-hover:opacity-90 transition">
                  {pkg.cta}
                </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Key Offerings Summary */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 bg-white rounded-3xl mx-6 shadow-lg -mt-8 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-black mb-4">What&apos;s Included in Package</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-bold text-slate-900 mb-2">💧 Waterpark</h4>
            <p className="text-slate-600 text-sm leading-relaxed">Adishakti Waterfall • 8 Water pools • Waterfall • Splash Bucket • Rappelling (Upcoming) • Thrill slides • Foam dance</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">🚤 Boating Park</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Banana Boat • Speed Boat • Shikara boat • Kayak boat • Dragon Boat • Sofa Boat • Train Boat • Octopus Ride • Disco Boat • Zorbing Ball
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">🎯 Adventure Park</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Zip Line • Rope Bridges • Obstacle Course • Burma Bridge • Net Climbing • Commando Tower • Target Shooting • Tree House • 3D Show • Butterfly Garden
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">🎢 Amusement Park</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Tora Tora • Columbus • High Swing • Round Swing • Jumper Ride • Kids Play Zone
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">🦆 Bird Park & Safari</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Bird Park • Animal Feeding • Jungle Gypsy • Train Safari • Tractor Safari • Bullock Cart Safari
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-2">🌾 Other Parks & Activities</h4>
            <p className="text-slate-600 text-sm leading-relaxed">Agro Park • Air Tourism • Stay Facilities • Dining • School & College Picnics • Birthday Parties • Wedding Celebrations • Corporate Events • Festive Celebrations • Custom Event Planning</p>
          </div>
        </div>
      </div>

      {/* <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 p-8 md:p-10 border-2 border-accent/30 text-center">
        <div className="text-center mb-12">
          <p className="text-accent font-bold mb-2 uppercase tracking-wider">Bulk & Group Bookings</p>
          <h2 className="text-3xl md:text-5xl font-black mb-4">Custom Packages</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Looking for a personalized package? We offer special rates for groups, schools, colleges, corporate events, and family bulk bookings.
          </p>
        </div>
          <InteractiveHoverButton onClick={() => window.location.href = 'tel:+918275737579'}>
            📞 Call Now for Custom Quote
          </InteractiveHoverButton>
        </div>
      </div> */}

      {/* Inclusions & Facilities */}
      {/* <div className="max-w-7xl mx-auto px-4 md:px-8 pb-14 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-2xl font-black">Park Inclusions</h3>
          </div>
          <ul className="space-y-3 text-slate-600">
            {inclusions.map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <span className="text-accent font-bold text-lg">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-lg border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
              </svg>
            </div>
            <h3 className="text-2xl font-black">Facilities</h3>
          </div>
          <ul className="space-y-3 text-slate-600">
            {facilities.map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <span className="text-accent font-bold text-lg">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div> */}

      {/* Payment CTA */}
      <div id="payment" className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 h-64 w-64 bg-accent/30 rounded-full blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative grid grid-cols-1 gap-8 items-center">
            <div className="md:col-span-2">
              <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold mb-3">
                100% Secure
              </div>
              <h3 className="text-3xl md:text-4xl font-black mb-4">Book your tickets instantly</h3>
              <p className="text-slate-200 text-lg mb-4">
                Pay online via UPI / Cards / Netbanking. Receive instant booking confirmation & digital tickets.
              </p>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Instant Confirmation
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No Hidden Charges
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <a
                href="tel:+918275737579"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 text-white font-semibold py-3 px-6 transition hover:bg-white/10 hover:border-white"
              >
                📞 Call for Assistance
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagesPage;
