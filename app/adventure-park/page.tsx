"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface AdventureSlide {
  title: string;
  description: string;
  image?: string;
  video?: string;
  video_url?: string;
}

const defaultAdventureSlides: AdventureSlide[] = [
  {
    title: 'Zip Line',
    description: 'Soar through the air on an exciting zip line ride that gives you a thrilling bird’s-eye view of the natural surroundings.',
    image: '/mowgli-adventure.jpg',
  },
  {
    title: 'Rope Bridges & Obstacles',
    description: 'Challenge your balance and confidence across various elevated rope crossings designed for fun and adventure.',
    image: '/high-rope.jpeg',
  },
  {
    title: 'Commando Tower',
    description: 'Test your strength and endurance as you climb up and conquer the commando tower obstacle.',
    image: '/climbing.jpeg',
  },
  {
    title: 'Tyre & Burma Bridges',
    description: 'Navigate through suspended tyre bridges and classic Burma bridges for an authentic jungle adventure experience.',
    image: '/mowgli-adventure.jpg',
  },
  {
    title: 'Tree House & Nature Trail',
    description: 'Explore nature walks leading up to elevated tree houses surrounded by lush green foliage.',
    image: '/mowgli-adventure.jpg',
  },
  {
    title: 'Butterfly Garden & 3D Show',
    description: 'Relax in peaceful butterfly gardens and enjoy immersive 3D entertainment shows with your family.',
    image: '/mowgli-adventure.jpg',
  }
];

const AdventureParkPage = () => {
  const [slides, setSlides] = useState<AdventureSlide[]>(defaultAdventureSlides);
  const [headerTitle, setHeaderTitle] = useState("Adventure Park");
  const [headerSub, setHeaderSub] = useState(
    "Zip Line | Rope Bridges | Tyre Bridges | Burma Bridges | Obstacle Courses | Net Climbing | Commando Tower | Tree House | 3D Show | Butterfly Garden"
  );
  const [headerDesc, setHeaderDesc] = useState(
    "Challenge your balance, agility, and thrill-seeking spirit with our high rope bridges, zip line, climbing towers, and obstacle courses in the open air."
  );
  const [heroImage, setHeroImage] = useState("/mowgli-adventure.jpg");
  const [heroVideo, setHeroVideo] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: headerData } = await supabase
          .from("website_content")
          .select("content")
          .eq("section", "park_header_adventure-park")
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
          .eq("park_type", "adventure-park")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (attractionData && attractionData.length > 0) {
          setSlides(attractionData);
        }
      } catch (err) {
        console.error("Error loading adventure park content:", err);
      }
    }
    fetchData();
  }, []);

  const adventureFacilities = [
    'Certified Safety Harness & Gear Station - High-grade safety helmets, full-body harnesses, and carabiners fitted by trained instructors',
    'Diverse Obstacle Zones - Zip Line, Rope Bridges, Tyre Bridges, Burma Bridges, Obstacle Courses, Net Climbing, and Commando Towers',
    'Nature & Trekking Tracks - Guided nature trails for Satpuda Trekking, Tree House access, and Butterfly Garden entry',
    'Entertainment & Target Arenas - Specialized zones for 3D Shows and Various Shooting activities',
    'Trained Instructors & Marshals - Professional adventure marshals at every high-element tower and rope course',
    'First Aid & Hydration Stations - Drinking water and first-aid setups located near major adventure courses'
  ];

  const adventureRules = [
    'Mandatory Safety Gear: Safety harnesses and helmets must remain securely worn and clipped in at all times',
    'Proper Footwear Required: Closed-toe sports shoes or trekking shoes are mandatory (no sandals or bare feet)',
    'Follow Marshal Signals: Wait for instructor\'s explicit signal before starting any zip line, climb, or bridge obstacle',
    'Height & Weight Limits: Specific high-rope elements carry strict minimum height and maximum weight limits',
    'One Person per Element: Only one participant allowed on a single bridge section, zip line, or climbing line at a time',
    'Health & Physical Fitness: Individuals with high blood pressure, heart conditions, or pregnancy should avoid high-thrill activities'
  ];

  const adventureFaqs = [
    {
      question: 'What adventure activities are available at Shivtirth?',
      answer: 'Shivtirth Adventure Park offers Zipline, Rope Bridges, Burma Bridge, Commando Tower, obstacle activities, target shooting and Mowgli-themed adventures.'
    },
    {
      question: 'Where is the best adventure park near Nagpur?',
      answer: 'Shivtirth Adventure Park at Umri (Dam), Saoner is a major adventure destination near Nagpur.'
    },
    {
      question: 'Does Shivtirth have a zipline?',
      answer: 'Yes. Zipline is one of the key adventure activities at Shivtirth.'
    },
    {
      question: 'Is Shivtirth Adventure Park suitable for children?',
      answer: 'Some activities are suitable for children, while others may have specific age, height or safety requirements.'
    },
    {
      question: 'Can families enjoy the Adventure Park?',
      answer: 'Yes. Families can choose activities according to the age and suitability of each participant.'
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
        href={"/offers"}
        className="flex text-slate-900 fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl text-xs md:text-sm font-bold"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* Attractions Section */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#081c15] text-white">
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
                            src={slide.image || '/mowgli-adventure.jpg'}
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
                {adventureFacilities.map((facility) => (
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
                {adventureRules.map((rule) => (
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
              {adventureFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`adventure-faq-${idx}`} className="border-slate-200">
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

export default AdventureParkPage;