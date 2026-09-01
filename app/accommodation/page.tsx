"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { BadgeCheck, ShieldCheck } from 'lucide-react'
import { supabase } from "@/lib/supabase";

type AccommodationItem = {
  name: string;
  image: string;
  description: string;
  features: string[];
};

const defaultAccommodations: AccommodationItem[] = [
  {
    name: "Stay Facilities",
    image: "/farmhouse.png",
    description:
      "Why let the fun end at sunset? Trade the long drive home for a night under the stars. From cozy, rustic stays to premium comfort, our facilities are designed to let you recharge in the heart of nature. Wake up to the sound of birds and the fresh scent of the wild - your ultimate staycation starts here.",
    features: [
      "Farmhouse Bungalows",
      "Dormitory Cottages",
      "Camping Tents",
      "AC Rooms",
      "Campfire & Bonfire",
      "24/7 Security",
    ],
  },
  {
    name: "Farmhouse Bungalows",
    image: "/farmhouse.png",
    description:
      "Spacious private farmhouse with lush green garden lawns, AC bedrooms, living room, and exclusive sit-out area. Ideal for family reunions, group parties, and private gatherings looking for an exclusive getaway.",
    features: [
      "AC Bedrooms with Attached Bath",
      "Private Lawn & Garden Sit-out",
      "Spacious Living Hall",
      "24/7 Hot Water & Power Backup",
      "Water Park & Pool Access",
    ],
  },
  {
    name: "Camping Tents Experience",
    image: "/Stay-Facilities.jpg",
    description:
      "Immerse yourself in authentic outdoors! Premium waterproof camping tents under starry skies with evening bonfire, ambient music, and next morning breakfast surrounded by nature.",
    features: [
      "Waterproof Tents with Bedding",
      "Evening Campfire & Music Setup",
      "Complimentary Morning Breakfast",
      "Access to Agro & Bird Park",
      "Safe & Secured Camping Grounds",
    ],
  },
  {
    name: "Dormitory Cottages",
    image: "/ag4.jpg",
    description:
      "Comfortable dormitory style air-cooled cottages designed for student picnics, large family groups, and corporate team outings looking for value and togetherness.",
    features: [
      "Multiple Beds with Clean Linen",
      "Clean Shared Washrooms",
      "Personal Storage Lockers",
      "Close to Dining Arena",
      "Group Discount Packages",
    ],
  },
  {
    name: "Deluxe AC Rooms",
    image: "/g10.png",
    description:
      "Modern deluxe air-conditioned rooms equipped with plush king beds, flat-screen TV, room service, and tranquil views of surrounding plantations for ultimate comfort.",
    features: [
      "King Size Plush Mattress",
      "Split Air Conditioning",
      "Flat Screen TV & WiFi Access",
      "Complimentary Tea/Coffee Maker",
      "24/7 Housekeeping Service",
    ],
  },
];

const getSectionId = (name: string) => {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const accommodationFacilities = [
  "Comfortable rooms and stay options",
  "Basic room amenities and clean bathrooms",
  "Parking facility for guests",
  "Peaceful natural surroundings and open-air environment",
  "Family-friendly stay environment",
  "Group accommodation options",
  "Dining options subject to package and availability",
  "Convenient access to Shivtirth attractions",
];

const accommodationRules = [
  "Guests must carry valid ID proof during check-in.",
  "Check-in and check-out must be completed as per the communicated timings.",
  "Guests are responsible for keeping their rooms and belongings safe.",
  "Smoking and restricted activities are not permitted in prohibited areas.",
  "Guests should maintain cleanliness and avoid damaging accommodation property.",
  "Children must remain under proper adult supervision.",
  "Any damage to room property may be chargeable.",
  "Booking cancellation, refund and modification policies apply as communicated at booking time.",
];

const accommodationFaqs = [
  {
    question: 'Does Shivtirth have accommodation facilities?',
    answer: 'Yes, Shivtirth offers accommodation options for visitors who want to extend their stay and enjoy the destination at a relaxed pace.'
  },
  {
    question: 'Can I stay overnight at Shivtirth?',
    answer: 'Yes, overnight accommodation may be available depending on room availability and the selected package.'
  },
  {
    question: 'What type of accommodation is available at Shivtirth?',
    answer: 'Shivtirth offers farmhouse bungalows, camping tents, dormitory cottages, and deluxe AC rooms for families and groups.'
  },
  {
    question: 'Is accommodation suitable for families?',
    answer: 'Yes. Shivtirth accommodation is designed to provide a comfortable stay for families, couples and group travellers.'
  },
  {
    question: 'How can I book accommodation at Shivtirth?',
    answer: 'Guests can contact the Shivtirth team to check room availability, rates, packages and booking details.'
  }
];

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>(defaultAccommodations);

  useEffect(() => {
    async function fetchAccommodations() {
      try {
        const { data } = await supabase
          .from("activities")
          .select("title, image, description, features, park_type, is_hidden")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (data && data.length > 0) {
          // Filter activities that belong to stay/accommodation category or have stay keywords
          const stayKeywords = ["stay", "farmhouse", "tent", "camping", "cottage", "room", "accommodation"];
          const dbStayItems = data
            .filter((item) => {
              const titleLower = (item.title || "").toLowerCase();
              const typeLower = (item.park_type || "").toLowerCase();
              return stayKeywords.some((kw) => titleLower.includes(kw) || typeLower.includes(kw));
            })
            .map((item) => ({
              name: item.title,
              image: item.image,
              description: item.description,
              features: Array.isArray(item.features) ? item.features : [],
            }));

          if (dbStayItems.length > 0) {
            const merged = [...defaultAccommodations];
            dbStayItems.forEach((dbItem) => {
              const index = merged.findIndex(
                (p) => p.name.toLowerCase().trim() === dbItem.name.toLowerCase().trim()
              );
              if (index !== -1) {
                merged[index] = {
                  ...merged[index],
                  image: dbItem.image || merged[index].image,
                  description: dbItem.description || merged[index].description,
                  features: dbItem.features.length > 0 ? dbItem.features : merged[index].features,
                };
              } else {
                merged.push(dbItem);
              }
            });
            setAccommodations(merged);
          }
        }
      } catch (err) {
        console.error("Error fetching accommodation activities from Supabase:", err);
      }
    }
    fetchAccommodations();
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      {/* Hero Header */}
      <div className="relative">
        <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
          <Image
            src="/farmhouse.png"
            alt="Shivtirth Stay Facilities & Farmhouse"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-12 md:bottom-20 px-6 flex justify-center text-center">
            <div className="max-w-3xl text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-xs uppercase tracking-wider mb-3 backdrop-blur-md">
                Accommodation & Stays
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg uppercase tracking-wide">
                Stay Facilities & Farmhouse
              </h1>
              <p className="mt-3 text-sm md:text-lg text-white/90 drop-shadow-md leading-relaxed font-medium">
                Why let the fun end at sunset? Trade the long drive home for a night under the stars. Explore private farmhouse bungalows, camping tents, dormitory cottages, and deluxe AC rooms.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8" />
      </div>

      {/* Accommodations List (Identical style to /parks-experiences) */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 py-10 md:py-12 space-y-6 md:space-y-7">
        {accommodations.map((item, idx) => (
          <div
            key={item.name}
            id={getSectionId(item.name)}
            className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-0 rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-100"
          >
            <div
              className={`relative w-full aspect-square overflow-hidden order-1 ${
                idx % 2 === 1 ? "md:order-2" : "md:order-1"
              }`}
            >
              <Image
                src={item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `/${item.image}`}
                alt={item.name}
                fill
                className="object-cover object-center hover:scale-105 transition duration-500"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={idx === 0}
              />
            </div>

            <div
              className={`space-y-3 md:space-y-4 order-2 px-5 md:px-8 py-5 md:py-6 self-center ${
                idx % 2 === 1 ? "md:order-1" : "md:order-2"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                Accommodation Option
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {item.name}
              </h2>
              <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {item.features &&
                  item.features.map((feature, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-block px-2.5 py-1 bg-linear-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-full text-xs md:text-sm font-semibold text-slate-700 hover:bg-accent/30 transition"
                    >
                      {feature}
                    </span>
                  ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <InteractiveHoverButton href="/offers">
                  Book Now
                </InteractiveHoverButton>
                <Link
                  href="tel:+918605362212"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 text-slate-800 font-semibold hover:bg-accent/20 transition text-sm"
                >
                  Call to Plan
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 md:p-8">
            <h3 className="text-2xl font-black text-slate-900">Facilities</h3>
            <ul className="mt-5 space-y-3">
              {accommodationFacilities.map((facility) => (
                <li key={facility} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
                    <BadgeCheck className="h-3.5 w-3.5" />
                  </span>
                  <span>{facility}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 md:p-8">
            <h3 className="text-2xl font-black text-slate-900">Rules & Guidelines</h3>
            <ul className="mt-5 space-y-3">
              {accommodationRules.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-20">
        <div className="rounded-[28px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 md:p-8">
          <h3 className="text-2xl font-black text-slate-900 mb-3">Frequently Asked Questions</h3>
          <div className="max-w-7xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {accommodationFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`accommodation-faq-${idx}`}>
                  <AccordionTrigger className="text-left text-slate-900 hover:text-accent">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-slate-600 pt-2">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
}
