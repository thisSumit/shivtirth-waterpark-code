"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TextAnimate } from './ui/text-animate';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { supabase } from '@/lib/supabase';
import { ChevronDown, Sparkles } from 'lucide-react';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title1: "Shivtirth",
    title2: "Best Water Park & Resorts",
    description: "Waterpark | Boating Park | Adventure Park | Amusement Park | Safari | Bird Park | Agro Park | Helicopter Ride | Wedding | Accommodation | Corporate Events | Festival Celebrations | Birthday Events | Special School Picnic",
    videoUrl: "/main.mp4",
    posterUrl: "/p6.jpg",
    subTitle: "मौज मस्ती चाहिये, शिवतीर्थ आइए"
  });

  const attractions = [
    { name: "Water Park", href: "/water-park" },
    { name: "Boating Park", href: "/boating-park" },
    { name: "Adventure Park", href: "/adventure-park" },
    { name: "Amusement Park", href: "/amusement-park" },
    { name: "Safari", href: "/adventure-park" },
    { name: "Bird Park", href: "/bird-park" },
    { name: "Agro Park", href: "/parks-experiences#agro-park" },
    { name: "Helicopter Ride", href: "/parks-experiences#air-tourism" },
    { name: "Wedding", href: "/parks-experiences#wedding-celebrations" },
    { name: "Accommodation", href: "/accommodation" },
    { name: "Corporate Events", href: "/parks-experiences#corporate-events" },
    { name: "Festival Celebrations", href: "/parks-experiences#festive-celebrations" },
    { name: "Birthday Events", href: "/parks-experiences#birthday-events" },
    { name: "School Picnic", href: "/school-picnic" },
  ];

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data } = await supabase
          .from('website_content')
          .select('content')
          .eq('section', 'hero')
          .single();
        if (data?.content) {
          setHeroData({
            title1: data.content.title1 || data.content.title || heroData.title1,
            title2: data.content.title2 || heroData.title2,
            description: data.content.description || heroData.description,
            videoUrl: data.content.videoUrl || heroData.videoUrl,
            posterUrl: data.content.posterUrl || heroData.posterUrl,
            subTitle: data.content.subTitle || heroData.subTitle,
          });
        }
      } catch (err) {
        console.error("Error fetching hero content from Supabase:", err);
      }
    }
    fetchHero();
  }, []);

  return (
    <>
      <div className='overflow-hidden w-screen relative h-[94vh] flex flex-col items-center justify-center'>
        {/* Background Video */}
        <div className='absolute inset-0 z-0 overflow-hidden'>
          <motion.video
            initial={{ scale: 1.1 }}
            animate={{ scale: 1.04 }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            autoPlay
            loop
            muted
            playsInline
            className='h-full w-full object-cover'
            src={heroData.videoUrl}
            poster={heroData.posterUrl}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75' />
        </div>

        {/* Hero Content Container */}
        <div className='px-4 uppercase text-center relative z-10 text-white max-w-4xl mx-auto flex flex-col items-center justify-center'>

          {/* Animated Subtitle Badge */}
          {/* <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/40 border border-amber-400/40 backdrop-blur-md text-amber-300 text-xs font-semibold tracking-wider shadow-md mb-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>{heroData.subTitle}</span>
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          </motion.div> */}

          {/* Welcome Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <TextAnimate animation="blurInUp" className='text-sm md:text-lg font-medium tracking-widest text-slate-200' by="character" once>
              WELCOME TO
            </TextAnimate>
          </motion.div>

          {/* Main Title 1 */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className='font-bold text-4xl md:text-6xl lg:text-7xl leading-none text-accent tracking-wider drop-shadow-2xl font-times'
            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
          >
            {heroData.title1}
          </motion.h1>

          {/* Main Title 2 */}
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className='font-bold text-lg md:text-2xl lg:text-3xl leading-snug text-white tracking-wide drop-shadow-md font-times'
            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
          >
            {heroData.title2}
          </motion.h2>

          {/* Animated Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className='flex flex-wrap justify-center items-center gap-2 mt-2 text-amber-300 font-semibold text-xs md:text-sm tracking-wide'
          >
            <span className="bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-md border border-amber-500/30">
              Central India's Unique Picnic Spot
            </span>
            <span className="hidden md:inline text-amber-400">•</span>
            <span className="bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-md border border-amber-500/30">
              All Enjoyments under One Roof
            </span>
          </motion.div>

          {/* Detailed Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className='text-xs md:text-sm leading-relaxed text-slate-300 max-w-2xl font-normal mt-1 tracking-normal normal-case opacity-90'
          >
            {attractions.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-xs md:text-sm px-1 text-slate-200"
              >
                {item.name} |
              </a>
            ))}
          </motion.p>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { delay: 1, duration: 0.5 },
            y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
          }}
          className="absolute bottom-16 z-10 flex flex-col items-center cursor-pointer text-white/80 hover:text-amber-400 transition"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight * 0.82, behavior: 'smooth' });
          }}
        >
          <span className="text-[10px] uppercase tracking-widest font-semibold mb-0.5">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 text-amber-400" />
        </motion.div>
      </div>

      {/* Sticky CTA Button */}
      <InteractiveHoverButton
        href={"/offers"}
        className='flex fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl hover:scale-105 transition-transform duration-300 text-xs md:text-sm font-bold'
      >
        BOOK NOW
      </InteractiveHoverButton>
    </>
  );
};

export default Hero;