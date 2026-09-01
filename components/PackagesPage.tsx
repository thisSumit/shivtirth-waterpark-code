"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import AnimatedHeading from "./ui/AnimatedHeading";
import { ScrollReveal, ScrollStaggerItem } from "./ui/ScrollReveal";

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
    description: "Waterpark Package + Boating Park Package Activities - The perfect combo for thrill seekers",
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
    inclusions: ["Waterpark + Boating", "Stay Facilities - Camping stay / Farm House", "2 Meals included", "Bonfire & activities", "Breakfast next day"],
    cta: "Book Day / Night Stay",
    link: '/checkout',
  },
];

const PackagesPage = () => {
  const [activePackages, setActivePackages] = useState<Package[]>(packages);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const { data } = await supabase
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
    <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-16 text-center">
          <ScrollReveal direction="down" delay={0.1}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-semibold text-xs uppercase tracking-wider mb-4">
              Limited Time Offers
            </span>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.2}>
            <h1 
              className="text-4xl uppercase md:text-6xl font-bold mb-4 leading-tight tracking-wide font-times"
              style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
            >
              Water Park Packages & Prices in Nagpur
            </h1>
          </ScrollReveal>
        </div>
      </div>

      {/* Packages Grid */}
      <div id="packages-list" className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <ScrollReveal direction="up" delay={0.2} duration={0.6}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activePackages.map((pkg, index) => {
              const originalVal = pkg.originalPrice ? parseInt(pkg.originalPrice.replace(/[^\d]/g, '')) : 0;
              const discountedVal = pkg.discountedPrice ? parseInt(pkg.discountedPrice.replace(/[^\d]/g, '')) : 0;
              const hasSavings = originalVal > discountedVal;
              const savingsPercent = hasSavings ? Math.round(((originalVal - discountedVal) / originalVal) * 100) : 0;

              return (
                <ScrollStaggerItem key={pkg.name}>
                  <Link
                    href={pkg.link || "#"}
                    className="group relative flex flex-col justify-between h-full rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Tag */}
                    {pkg.tag && (
                      <div className="absolute top-4 right-4 z-10 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                        {pkg.tag}
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative aspect-[3/2] overflow-hidden bg-slate-200">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 
                          className="text-xl md:text-2xl font-bold mb-1.5 font-times text-slate-900"
                          style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                        >
                          {pkg.name}
                        </h3>
                        <p className="text-slate-600 mb-3 text-xs md:text-sm leading-relaxed">{pkg.description}</p>

                        {/* Pricing */}
                        {pkg.groupPrice ? (
                          <div className="space-y-1 mb-4">
                            <div className="flex items-end gap-3">
                              <div className="text-4xl font-bold text-slate-900 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>₹{pkg.groupPrice}</div>
                              <span className="text-xs font-bold text-slate-500 mb-1">per person (Group)</span>
                              {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                            </div>
                            {pkg.singlePrice && (
                              <p className="text-xs font-semibold text-slate-600">Single Entry Price: ₹{pkg.singlePrice}</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-end gap-3 mb-4">
                            <div className="text-4xl font-bold text-slate-900 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>{pkg.discountedPrice}</div>
                            {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                            {hasSavings && (
                              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
                                Save {savingsPercent}%
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-slate-500 mb-4">Per person pricing</p>

                        {/* Inclusions */}
                        <ul className="space-y-2 mb-6 border-t border-slate-100 pt-4">
                          {pkg.inclusions.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-amber-500 font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CTA */}
                      <span className="w-full text-center rounded-full bg-slate-900 text-white py-3 font-bold text-sm uppercase tracking-wider group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shadow-md">
                        {pkg.cta}
                      </span>
                    </div>
                  </Link>
                </ScrollStaggerItem>
              );
            })}
          </div>
        </ScrollReveal>
      </div>

      {/* Key Offerings Summary */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/80">
            <AnimatedHeading
              title="What's Included in Package"
              subtitle="Comprehensive fun with no compromise"
              align="center"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm pt-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>💧 Waterpark</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Adishakti Waterfall • 8 Water pools • Waterfall • Splash Bucket • Rappelling • Thrill slides • Foam dance</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>🚤 Boating Park</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Banana Boat • Speed Boat • Shikara boat • Kayak boat • Dragon Boat • Sofa Boat • Train Boat • Octopus Ride • Disco Boat • Zorbing Ball
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>🎯 Adventure Park</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Zip Line • Rope Bridges • Obstacle Course • Burma Bridge • Net Climbing • Commando Tower • Target Shooting • Tree House • 3D Show • Butterfly Garden
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>🎢 Amusement Park</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tora Tora • Columbus • High Swing • Round Swing • Jumper Ride • Kids Play Zone
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>🦆 Bird Park & Safari</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bird Park • Animal Feeding • Jungle Gypsy • Train Safari • Tractor Safari • Bullock Cart Safari
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 text-base font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>🌾 Other Parks & Activities</h4>
                <p className="text-slate-600 text-sm leading-relaxed">Agro Park • Air Tourism • Stay Facilities • Dining • School & College Picnics • Birthday Parties • Wedding Celebrations • Corporate Events • Festive Celebrations</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Payment CTA */}
      <div id="payment" className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <ScrollReveal direction="up" delay={0.3}>
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-16 -top-16 h-64 w-64 bg-amber-500/20 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="inline-block px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                  100% Secure
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                  Book your tickets instantly
                </h3>
                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  Pay online via UPI / Cards / Netbanking. Receive instant booking confirmation & digital tickets.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <a
                  href="tel:+918605362212"
                  className="inline-flex items-center justify-center rounded-full border-2 border-amber-400 text-amber-300 font-bold py-3.5 px-6 transition hover:bg-amber-400 hover:text-slate-950 text-center uppercase tracking-wider text-sm shadow-lg"
                >
                  📞 Call for Assistance
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PackagesPage;
