"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface BirdSlide {
  title: string;
  description: string;
  image?: string;
  video?: string;
  video_url?: string;
}

const defaultBirdSlides: BirdSlide[] = [
  {
    title: 'Guineafowls & Turkey',
    description: 'Observe active, colourful guineafowls and majestic turkeys in an open natural habitat.',
    image: '/birdspark-1.jpg',
  },
  {
    title: 'Lovebirds & Exotic Pigeons',
    description: 'Interactive aviary setup showcasing vibrant lovebirds, fantail pigeons, and exotic species.',
    image: '/Bird-Park.jpg',
  },
  {
    title: 'Mallard & Country Ducks',
    description: 'Watch friendly duck ponds featuring Mallard ducks and country ducks splashing in natural water streams.',
    image: '/Bird-Park.jpg',
  },
  {
    title: 'Rabbits & Farm Animals',
    description: 'Gentle, hands-on learning zone with adorable rabbits and farm animals for kids.',
    image: '/Bird-Park.jpg',
  }
];

const BirdParkPage = () => {
  const [slides, setSlides] = useState<BirdSlide[]>(defaultBirdSlides);
  const [headerTitle, setHeaderTitle] = useState("Bird Park");
  const [headerSub, setHeaderSub] = useState(
    "Guineafowls | Turkey | Lovebirds | Pigeons | Mallard Ducks | Gavrani Ducks | Rabbits | Family-Friendly Learn & Explore Experience"
  );
  const [headerDesc, setHeaderDesc] = useState(
    "Walk among beautiful exotic birds in an open, vibrant natural environment surrounded by Satpuda green valley."
  );
  const [heroImage, setHeroImage] = useState("/Bird-Park.jpg");
  const [heroVideo, setHeroVideo] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: headerData } = await supabase
          .from("website_content")
          .select("content")
          .eq("section", "park_header_bird-park")
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
          .eq("park_type", "bird-park")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (attractionData && attractionData.length > 0) {
          setSlides(attractionData);
        }
      } catch (err) {
        console.error("Error loading bird park content:", err);
      }
    }
    fetchData();
  }, []);

  const birdFacilities = [
    'Variety of birds - Guineafowls, Turkey, Lovebirds, Pigeons, Mallard Ducks, Gavrani Ducks',
    'Farm animals - Rabbits, Hens and Roosters for educational experiences',
    'Nature-friendly environment - Peaceful setting for bird observation and interaction',
    'Family-friendly experience - Safe and educational for all ages',
    'Bird-watching opportunities - Designated viewing areas and photo points',
    'School visit friendly - Educational guides and learning experiences available'
  ];

  const birdRules = [
    'Do not tease, chase or frighten the birds and animals',
    'Do not touch or handle birds/animals unless permitted by staff',
    'Do not feed birds or animals with outside food',
    'Follow staff instructions and displayed park guidelines',
    'Children must remain under adult supervision',
    'Do not throw objects into bird or animal enclosures',
    'Maintain cleanliness and use designated dustbins',
    'Avoid loud noises near birds and animals',
    'Do not enter restricted or staff-only areas'
  ];

  const birdFaqs = [
    {
      question: 'What is Sai Bird Park at Shivtirth?',
      answer: 'Sai Bird Park is a nature-focused attraction at Shivtirth where visitors can see different types of birds and animals in a relaxing environment.'
    },
    {
      question: 'Where is Bird Park near Nagpur?',
      answer: 'Sai Bird Park is located inside the Shivtirth destination at Umri (Dam), Saoner, near Nagpur.'
    },
    {
      question: 'What birds can I see at Shivtirth Bird Park?',
      answer: 'Visitors can see Guineafowls, Turkey, Lovebirds, Pigeons, Mallard Ducks and Country/Gavrani Ducks, along with rabbits and farm birds.'
    },
    {
      question: 'Is Bird Park suitable for children?',
      answer: 'Yes. It is a family-friendly and educational experience where children can observe birds and animals in a calm environment.'
    }
  ];

  return (
    <main id="about-park" className="bg-gradient-to-b from-emerald-950 via-slate-900 to-emerald-950 text-slate-100">
      <div className="relative">
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
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-accent drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                {headerTitle}
              </h1>
              <p className="mt-2 text-sm text-emerald-100/90 drop-shadow-sm font-medium">
                {headerSub}
              </p>
            </div>
          </div>
        </div>
      </div>

      <InteractiveHoverButton
        href="/offers"
        className="flex text-slate-900 fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl text-xs md:text-sm font-bold"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* Attractions Section */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#386641] via-[#6a994e] to-[#1a3a2a] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-emerald-100/90 mb-8 text-sm leading-relaxed max-w-2xl">
              {headerDesc}
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {slides.map((slide, idx) => {
              const videoSrc = slide.video || slide.video_url || (
                slide.image && (slide.image.endsWith('.mp4') || slide.image.endsWith('.webm') || slide.image.endsWith('.ogg') || slide.image.includes('/video/'))
                  ? slide.image
                  : null
              );

              return (
                <ScrollReveal key={idx} direction="up" delay={0.15 * (idx % 2)} duration={0.5}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/20">
                    <div className={`order-1 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
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
                            src={slide.image || '/Bird-Park.jpg'}
                            alt={slide.title}
                            fill
                            className="object-cover object-[50%_18%] hover:scale-105 transition duration-500"
                            sizes="(min-width: 768px) 50vw, 100vw"
                          />
                        )}
                      </div>
                    </div>
                    <div className={`order-2 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                      <h3 className="text-2xl font-bold text-white font-times mb-2" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                        {slide.title}
                      </h3>
                      <p className="text-sm text-emerald-50">{slide.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Facilities & Rules */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-emerald-100">
              <h3 className="text-lg md:text-xl font-bold text-emerald-800 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Facilities
              </h3>
              <ul className="space-y-2.5">
                {birdFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-emerald-100">
              <h3 className="text-lg md:text-xl font-bold text-emerald-800 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {birdRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-teal-100 text-teal-700 shrink-0">
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
      <section className="mx-auto max-w-6xl px-4 py-6 pb-10">
        <ScrollReveal direction="up" delay={0.25}>
          <div className="rounded-2xl bg-white/95 text-slate-900 p-5 md:p-6 shadow-lg border border-emerald-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {birdFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`bird-faq-${idx}`} className="border-slate-200">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-emerald-600 text-left">
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
};

export default BirdParkPage;
