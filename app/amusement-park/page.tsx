"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import OfferSection from '@/components/OfferSection'
import { Clock, Users, Shield } from 'lucide-react'
import { getWhatsAppBookingHref } from '@/lib/whatsapp'
import { supabase } from '@/lib/supabase'

const AmusementParkPage = () => {
  const amusementSlides = [
    {
      title: 'Tora Tora Ride',
      description: 'Feel the rush of fast spins and continuous motion as the ride swings and rotates in sync. Built for high-energy fun, it delivers a lively, action-packed experience that keeps the excitement going from start to finish.',
      image: '/tora-tora.jpeg',
    },
    {
      title: 'Columbus Ride',
      description: 'Feel the thrill as the giant ship swings higher with every motion, building excitement and anticipation. It is a perfect blend of rush and fun, delivering a classic ride experience that keeps everyone engaged till the very end.',
      image: '/columbus-ride.jpeg',
    },
    {
      title: 'High Swing',
      description: 'Rise above the ground and feel the thrill as the swing lifts you higher with every motion. Designed to deliver a mix of height, movement, and excitement, it offers a refreshing ride experience with a touch of adventure.',
      image: '/high-swing.png',
    },
    {
      title: 'Round Swing',
      description: 'Enjoy a smooth, circular ride that brings together gentle spins and a cheerful atmosphere. With its colorful setup and easygoing motion, it is a fun and relaxing experience for all ages.',
      image: '/round-swing.jpg',
    },
    {
      title: 'Jumper Ride',
      description: 'Feel the excitement of quick lifts and rhythmic motion as the ride keeps you moving with energy and fun. Designed for those who enjoy lively, fast-paced experiences, it delivers a playful thrill from start to finish.',
      image: '/jumper-ride.jpg',
    },
    {
      title: 'Kids Play Zone',
      description: 'A thoughtfully designed space where children can play, explore, and enjoy with ease. With safe mini rides and engaging activities, it offers a fun-filled environment that keeps young guests happily entertained.',
      image: '/kids-play-zone.png',
    }
  ]

  const [slides, setSlides] = useState(amusementSlides)

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'amusement-park')
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
    {
      category: 'Rules & Regulations',
      rules: [
        'Follow ride safety instructions',
        'Height and age limits apply',
      ],
    },
  ]

  const timings = [
    { day: 'Timings', time: '04:00 PM to 06:00 PM' },
  ]

  const amusementFacilities = [
    { icon: '🎢', title: 'Family rides', description: 'Fun rides designed for families to enjoy together.' },
    { icon: '🪑', title: 'Seating areas', description: 'Comfortable spaces to relax between rides.' },
  ]

  return (
    <main id="about-park" className="bg-slate-50">
      <div className="relative">
        <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
          <Image
            src="/amusement.jpg"
            alt="Amusement Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-3xl md:text-5xl font-black text-yellow-400 drop-shadow-lg">Amusement Park</h1>
              <p className="mt-3 text-sm text-white/90 drop-shadow-sm">
                Tora Tora Ride | Break Dance Ride | Colombus Ride | Round Up Ride | Swings | Play Zone | Jumper | Bird Park | Selfie Points | Oxygen Park | Various Sawari Rides | Cultural Dance | Karaoke Singing | Night Stay Activities | And Many More...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <section className="relative z-10 max-w-6xl mx-auto px-4 -mt-10 md:-mt-16 pb-10">
        <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 grid grid-cols-3 gap-3 md:gap-8 text-center border border-slate-100">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl mb-2">🎢</span>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Rides</h3>
            <p className="text-base md:text-xl font-bold text-slate-800 mt-1">6+ Family Rides</p>
          </div>
          <div className="flex flex-col items-center border-x border-slate-100">
            <span className="text-3xl md:text-5xl mb-2">🎈</span>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Theme</h3>
            <p className="text-base md:text-xl font-bold text-slate-800 mt-1">Pure Amusement</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl mb-2">🛟</span>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Safety</h3>
            <p className="text-base md:text-xl font-bold text-slate-800 mt-1">Tested Equipment</p>
          </div>
        </div>
      </section> */}

      {/* Sticky Book Now Button */}
      <InteractiveHoverButton
        href={"/offers"}
        className="flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center z-20 px-8 py-3"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* <section className="py-10 md:py-12 bg-slate-50">
        <OfferSection />
      </section> */}

      <section className="py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Some Activities</h2>
          <p className="text-gray-600 mb-8 md:mb-10 text-sm leading-snug max-w-3xl">Discover a range of rides and entertainment experiences across the amusement zone, each designed to keep the atmosphere lively and enjoyable for everyone.</p>
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
                        className={`object-cover ${idx === 0 ? 'object-bottom' : ''} ${idx === 1 ? 'object-[50%_28%]' : ''} hover:scale-105 transition duration-300`}
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

      <section className="py-10 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black">Facilities</h2>
          <p className="text-gray-600 mb-6 text-sm leading-snug">Enjoy premium amenities during your visit</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {amusementFacilities.map((facility, idx) => (
              <div key={idx} className="bg-white p-6 md:p-7 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="text-4xl mb-3">{facility.icon}</div>
                <h3 className="text-lg font-bold">{facility.title}</h3>
                <p className="text-sm text-gray-600">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rules-regulations" className="py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black">Rules & Regulations</h2>
          <p className="text-gray-600 mb-6 text-sm leading-snug">Please follow these guidelines for a safe and enjoyable experience</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {rulesRegulations.map((section, idx) => (
              <div key={idx} className="bg-slate-50 p-6 md:p-8 rounded-2xl border-2 border-slate-200">
                {/* <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-slate-900">{section.category}</h3> */}
                <ul className="space-y-2.5 md:space-y-3">
                  {section.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-3">
                      <span className="text-slate-900 font-bold text-sm shrink-0">✓</span>
                      <span className="text-sm">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section className="bg-white py-10 md:py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Best Visit Time</h3>
                <p className="text-gray-600">Visit in evening slots for best ride lights and energy.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Group Packages</h3>
                <p className="text-gray-600">Special packages for birthday groups, schools, and team outings.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Safety First</h3>
                <p className="text-gray-600">Trained ride operators and checks ensure a safe experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

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

export default AmusementParkPage