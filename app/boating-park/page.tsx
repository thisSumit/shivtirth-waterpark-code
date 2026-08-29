"use client";

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import OfferSection from '@/components/OfferSection'
import { Clock, Users, Shield } from 'lucide-react'
import { getWhatsAppBookingHref } from '@/lib/whatsapp'
import { supabase } from '@/lib/supabase'

const BoatingParkPage = () => {
  const boatingSlides = [
    {
      title: 'Banana Boat',
      description: 'Gather your group and get ready for a ride full of energy and excitement. As the banana boat speeds across the water, every turn brings laughter, splashes, and moments you will want to relive. It is the perfect mix of thrill and togetherness-made for unforgettable group fun.',
      image: '/Boating-Park.jpg',
    },
    {
      title: 'Speed Boat',
      description: 'Experience pure adrenaline as you race across the water with powerful speed and sharp turns. Designed for thrill seekers, this ride delivers high-energy moments, exciting splashes, and a rush you will feel long after it ends.',
      image: '/speed-boat.jpg',
    },
    {
      title: 'Shikara Ride',
      description: 'Unwind with a calm and scenic ride that lets you slow down and take in the beauty around you. Gliding gently over the water, this peaceful experience offers a refreshing escape-perfect for relaxing moments with your loved ones.',
      image: '/shikara-boat.jpg',
    },
    {
      title: 'Dragon Boat',
      description: 'Step into a visually striking ride that brings together group fun and a unique on-water experience. As the boat moves across the water, enjoy the lively atmosphere, shared excitement, and a ride that is as engaging as it is memorable.',
      image: '/dragon-boat.jpg',
    },
    {
      title: 'Sofa Boat',
      description: 'Settle in for a smooth and comfortable ride as you glide across the water at a relaxed pace. Ideal for those who prefer a gentle, enjoyable experience, it is the perfect way to unwind while still being part of the fun.',
      image: '/sofa-boat.jpg',
    },
    {
      title: 'Train Boat',
      description: 'A favorite for families and groups, this connected ride brings a playful twist to your time on the water. As it moves smoothly across the lake, enjoy the fun of riding together, with gentle excitement and plenty of shared moments along the way.',
      image: '/train-boat.jpg',
    },
    {
      title: 'Octopus Ride',
      description: 'Step into a high-energy ride where motion, water, and excitement come together. With spinning movements and unexpected twists, every moment feels lively and engaging-perfect for those who enjoy a fun, action-packed experience.',
      image: '/octopus-boat.jpg',
    },
    {
      title: 'Disco Boat',
      description: 'Step into a ride filled with rhythm, movement, and energy. As the boat sways and spins, enjoy a lively atmosphere that blends music, fun, and water excitement-creating an experience that feels like a celebration on the water.',
      image: '/disco-boat.jpg',
    },
    {
      title: 'Zorbing Ball',
      description: 'Step inside a giant transparent ball and experience the fun of walking and rolling on water like never before. Safe, playful, and completely unique, it is an activity that brings laughter, balance, and unforgettable moments for all ages.',
      image: '/zorbing-ball.jpg',
    },
    {
      title: 'Kayak Boat',
      description: 'Enjoy a peaceful and scenic ride that lets you connect with nature. As you paddle gently across the water, take in the beauty around you and find a moment of calm in the midst of your adventure.',
      image: '/Boating-Park.jpg',
    },
    {
      title: 'Pedal Boat',
      description: 'Get a fun workout while enjoying the water with a pedal boat ride. Perfect for families and friends, it offers a leisurely pace that lets you take in the surroundings while still being part of the fun.',
      image: '/Boating-Park.jpg',
    },
  ]

  const [slides, setSlides] = useState(boatingSlides)

  useEffect(() => {
    async function fetchAttractions() {
      try {
        const { data } = await supabase
          .from('attractions')
          .select('title, description, image')
          .eq('park_type', 'boating-park')
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

  const facilities = [
    { icon: '🦺', title: 'Safety gear', description: 'Life jackets and essential equipment are provided for all rides.' },
    { icon: '👨‍✈️', title: 'Guided rides', description: 'Trained staff help guide every boating experience safely.' },
    { icon: '🛶', title: 'Multiple boat options', description: 'Choose from a variety of boats for family fun or adventure.' },
  ]

  const rulesRegulations = [
    {
      category: 'Rules & Regulations',
      rules: [
        'Life jackets compulsory',
        'Follow staff instructions',
        'Weight limits apply',
      ],
    },
  ]

  const timings = [
    { day: 'Timings', time: '10:00 AM to 02:00 PM' },
  ]

  const boatingFacilities = [
    { icon: '🦺', title: 'Safety gear', description: 'Life jackets and essential equipment are provided for all rides.' },
    { icon: '👨‍✈️', title: 'Guided rides', description: 'Trained staff help guide every boating experience safely.' },
    { icon: '🛶', title: 'Multiple boat options', description: 'Choose from a variety of boats for family fun or adventure.' },
  ]

  return (
    <main id="about-park" className="bg-slate-50">
      <div className="relative">
        <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
          <Image
            src="/Boating-Park.jpg"
            alt="Boating Park"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-3xl md:text-5xl font-black text-yellow-400 drop-shadow-lg">Boating Park</h1>
              <p className="mt-3 text-sm text-white/90 drop-shadow-sm">
                Banana Boat | Sofa Boat | Speed Boat | Shikara Boat | Train Boat | Dragon Boat | Disco Boat | Octopus Boat | Kayak Boat | Pedal Boat | Rowing Boat | Boat House | And Many More…
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* <section className="relative z-10 max-w-6xl mx-auto px-4 -mt-10 md:-mt-16 pb-10">
        <div className="bg-white rounded-3xl shadow-xl p-5 md:p-8 grid grid-cols-3 gap-3 md:gap-8 text-center border border-slate-100">
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl mb-2">🚤</span>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Boats</h3>
            <p className="text-base md:text-xl font-bold text-slate-800 mt-1">7+ Ride Types</p>
          </div>
          <div className="flex flex-col items-center border-x border-slate-100">
            <span className="text-3xl md:text-5xl mb-2">🌊</span>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Vibe</h3>
            <p className="text-base md:text-xl font-bold text-slate-800 mt-1">Lake Adventure</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl mb-2">🛟</span>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider text-slate-500">Safety</h3>
            <p className="text-base md:text-xl font-bold text-slate-800 mt-1">Life Jacket Mandatory</p>
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
          <p className="text-gray-600 mb-8 md:mb-10 text-sm leading-snug max-w-3xl">Step beyond the ordinary and discover experiences built for action and excitement. Designed for those who enjoy energy, movement, and outdoor fun-each attraction offers something engaging, active, and memorable.</p>

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

      <section className="py-10 md:py-12 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black">Facilities</h2>
          <p className="text-gray-600 mb-6 text-sm leading-snug">Enjoy premium amenities during your visit</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {boatingFacilities.map((facility, idx) => (
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
                <p className="text-gray-600">Visit during morning slots for calm rides and evenings for lively vibes.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Users className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Group Packages</h3>
                <p className="text-gray-600">Special group packages available for schools, colleges, and families.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-slate-800 shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-base md:text-lg mb-2">Safety First</h3>
                <p className="text-gray-600">All rides are supervised by trained staff and safety marshals.</p>
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

export default BoatingParkPage
