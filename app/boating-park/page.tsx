"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const BoatingParkPage = () => {
  const boatingSlides = [
    {
      title: 'Banana Boat',
      description: 'Gather your group and get ready for a ride full of energy and excitement. As the banana boat speeds across the water, every turn brings laughter, splashes, and moments you will want to relive.',
      image: '/Boating-Park.jpg',
    },
    {
      title: 'Speed Boat',
      description: 'Experience pure adrenaline as you race across the water with powerful speed and sharp turns. Designed for thrill seekers, this ride delivers high-energy moments and exciting splashes.',
      image: '/speed-boat.jpg',
    },
    {
      title: 'Shikara Ride',
      description: 'Unwind with a calm and scenic ride that lets you slow down and take in the beauty around you. Gliding gently over the water, this peaceful experience offers a refreshing escape.',
      image: '/shikara-boat.jpg',
    },
    {
      title: 'Dragon Boat',
      description: 'Step into a visually striking ride that brings together group fun and a unique on-water experience as the boat moves across the water in lively unison.',
      image: '/dragon-boat.jpg',
    },
    {
      title: 'Sofa Boat',
      description: 'Settle in for a smooth and comfortable ride as you glide across the water at a relaxed pace. Ideal for those who prefer a gentle, enjoyable experience.',
      image: '/sofa-boat.jpg',
    },
    {
      title: 'Train Boat',
      description: 'A favorite for families and groups, this connected ride brings a playful twist to your time on the water, with gentle excitement along the way.',
      image: '/train-boat.jpg',
    },
    {
      title: 'Octopus Ride',
      description: 'Step into a high-energy ride where motion, water, and excitement come together with spinning movements and unexpected twists.',
      image: '/octopus-boat.jpg',
    },
    {
      title: 'Disco Boat',
      description: 'Step into a ride filled with rhythm, movement, and energy. As the boat sways and spins, enjoy a lively celebration atmosphere on the water.',
      image: '/disco-boat.jpg',
    },
    {
      title: 'Zorbing Ball',
      description: 'Step inside a giant transparent ball and experience the fun of walking and rolling on water like never before in a safe and playful ball.',
      image: '/zorbing-ball.jpg',
    },
    {
      title: 'Kayak Boat',
      description: 'Enjoy a peaceful and scenic ride that lets you connect with nature as you paddle gently across the water.',
      image: '/Boating-Park.jpg',
    },
    {
      title: 'Pedal Boat',
      description: 'Get a fun workout while enjoying the water at your own pace, perfect for families and friends.',
      image: '/Boating-Park.jpg',
    },
  ];

  const [slides, setSlides] = useState(boatingSlides);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'boating-park')
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

  const boatingFacilities = [
    'Diverse Boat Fleet - Banana Boat, Sofa Boat, Speed Boat, Shikara Boat, Train Boat, Dragon Boat, Disco Boat, Octopus Boat, Kayak, and Pedal Boats',
    'Safety Gear Station - Free life jacket sizing, fitting, and safety check before boarding',
    'Boarding Docks - Non-slip, secured floating jetties and boarding ramps with staff assistance',
    'Shaded Waiting Lounge - Covered seating area near the lake dock for waiting visitors and groups',
    'Trained Rescue Boat & Guards - Certified rescue boat operators and lifeguards on water for instant support'
  ];

  const boatingRules = [
    'Life Jackets Mandatory: Every passenger must wear a securely fastened life jacket throughout the ride',
    'Strict Weight & Seating Limits: Never exceed maximum passenger capacity marked for each boat type',
    'Remain Seated: Standing, rocking, jumping, or switching seats while boat is in motion is prohibited',
    'Follow Operator Instructions: Obey the boat captain or dock attendant\'s signals at all times',
    'Child Supervision: Children under 12 years must be accompanied by an adult or teacher',
    'No Littering or Items in Water: Throwing trash, phones, cameras, or belongings into water is forbidden'
  ];

  const boatingFaqs = [
    {
      question: 'Where can I go boating near Nagpur?',
      answer: 'Shivtirth Boating Park near Umri Dam, Saoner, offers multiple boating and water experiences near Nagpur.'
    },
    {
      question: 'What types of boating are available at Shivtirth?',
      answer: 'Visitors can enjoy Banana Boat, Speed Boat, Disco Boat, Dragon Boat, Sofa Boat, Train Boat, Octopus Ride, Shikara Ride, and Kayaking.'
    },
    {
      question: 'Is Shivtirth Boating Park suitable for families?',
      answer: 'Yes. Shivtirth offers several boating experiences suitable for families and groups, subject to individual ride safety requirements.'
    },
    {
      question: 'Can I enjoy boating and the water park on the same visit?',
      answer: 'Yes. Shivtirth is designed as a multi-experience destination where visitors can combine boating with other park attractions.'
    },
    {
      question: 'What is the best boating experience at Shivtirth?',
      answer: 'Speed Boat is ideal for thrill seekers, while Shikara and group rides are suitable for a more relaxed experience.'
    }
  ];

  return (
    <main id="about-park" className="bg-gradient-to-b from-teal-950 via-slate-900 to-teal-950 text-slate-100">
      <div className="relative">
        <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
          <Image
            src="/Boating-Park.jpg"
            alt="Boating Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-teal-950/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-amber-400 drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Boating Park
              </h1>
              <p className="mt-2 text-xs md:text-sm text-teal-100/90 drop-shadow-sm font-medium">
                Banana Boat | Sofa Boat | Speed Boat | Shikara Boat | Train Boat | Dragon Boat | Disco Boat | Octopus Boat | Kayak Boat | Pedal Boat
              </p>
            </div>
          </div>
        </div>
      </div>

      <InteractiveHoverButton
        href={"/offers"}
        className="flex fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl text-xs md:text-sm font-bold"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* Attractions Section - Customized Lake Teal Gradient */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#004e57] via-[#006d77] to-[#002e34] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Boating Park Activities
            </h2>
            <p className="text-teal-100/90 mb-8 text-xs md:text-sm leading-relaxed max-w-2xl">
              Step beyond the ordinary and discover boating experiences built for excitement and scenic relaxation on the water.
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {slides.map((slide, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.15 * (idx % 2)} duration={0.5}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-teal-400/20">
                  <div className={`order-1 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover object-[50%_18%] hover:scale-105 transition duration-500"
                      />
                    </div>
                  </div>
                  <div className={`order-2 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h3 className="text-lg md:text-xl font-bold text-amber-300 font-times mb-2" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      {slide.title}
                    </h3>
                    <p className="text-xs md:text-sm text-teal-50 leading-relaxed font-normal">{slide.description}</p>
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
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-teal-100">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Facilities
              </h3>
              <ul className="space-y-2.5">
                {boatingFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-teal-100 text-teal-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-teal-100">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {boatingRules.map((rule) => (
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
          <div className="rounded-2xl bg-white/95 text-slate-900 p-5 md:p-6 shadow-lg border border-teal-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {boatingFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`boating-faq-${idx}`} className="border-slate-200">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-teal-600 text-left">
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

export default BoatingParkPage;
