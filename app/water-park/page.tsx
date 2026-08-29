"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import OfferSection from '@/components/OfferSection'
import { Clock, Users, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  ]

  const [slides, setSlides] = useState(waterParkSlides)

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'water-park')
          .eq('is_hidden', false)
          .order('display_order', { ascending: true })
        if (data && data.length > 0) {
          setSlides(data)
        }
      } catch (err) {
        console.error("Error loading attractions:", err)
      }
    }
    fetchAttractions()
  }, [])

  const rulesRegulations = [
    // {
    //   category: "Water Park Facilities",
    //   rules: [
    //     "Clean Changing Rooms: Separate shower facilities and changing cubicles for male and female guests.",
    //     "Locker Storage: Secure locker rentals to store personal items and valuables safely.",
    //     "Swimwear Rental: Nylon/lycra swimsuits and gear available for rent or purchase.",
    //     "First Aid Station: Fully equipped medical setup with trained personnel for immediate aid.",
    //     "Safety Gear: Free access to life jackets and flotation devices for non-swimmers and kids.",
    //     "Shaded Seating & Dining: Poolside seating, shaded rest areas, and hygienic food counters."
    //   ]
    // },
    {
      category: "Rules & Regulations",
      rules: [
        "Swimwear Mandatory: Only 100% nylon or lycra swimwear allowed on slides and in pools (no cotton, jeans, or zippers).",
        "Follow Staff Instructions: Obey all lifeguard instructions and ride posture guidelines at all times.",
        "No Running or Rough Play: Running on slippery decks and pushing near pool edges is strictly prohibited.",
        "Child Supervision: Children under 12 must be accompanied by an adult in all pool areas.",
        "Shower First: Guests must take a rinse shower before entering any pool or water attraction.",
        "No Outside Food or Glass: Outside food, alcoholic drinks, and glass objects are strictly banned inside the park."
      ]
    }
  ]

  const waterParkFacilities = [
    {
      icon: '🚿',
      title: "Clean Changing Rooms",
      description: "Separate shower and changing spaces for male and female guests."
    },
    {
      icon: '🔒',
      title: "Locker Storage",
      description: "Secure rental lockers to keep personal items and valuables safe."
    },
    {
      icon: '🩱',
      title: "Swimwear Rental",
      description: "Nylon and lycra swimsuits and gear available for rent or purchase."
    },
    {
      icon: '🩺',
      title: "First Aid Station",
      description: "Medical support and trained staff available for immediate assistance."
    },
    {
      icon: '🛟',
      title: "Safety Gear",
      description: "Life jackets and flotation devices provided for kids and non-swimmers."
    },
    {
      icon: '🪑',
      title: "Shaded Seating",
      description: "Comfortable rest areas and hygienic dining spaces near the pools."
    }
  ]

  return (
    <main id="about-park" className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
          <Image
            src="/Water-Park.jpg"
            alt="Water Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-3xl md:text-5xl font-black text-yellow-400 drop-shadow-lg">Water Park</h1>
              <p className="mt-3 text-sm text-white/90 drop-shadow-sm">
                Various Water Pools | Waterfall | Family Slides | Body & Tube Slides | Multiplay Station | Various Rain Dances | Splash Buckets | Foam Dance | Glass Floor Dance | Laser Light Dance | Fog & Bubble Dance | Strong DJ Setup | And Many More...
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <section className="relative z-10 max-w-6xl mx-auto px-4 -mt-10 md:-mt-16 pb-10">
          <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 grid grid-cols-3 gap-3 md:gap-8 text-center border border-slate-100">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl mb-2">🌊</span>
              <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Water Pools</h3>
              <p className="text-base md:text-xl font-bold text-slate-800 mt-1">8 Splash Pools</p>
            </div>
            <div className="flex flex-col items-center border-x border-slate-100">
              <span className="text-3xl md:text-5xl mb-2">💧</span>
              <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Waterfall</h3>
              <p className="text-base md:text-xl font-bold text-slate-800 mt-1">Adishakti Waterfall</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl mb-2">🛟</span>
              <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Safety</h3>
              <p className="text-base md:text-xl font-bold text-slate-800 mt-1">Lifeguards Present</p>
            </div>
          </div>
        </section> */}
      </div>

      <InteractiveHoverButton
        href={'/offers'}
        className='flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center z-20 px-8 py-3'
      >
        BOOK NOW
      </InteractiveHoverButton>
      

      {/* <section className="py-10 md:py-12 bg-slate-50">
        <OfferSection />
      </section> */}

      {/* Attractions Section */}
      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Some Activities</h2>
          <p className="text-gray-600 mb-8 md:mb-10 text-sm leading-snug max-w-3xl">Explore experiences crafted for every kind of mood, from calm, relaxing pools to exciting, high-energy slides. Every attraction is designed to deliver the perfect balance of fun, comfort, and memorable moments.</p>

          <div className="space-y-10 md:space-y-12">
            {slides.map((slide, idx) => (
              <div key={idx} className="space-y-3 md:space-y-4">
                <h3 className="text-2xl md:text-3xl font-black">{slide.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-10 items-center">
                  <div className={`order-1 ${idx % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover object-[50%_18%] hover:scale-105 transition duration-300"
                      />
                    </div>
                  </div>
                  <div className={`order-2 ${idx % 2 === 1 ? 'md:order-1' : ''}`}>
                    <p className="text-sm text-gray-700 leading-snug">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-10 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black">Water Park Facilities</h2>
          <p className="text-gray-600 mb-6 text-sm leading-snug">Everything you need for a comfortable, secure, and enjoyable visit</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {waterParkFacilities.map((facility, idx) => (
              <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-3">{facility.icon}</div>
                <h3 className="text-lg font-bold">{facility.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules & Regulations Section */}
      <section id="rules-regulations" className="py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black">Rules & Regulations</h2>
          <p className="text-gray-600 mb-6 text-sm leading-snug">Please follow these guidelines for a safe and enjoyable experience</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {rulesRegulations.map((section, idx) => (
              <div key={idx} className="bg-slate-50 p-6 md:p-8 rounded-2xl border-2 border-slate-200">
                {/* <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-900">{section.category}</h3> */}
                <ul className="space-y-2.5 md:space-y-3">
                  {section.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-3">
                      <span className="text-slate-900 font-bold text-sm shrink-0">✓</span>
                      <span className="text-sm leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      {/* <section className="bg-white py-10 md:py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Best Visit Time</h3>
                <p className="text-gray-600">Visit during weekdays for fewer crowds or weekends for full festive atmosphere</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Group Packages</h3>
                <p className="text-gray-600">Special rates available for groups of 20+ people. Call for customized packages</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Safety First</h3>
                <p className="text-gray-600">Expert lifeguards and modern safety equipment at every attraction</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Timings Section */}
      {/* <section id="timings" className="py-10 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Operating Hours</h2>
          <p className="text-gray-600 mb-8 text-base md:text-lg leading-snug">Plan your visit according to our timings</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {timings.map((timing, idx) => (
              <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-lg border-l-4 border-accent">
                <h3 className="font-bold text-base md:text-lg mb-2">{timing.day}</h3>
                <p className="text-xl md:text-2xl text-slate-900 font-bold">{timing.time}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

    </main>
  )
}

export default WaterParkPage