"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BadgeCheck, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ScrollReveal, ScrollStaggerItem } from '@/components/ui/ScrollReveal';

const WaterParkPage = () => {
  const waterParkSlides = [
    {
      title: "Various Water Pools",
      description: "Multiple spacious splash pools designed safely for all age groups, from primary school kids to high school students.",
      image: "/adishakti-waterfall.jpg",
    },
    {
      title: "Exciting Water Slides",
      description: "A wide collection of high-thrill slides and gentle water slides built for endless fun and adventure.",
      image: "/adishakti-waterfall.jpg",
    },
    {
      title: "Adishakti Waterfall",
      description: "Scenic waterfall setup over natural rock-like structures offering a cool, refreshing dip.",
      image: "/adishakti-waterfall.jpg",
    },
    {
      title: "Multiplay Station",
      description: "Interactive aquatic play towers featuring mini slides, sprayers, and climbing platforms.",
      image: "/thrill-slides.jpeg",
    },
    {
      title: "Giant Splash Buckets",
      description: "Massive overhead tipping buckets that pour down gallons of water at regular intervals.",
      image: "/splash-bucket.jpeg",
    },
    {
      title: "Rain Dance",
      description: "High-energy rain dance zones accompanied by live DJ music systems for total group entertainment.",
      image: "/rain-dance.jpeg",
    },
    {
      title: "Foam Dance Party",
      description: "Open-air dance pool covered in soft, light foam for high-spirited group celebrations.",
      image: "/foam-dance.jpg",
    },
    {
      title: "Rappelling (Upcoming)",
      description: "Controlled adventure rappelling right along the waterfall for high-adrenaline thrill seekers.",
      image: "/rappelling.png",
    },
    {
      title: "Glass Floor Dance",
      description: "A uniquely designed elevated glass-floored dance platform surrounded by water features.",
      image: "/rappelling.png",
    },
    {
      title: "Laser Light & Fog Dance",
      description: "Immersive ambient light and fog effects paired with music to create an electric party atmosphere.",
      image: "/rappelling.png",
    },
    {
      title: "Bubble Dance Zone",
      description: "Fun-filled bubble machines continuously creating visual splash zones while students dance.",
      image: "/rappelling.png",
    }
  ];

  const [slides, setSlides] = useState(waterParkSlides);

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'water-park')
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

  const waterParkFacilities = [
    'Clean Changing Rooms - Separate shower facilities for male and female guests',
    'Locker Storage - Secure locker rentals for valuables and personal items',
    'Swimwear Rental - Nylon/lycra swimsuits available for rent or purchase',
    'First Aid Station - Fully equipped medical setup with trained personnel',
    'Safety Gear - Free life jackets and flotation devices for non-swimmers and kids',
    'Shaded Seating & Dining - Poolside seating, rest areas, and hygienic food counters'
  ];

  const waterParkRules = [
    'Swimwear Mandatory: Only 100% nylon or lycra swimwear allowed (no cotton, jeans, or zippers)',
    'Follow Staff Instructions: Obey all lifeguard instructions and ride posture guidelines',
    'No Running or Rough Play: Running on slippery decks and pushing near edges is prohibited',
    'Child Supervision: Children under 12 must be accompanied by an adult in all pool areas',
    'Shower First: Guests must rinse before entering any pool or water attraction',
    'No Outside Food or Glass: Outside food, alcoholic drinks, and glass objects are banned'
  ];

  const waterParkFaqs = [
    {
      question: 'What is the best water park near Nagpur?',
      answer: 'Shivtirth Best Water Park is a popular water park near Nagpur, located at Umari (Dam), Saoner, Nagpur, Maharashtra.'
    },
    {
      question: 'What attractions are available at Shivtirth Water Park?',
      answer: 'Shivtirth offers water slides, pools, Adishakti Waterfall, splash bucket, rain dance, foam dance, DJ entertainment and other water-based attractions.'
    },
    {
      question: 'Is Shivtirth Water Park suitable for families?',
      answer: 'Yes. It is designed as a family-friendly destination with water attractions and multiple entertainment experiences for children and adults.'
    },
    {
      question: 'Does Shivtirth have a rain dance and foam party?',
      answer: 'Yes, Shivtirth features rain dance and foam dance experiences as part of its water park entertainment.'
    },
    {
      question: 'Is Shivtirth Water Park good for a one-day picnic?',
      answer: 'Yes. With water park, boating, adventure and amusement attractions, Shivtirth is designed for a complete day-out and picnic experience.'
    }
  ];

  return (
    <main id="about-park" className="bg-gradient-to-b from-cyan-900 via-slate-900 to-cyan-950 text-slate-100">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
          <Image
            src="/Water-Park.jpg"
            alt="Water Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-cyan-950/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-4xl font-bold text-amber-400 drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Water Park
              </h1>
              <p className="mt-2 text-sm text-cyan-100/90 drop-shadow-sm font-medium">
                Various Water Pools | Waterfall | Family Slides | Body & Tube Slides | Multiplay Station | Various Rain Dances | Splash Buckets | Foam Dance | Glass Floor Dance | Fog & Bubble Dance
              </p>
            </div>
          </div>
        </div>
      </div>

      <InteractiveHoverButton
        href={'/offers'}
        className='text-slate-900 flex fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl text-xs md:text-sm font-bold'
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* Attractions Section - Customized Water Cyan Gradient */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#004e64] via-[#00a5cf] to-[#003440] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-2xl font-bold text-white mb-2 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Water Park Attractions & Rides
            </h2>
            <p className="text-cyan-100/90 mb-8 text-sm leading-relaxed max-w-2xl">
              Explore experiences crafted for every mood, from calm relaxing pools to high-energy slides designed for safety, comfort, and unforgettable memories.
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {slides.map((slide, idx) => (
              <ScrollReveal key={idx} direction="up" delay={0.15 * (idx % 2)} duration={0.5}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-cyan-400/20">
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
                    <h3 className="text-2xl font-bold text-amber-300 font-times mb-2" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      {slide.title}
                    </h3>
                    <p className="text-sm text-cyan-50 leading-relaxed font-normal">{slide.description}</p>
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
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-cyan-100">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Facilities
              </h3>
              <ul className="space-y-2.5">
                {waterParkFacilities.map((facility) => (
                  <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>
                    <span>{facility}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-cyan-100">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                Rules & Regulations
              </h3>
              <ul className="space-y-2.5">
                {waterParkRules.map((rule) => (
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
          <div className="rounded-2xl bg-white/95 text-slate-900 p-5 md:p-6 shadow-lg border border-cyan-100">
            <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {waterParkFaqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`water-faq-${idx}`} className="border-slate-200">
                  <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-cyan-600 text-left">
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

export default WaterParkPage;