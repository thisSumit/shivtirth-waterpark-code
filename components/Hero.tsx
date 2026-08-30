"use client";

import React, { useState, useEffect } from 'react'
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { TextAnimate } from './ui/text-animate';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { getWhatsAppBookingHref } from '@/lib/whatsapp';
import { supabase } from '@/lib/supabase';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title1: "Shivtirth",
     title2: "Best Water Park & Resorts",
    description: "Waterpark | Boating Park | Adventure Park | Amusement Park | Safari | Bird Park | Agro Park | Helicopter Ride | Wedding | Accommodation | Corporate Events | Festival Celebrations | Birthday Events | Special School Picnic",
    videoUrl: "",
    posterUrl: "/p6.jpg",
    subTitle: "मौज मस्ती चाहिये, शिवतीर्थ आइए"
  });

  useEffect(() => {
    async function fetchHero() {
      try {
        const { data, error } = await supabase
          .from('website_content')
          .select('content')
          .eq('section', 'hero')
          .single();
        if (data?.content) {
          setHeroData({
            title1: data.content.title1 || data.content.title || heroData.title1,
            title2: data.content.title2 || heroData.title2,
            description: data.content.description || heroData.description,
            videoUrl: data.content.videoUrl?.startsWith("http") ? data.content.videoUrl : "",
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
      <div className='overflow-hidden w-screen relative h-[98vh] flex flex-col items-center justify-center'>
        <div className='absolute inset-0 z-0'>
          {heroData.videoUrl ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className='h-full scale-110 w-full object-cover'
              src={heroData.videoUrl}
              poster={heroData.posterUrl}
            />
          ) : (
            <img
              src={heroData.posterUrl}
              alt="Shivtirth Water Park"
              className='h-full scale-110 w-full object-cover'
            />
          )}
          {/* Overlay for better text readability */}
          <div className='absolute inset-0 bg-black/40' />
        </div>

        <div className='px-2 uppercase text-center relative z-10 text-white'>
          <p className='font-black text-md p-2 text-accent'>{heroData.subTitle}</p>
          <TextAnimate animation="blurInUp" className='text-2xl' by="character" once>
            Welcome to
          </TextAnimate>
  {/* <LayoutTextFlip
    text="Shivtirth Best"
    words={["Waterpark", "Boating Park", "Adventure Park", "Amusement Park", "Bird Park", "Agro Park"]}
    text1=""
  /> */}
            <h2 className='font-bold text-4xl leading-8 px-10 text-accent'>{heroData.title1}</h2>
            <h2 className='font-bold md:text-2xl text-xl leading-8 px-10 text-accent'>{heroData.title2}</h2>
            <h3 className='font-bold text-lg leading-6 px-10 text-[#FFA500] mt-4'>All Enjoyments under One Roof</h3>
            <p className='text-md leading-5'>{heroData.description}</p>
        </div>

        {/* Bottom corner images */}
        {/* <img src="/mogli.png" alt="Mogli" className='absolute bottom-0 [transform:rotateY(180deg)] left-6 h-65 md:h-100 object-contain z-10' />
        <img src="/adishakti.png" alt="Adishakti" className='absolute bottom-0 right-0 h-40 md:h-70 object-contain z-10' /> */}
      </div>

      {/* Sticky CTA Button */}
      <InteractiveHoverButton
        href={"/offers"}
        className='flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center z-20 px-8 py-3'
      >
        BOOK NOW
      </InteractiveHoverButton>
    </>
  )
}

export default Hero