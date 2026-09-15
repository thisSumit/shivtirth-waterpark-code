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
  video?: string;
  video_url?: string;
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
];

const getSectionId = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

interface AccommodationCardProps {
  item: AccommodationItem;
  index: number;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ item, index }) => {
  const isEven = index % 2 === 0;
  const videoSrc = item.video || item.video_url || (
    item.image && (item.image.endsWith('.mp4') || item.image.endsWith('.webm') || item.image.endsWith('.ogg') || item.image.includes('/video/'))
      ? item.image
      : null
  );

  return (
    <ScrollReveal direction="up" delay={0.1} duration={0.6}>
      <div
        id={getSectionId(item.name)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition"
      >
        {/* Media Column */}
        <div className={`order-1 ${isEven ? "md:order-1" : "md:order-2"}`}>
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md">
            {videoSrc ? (
              <video
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            ) : (
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
            )}
          </div>
        </div>

        {/* Content Column */}
        <div className={`order-2 ${isEven ? "md:order-2" : "md:order-1"} flex flex-col justify-center space-y-3`}>
          <h3
            className="text-2xl font-bold text-slate-900 font-times mb-2"
            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
          >
            {item.name}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {item.description}
          </p>

          {/* Feature Badges */}
          {item.features && item.features.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {item.features.map((feature, fIdx) => (
                <span
                  key={`${item.name}-feature-${fIdx}`}
                  className="inline-block px-2.5 py-1 bg-amber-50 border border-amber-300/60 rounded-full text-sm font-semibold text-slate-800 hover:bg-amber-100 transition"
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm uppercase tracking-wider hover:bg-amber-500 hover:text-slate-950 transition shadow-md"
            >
              Call to Plan & Book
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<AccommodationItem[]>(defaultAccommodations);
  const [headerTitle, setHeaderTitle] = useState("Accommodation & Night Stays");
  const [headerSub, setHeaderSub] = useState(
    "Farmhouse Bungalows | Camping Tents | Dormitory Cottages | Deluxe AC Rooms | Bonfire & Music"
  );
  const [headerDesc, setHeaderDesc] = useState(
    "From Cozy Deluxe Rooms to Spacious Family Cottages/Dormitory & Premium Villas - Your Perfect Getaway! Enjoy Modern Comforts, Lush Green, Dam Views, Delicious Food, Team Games and Warm Hospitality, All at One Place."
  );
  const [heroImage, setHeroImage] = useState("/farmhouse.png");
  const [heroVideo, setHeroVideo] = useState("");

  useEffect(() => {
    async function fetchAccommodations() {
      try {
        const { data: headerData } = await supabase
          .from("website_content")
          .select("content")
          .eq("section", "park_header_accommodation")
          .single();

        if (headerData && headerData.content) {
          const c = headerData.content;
          if (c.title) setHeaderTitle(c.title);
          if (c.subDescription) setHeaderSub(c.subDescription);
          if (c.mainDescription) setHeaderDesc(c.mainDescription);
          if (c.imageUrl) setHeroImage(c.imageUrl);
          if (c.videoUrl) setHeroVideo(c.videoUrl);
        }

        const { data: attractionData } = await supabase
          .from("attractions")
          .select("title, description, image, video, video_url")
          .eq("park_type", "accommodation")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (attractionData && attractionData.length > 0) {
          setAccommodations(
            attractionData.map((item) => ({
              name: item.title,
              image: item.image,
              video: item.video,
              video_url: item.video_url,
              description: item.description,
              features: [],
            }))
          );
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
          {heroVideo ? (
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={heroImage}
              alt={headerTitle}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center">
            <div className="max-w-4xl text-center">
              <h1
                className="text-4xl font-bold text-accent drop-shadow-lg uppercase tracking-wide"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              >
                {headerTitle}
              </h1>
              <p className="mt-2 text-sm text-cyan-100/90 drop-shadow-sm font-medium">
                {headerSub}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Cards Section */}
      <section className="py-10 md:py-14 bg-white text-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed max-w-2xl">
              {headerDesc}
            </p>
          </ScrollReveal>

          <div className="space-y-8">
            {accommodations.map((item, idx) => (
              <AccommodationCard key={item.name} item={item} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Rules */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-6">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 text-slate-900 p-5 shadow-sm border border-slate-200">
              <h3
                className="text-lg md:text-xl font-bold text-amber-700 font-times mb-3"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              >
                Facilities
              </h3>
              <ul className="space-y-2.5">
                {accommodationFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-slate-50 text-slate-900 p-5 shadow-sm border border-slate-200">
              <h3
                className="text-lg md:text-xl font-bold text-amber-700 font-times mb-3"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              >
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {accommodationRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                    </span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-6 pb-12">
        <ScrollReveal direction="up" delay={0.25}>
          <div className="rounded-2xl bg-slate-50 text-slate-900 p-5 md:p-6 shadow-sm border border-slate-200">
            <h3
              className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3"
              style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
            >
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {accommodationFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`acc-faq-${idx}`} className="border-slate-200">
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
      </section>
    </main>
  );
}