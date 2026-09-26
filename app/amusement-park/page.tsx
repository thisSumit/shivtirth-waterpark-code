"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface AmusementSlide {
  title: string;
  description: string;
  image?: string;
  video?: string;
  video_url?: string;
}

const defaultAmusementSlides: AmusementSlide[] = [
  {
    title: 'Tora Tora Ride',
    description: 'Feel the rush of fast spins and continuous motion as the ride swings and rotates in sync for a high-energy, action-packed experience.',
    image: '/tora-tora.jpeg',
  },
  {
    title: 'Columbus Ride',
    description: 'Feel the thrill as the giant ship swings higher with every motion, building excitement and anticipation in a classic ride experience.',
    image: '/columbus-ride.jpeg',
  },
  {
    title: 'High Swing',
    description: 'Rise above the ground and feel the thrill as the swing lifts you higher with every motion, offering a refreshing ride with height.',
    image: '/high-swing.png',
  },
  {
    title: 'Round Swing',
    description: 'Enjoy a smooth, circular ride that brings together gentle spins and a cheerful atmosphere, relaxing for all ages.',
    image: '/round-swing.jpg',
  },
  {
    title: 'Jumper Ride',
    description: 'Feel the excitement of quick lifts and rhythmic motion as the ride keeps you moving with energy and fun.',
    image: '/jumper-ride.jpg',
  },
  {
    title: 'Kids Play Zone',
    description: 'A thoughtfully designed space where children can play, explore, and enjoy with ease in safe mini rides.',
    image: '/kids-play-zone.png',
  }
];

const AmusementParkPage = () => {
  const [slides, setSlides] = useState<AmusementSlide[]>(defaultAmusementSlides);
  const [headerTitle, setHeaderTitle] = useState("Amusement Park");
  const [headerSub, setHeaderSub] = useState(
    "Tora Tora Ride | Break Dance Ride | Columbus Ride | Round Up Ride | Swings | Play Zone | Jumper | Selfie Points"
  );
  const [headerDesc, setHeaderDesc] = useState(
    "Get Ready for Non-Stop Thrills! From High-Speed Thrill Rides to Fun-Filled Family & Kids Rides - The Ultimate Entertainment Destination for Everyone !"
  );
  const [heroImage, setHeroImage] = useState("/amusement.jpg");
  const [heroVideo, setHeroVideo] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: headerData } = await supabase
          .from("website_content")
          .select("content")
          .eq("section", "park_header_amusement-park")
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
          .select("*")
          .eq("park_type", "amusement-park")
          .order("display_order", { ascending: true });

        const visibleAttractions = (attractionData || []).filter((item: any) => item.is_hidden !== true);

        if (visibleAttractions && visibleAttractions.length > 0) {
          setSlides(visibleAttractions);
        }
      } catch (err) {
        console.error("Error loading amusement park content:", err);
      }
    }
    fetchData();
  }, []);

  const amusementParkFacilities = [
    'Trained Ride Operators - Dedicated staff ensuring safety compliance on all rides',
    'Kids Safety Belts & Harnesses - Secure safety restraints for children on high-swing rides',
    'Shaded Waiting Queues - Covered waiting lanes for guest comfort during peak hours',
    'Clean Restrooms & Refreshments - Easy access to washrooms, water points, and snack kiosks'
  ];

  const amusementParkRules = [
    'Height & Age Restrictions: Strictly follow height guidelines posted at ride entrances',
    'Secure Personal Items: Remove loose footwear, glasses, and phones before boarding high-spin rides',
    'Remain Seated: Keep arms and legs inside the ride vehicle at all times until completely stopped',
    'Follow Operator Signals: Board and exit only when instructed by ride safety staff'
  ];

  const amusementParkFaqs = [
    {
      question: 'What rides are available in the Amusement Park sector?',
      answer: 'Shivtirth Amusement Park features Tora Tora, Columbus Giant Swing, High Swings, Round Swings, Jumper Ride, and dedicated Kids Play Zones.'
    },
    {
      question: 'Are the amusement rides safe for young children?',
      answer: 'Yes, we have designated kids rides and gentle swings equipped with safety harnesses and supervised by trained operators.'
    }
  ];

  return (
    <main id="about-park" className="bg-gradient-to-b from-amber-950 via-slate-900 to-amber-950 text-slate-100">
      {/* Hero Section */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-orange-500/10 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-accent drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                {headerTitle}
              </h1>
              <p className="mt-2 text-sm text-amber-100/90 drop-shadow-sm font-medium">
                {headerSub}
              </p>
            </div>
          </div>
        </div>
      </div>

      <InteractiveHoverButton
        href={"/offers"}
        className="flex text-slate-900 fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl text-xs md:text-sm font-bold"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* Attractions Section */}
      <section className="pt-4 pb-10 md:pb-14 bg-gradient-to-br from-[#ff930f] via-[#fbcf00] to-[#fff95b] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-amber-100/90 mb-8 text-sm leading-relaxed max-w-2xl">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-amber-400/20">
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
                            src={slide.image || '/tora-tora.jpeg'}
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
                      <p className="text-sm text-amber-50">{slide.description}</p>
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
            <div className="rounded-2xl bg-white/95 text-[#288382] p-5 shadow-lg border border-amber-100">
              <h3 className="text-lg md:text-xl font-bold text-[#288382] font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Facilities
              </h3>
              <ul className="space-y-2.5">
                {amusementParkFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/95 text-[#288382] p-5 shadow-lg border border-amber-100">
              <h3 className="text-lg md:text-xl font-bold text-[#288382] font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {amusementParkRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-orange-100 text-orange-700 shrink-0">
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
          <div className="rounded-2xl bg-white/95 text-[#288382] p-5 md:p-6 shadow-lg border border-amber-100">
            <h3 className="text-lg md:text-xl font-bold text-[#288382] font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {amusementParkFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`amusement-faq-${idx}`} className="border-slate-200">
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
};

export default AmusementParkPage;