"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const AmusementParkPage = () => {
  const amusementSlides = [
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

  const [slides, setSlides] = useState(amusementSlides);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'amusement-park')
          .eq('is_hidden', false)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (err) {
        console.error("Error loading attractions:", err);
      }
    }
    fetchAttractions();
  }, []);

  const amusementFacilities = [
    'Thrilling & Family Mechanical Rides - Tora Tora Ride, Break Dance Ride, Columbus Ride, and Round Up Ride',
    'Kid-Friendly Play Zones & Swings - Dedicated play zone areas and traditional swings designed safely for younger children',
    'Mowgli Jungle Safari & Animal/Bird Exhibits - Guided safari zones and interaction points featuring animals and birds',
    'Oxygen Park & Scenic Walkways - Lush green gardens, fresh-air walking zones, and serene nature spots',
    'Selfie Points & Photo Spots - Specifically designed decorative backdrops and scenic locations for group photos',
    'Ride Operators & Marshals - Trained staff stationed at every mechanical ride for seating and safety support'
  ];

  const amusementRules = [
    'Secure Lap Bars & Seatbelts: All safety bars, harnesses, and seatbelts must remain fully fastened until rides come to a complete stop',
    'Height & Age Restrictions: Access to high-motion rides (Tora Tora, Break Dance, Round Up, Columbus) is subject to posted limits',
    'Remain Seated During Rides: Standing, leaning out, or swinging arms outside ride cars while in motion is strictly prohibited',
    'Health Warnings: Guests with motion sickness, heart conditions, back issues, or high blood pressure should avoid high-spinning rides',
    'Respect Animals & Nature: Do not feed, tease, or disturb animals and birds in Mowgli Jungle Safari or damage plants',
    'Child Supervision: Children must be supervised by guardians or adults at all times while in play zones and safari areas'
  ];

  const amusementFaqs = [
    {
      question: 'What rides are available at Shivtirth Amusement Park?',
      answer: 'Shivtirth Amusement Park features Tora Tora, Columbus, High Swing, Round Swing, Jumper Ride, Kids Play Zone and shooting games.'
    },
    {
      question: 'Is Shivtirth Amusement Park suitable for children?',
      answer: 'Yes. The park includes a dedicated Kids Play Zone and other attractions suitable for children depending on individual ride restrictions.'
    },
    {
      question: 'Are there height or age restrictions for amusement rides?',
      answer: 'Yes. Some rides may have age, height or safety restrictions, and visitors should follow the instructions displayed for each attraction.'
    },
    {
      question: 'Can I enjoy amusement rides along with the water park?',
      answer: 'Yes, depending on the ticket or package selected and the attractions operating on the day of your visit.'
    },
    {
      question: 'Is the Amusement Park good for a family picnic near Nagpur?',
      answer: 'Yes. Shivtirth combines amusement rides with water, boating, adventure and other experiences for an excellent family day out.'
    }
  ];

  return (
    <main id="about-park" className="bg-gradient-to-b from-[#fff95b] via-amber-800 to-[#FFBF00] text-slate-100">
      <div className="relative">
        <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
          <Image
            src="/amusement.jpg"
            alt="Amusement Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950 via-orange-500/10 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-accent drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Amusement Park
              </h1>
              <p className="mt-2 text-sm text-amber-100/90 drop-shadow-sm font-medium">
                Tora Tora Ride | Break Dance Ride | Columbus Ride | Round Up Ride | Swings | Play Zone | Jumper | Selfie Points
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

      {/* Attractions Section - Customized Carnival Warm Gold Gradient */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#ff930f] via-[#fbcf00] to-[#fff95b] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-2xl font-bold text-white mb-2 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Amusement Park Rides & Entertainment
            </h2>
            <p className="text-amber-100/90 mb-8 text-sm leading-relaxed max-w-2xl">
              Discover a range of rides and entertainment experiences across the amusement zone, each designed to keep the atmosphere lively and enjoyable.
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {slides.map((slide, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.15 * (idx % 2)} duration={0.5}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-amber-400/20">
                  <div className={`order-1 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className={`object-cover ${idx === 0 ? 'object-bottom' : ''} ${idx === 1 ? 'object-[50%_28%]' : ''} hover:scale-105 transition duration-500`}
                      />
                    </div>
                  </div>
                  <div className={`order-2 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h3 className="text-2xl font-bold text-white font-times mb-2" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      {slide.title}
                    </h3>
                    <p className="text-sm text-amber-50 leading-relaxed font-normal">{slide.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities & Rules */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-amber-100">
              <h3 className="text-lg md:text-xl font-bold text-amber-700 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Facilities
              </h3>
              <ul className="space-y-2.5">
                {amusementFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-amber-100">
              <h3 className="text-lg md:text-xl font-bold text-amber-700 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {amusementRules.map((rule) => (
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
      <section className="mx-auto max-w-6xl px-4 py-6 pb-10">
        <ScrollReveal direction="up" delay={0.25}>
          <div className="rounded-2xl bg-white/95 text-slate-900 p-5 md:p-6 shadow-lg border border-amber-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {amusementFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`amusement-faq-${idx}`} className="border-slate-200">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-amber-700 text-left">
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