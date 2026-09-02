"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// --- Types ---
type AccommodationItem = {
  name: string;
  image: string;
  description: string;
  features: string[];
};

// --- Defaults ---
const defaultAccommodations: AccommodationItem[] = [
  {
    name: "Stay Facilities",
    image: "/farmhouse.png",
    description:
      "Why let the fun end at sunset? Trade the long drive home for a night under the stars. From cozy, rustic stays to premium comfort, our facilities are designed to let you recharge in the heart of nature.",
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
  "Check-in and check-out must be completed as per communicated timings.",
  "Guests are responsible for keeping their rooms and belongings safe.",
  "Smoking and restricted activities are not permitted in prohibited areas.",
  "Guests should maintain cleanliness and avoid damaging property.",
  "Children must remain under proper adult supervision.",
  "Any damage to room property may be chargeable.",
  "Booking cancellation and refund policies apply as communicated.",
];

const accommodationFaqs = [
  {
    question: "Does Shivtirth have accommodation facilities?",
    answer:
      "Yes, Shivtirth offers accommodation options for visitors who want to extend their stay and enjoy the destination at a relaxed pace.",
  },
  {
    question: "Can I stay overnight at Shivtirth?",
    answer:
      "Yes, overnight accommodation is available depending on room availability and the selected package.",
  },
  {
    question: "What type of accommodation is available at Shivtirth?",
    answer:
      "Shivtirth offers farmhouse bungalows, camping tents, dormitory cottages, and deluxe AC rooms for families and groups.",
  },
  {
    question: "Is accommodation suitable for families?",
    answer:
      "Yes. Shivtirth accommodation is designed to provide a comfortable stay for families, couples, and group travellers.",
  },
  {
    question: "How can I book accommodation at Shivtirth?",
    answer:
      "Guests can contact the Shivtirth team directly or click the Call to Plan button to check availability and rates.",
  },
];

const getSectionId = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

// --- Sub-component ---
interface AccommodationCardProps {
  item: AccommodationItem;
  index: number;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ item, index }) => {
  const isEven = index % 2 === 0;

  return (
    <ScrollReveal direction="up" delay={0.1} duration={0.6}>
      <div
        id={getSectionId(item.name)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition"
      >
        {/* Image Column */}
        <div className={`order-1 ${isEven ? "md:order-1" : "md:order-2"}`}>
          <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
            <Image
              src={
                item.image.startsWith("http") || item.image.startsWith("/")
                  ? item.image
                  : `/${item.image}`
              }
              alt={item.name}
              fill
              className="object-cover object-center hover:scale-105 transition duration-500"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority={index === 0}
            />
          </div>
        </div>

        {/* Content Column */}
        <div className={`order-2 ${isEven ? "md:order-2" : "md:order-1"} flex flex-col justify-center space-y-3`}>
          <h3
            className="text-lg md:text-xl font-bold text-slate-900"
            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
          >
            {item.name}
          </h3>

          <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
            {item.description}
          </p>

          {/* Feature Badges */}
          {item.features && item.features.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {item.features.map((feature, fIdx) => (
                <span
                  key={`${item.name}-feature-${fIdx}`}
                  className="inline-block px-2.5 py-1 bg-amber-50 border border-amber-300/60 rounded-full text-xs font-semibold text-slate-800 hover:bg-amber-100 transition"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="tel:+918605362212"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-amber-500 hover:text-slate-950 transition shadow-md"
            >
              Call to Plan & Book
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

// --- Main Page Component ---
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
          const stayKeywords = [
            "stay",
            "farmhouse",
            "tent",
            "camping",
            "cottage",
            "room",
            "accommodation",
          ];
          const dbStayItems = data
            .filter((item) => {
              const titleLower = (item.title || "").toLowerCase();
              const typeLower = (item.park_type || "").toLowerCase();
              return stayKeywords.some(
                (kw) => titleLower.includes(kw) || typeLower.includes(kw)
              );
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
                  features:
                    dbItem.features.length > 0
                      ? dbItem.features
                      : merged[index].features,
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
    <main id="about-park" className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
          <Image
            src="/farmhouse.png"
            alt="Shivtirth Stay Facilities & Farmhouse"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center">
            <div className="max-w-4xl text-center">
              <h1
                className="text-2xl md:text-4xl font-bold text-amber-400 drop-shadow-lg uppercase tracking-wide"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              >
                Accommodation & Night Stays
              </h1>
              <p className="mt-2 text-xs md:text-sm text-cyan-100/90 drop-shadow-sm font-medium">
                Farmhouse Bungalows | Camping Tents | Dormitory Cottages | Deluxe AC Rooms | Bonfire & Music
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Cards Section */}
      <section className="py-10 md:py-14 bg-white text-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <h2
              className="text-2xl md:text-3xl font-bold text-slate-900 mb-2"
              style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
            >
              Stay Facilities & Night Experiences
            </h2>
            <p className="text-slate-600 mb-8 text-xs md:text-sm leading-relaxed max-w-2xl">
              Why let the fun end at sunset? Trade the long drive home for a night under the stars with our range of cozy, rustic, and luxury accommodations.
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {accommodations.map((item, idx) => (
              <AccommodationCard key={item.name || idx} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Rules Section */}
      <section className="bg-slate-50 py-10 md:py-14 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.2}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h3
                  className="text-lg md:text-xl font-bold text-slate-900 mb-4"
                  style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                >
                  Facilities & Amenities
                </h3>
                <ul className="space-y-3">
                  {accommodationFacilities.map((facility) => (
                    <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                      <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                        <BadgeCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{facility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
                <h3
                  className="text-lg md:text-xl font-bold text-slate-900 mb-4"
                  style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                >
                  Rules & Guidelines
                </h3>
                <ul className="space-y-3">
                  {accommodationRules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                      <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-10 md:py-14 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.25}>
            <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-slate-200 max-w-4xl mx-auto">
              <h3
                className="text-lg md:text-xl font-bold text-slate-900 mb-4 text-center md:text-left"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              >
                Frequently Asked Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {accommodationFaqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`accommodation-faq-${idx}`} className="border-slate-200">
                    <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-amber-600 text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs md:text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-10 bg-slate-900" />
    </main>
  );
}