"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const AdventureParkPage = () => {
  const adventureSlides = [
    {
      title: 'Zip Line',
      description: 'Soar across the adventure zone and feel the rush of speed and height in one seamless ride. Designed for excitement and smooth movement, it offers a thrilling perspective from above.',
      image: '/Adventure-Park.jpg',
    },
    {
      title: 'Rope Bridges',
      description: 'Test your balance as you make your way across suspended paths set above the ground. With every step, enjoy a mix of light challenge and scenic views.',
      image: '/rope-bridges.jpg',
    },
    {
      title: 'Obstacle Courses',
      description: 'Take on a series of fun challenges that put your agility, focus, and determination to the test. Each section is designed to keep you active and engaged.',
      image: '/obstacle-bridge.jpg',
    },
    {
      title: 'Burma Bridges',
      description: 'Take on a classic outdoor challenge as you balance your way across rope-supported bridges. With guided safety and a well-designed setup, it offers an authentic adventure experience.',
      image: '/burma-bridges.jpg',
    },
    {
      title: 'Net Climbing',
      description: 'Climb secure net structures that combine physical activity and thrill for kids, youth, and adventure enthusiasts.',
      image: '/net-climbing.jpeg',
    },
    {
      title: 'Commando Tower',
      description: 'Push your limits with a multi-activity challenge designed to build confidence and courage. With guided climbing and controlled descents under expert supervision.',
      image: '/commando-tower.jpeg',
    },
    {
      title: 'Target Shooting',
      description: 'Test your focus and precision in a controlled, engaging setup designed for both fun and skill-building.',
      image: '/target-shooting.jpg',
    },
    {
      title: 'Tree House',
      description: 'A peaceful spot set amidst nature, offering elevated views and a refreshing break from the activity around. Designed as a relaxing stay point.',
      image: '/tree-house.jpg',
    },
    {
      title: '3D Show',
      description: 'Discover an immersive experience set within Mogli Park, where visuals, motion, and storytelling come together in a jungle-inspired setting.',
      image: '/3d-show.jpeg',
    },
    {
      title: 'Butterfly Garden',
      description: 'A calm, nature-filled space designed for quiet moments and gentle exploration. Surrounded by greenery and vibrant butterflies.',
      image: '/butterfly-garden.jpeg',
    },
  ];

  const [slides, setSlides] = useState(adventureSlides);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'adventure-park')
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
          <Image
            src="/mowgli-adventure.jpg"
            alt="Adventure Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-accent drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Adventure Park
              </h1>
              <p className="mt-2 text-sm text-emerald-100/90 drop-shadow-sm font-medium">
                Zip Line | Rope Bridges | Tyre Bridges | Burma Bridges | Obstacle Courses | Net Climbing | Commando Tower | Tree House | 3D Show | Butterfly Garden
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

      {/* Attractions Section - Customized Mowgli Jungle Forest Green Gradient */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#081c15] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-2xl font-bold text-white mb-2 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Adventure Park Thrills & Obstacles
            </h2>
            <p className="text-emerald-100/90 mb-8 text-sm leading-relaxed max-w-2xl">
              Unleash your inner explorer with Mowgli-inspired adventures packed with adrenaline, physical challenges, and unforgettable outdoor experiences.
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {slides.map((slide, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.15 * (idx % 2)} duration={0.5}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-emerald-400/20">
                  <div className={`order-1 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                      <Image src={slide.image} alt={slide.title} fill className="object-cover object-[50%_18%] hover:scale-105 transition duration-500" />
                    </div>
                  </div>
                  <div className={`order-2 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <h3 className="text-2xl font-bold text-white font-times mb-2" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      {slide.title}
                    </h3>
                    <p className="text-sm text-emerald-50 leading-relaxed font-normal">{slide.description}</p>
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
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-emerald-100">
              <h3 className="text-lg md:text-xl font-bold text-emerald-700 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
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
              <h3 className="text-lg md:text-xl font-bold text-emerald-700 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {adventureRules.map((rule) => (
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
          <div className="rounded-2xl bg-white/95 text-slate-900 p-5 md:p-6 shadow-lg border border-emerald-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {adventureFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`adventure-faq-${idx}`} className="border-slate-200">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-emerald-700 text-left">
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