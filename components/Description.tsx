"use client";

import React from 'react'

const Description = () => {
  const offers = [
    "💦 WATERPARK SPLASH",
    "🌈 WATERFALL",
    "🧗 RAPPELLING RUSH",
    "🚤 THRILL BOATING",
    "🎡 AMUSEMENT PARK",
    "🧭 ADVENTURE QUEST",
    "🦜 BIRD PARK",
    "🏡 STAY FACILITIES AT COMFORT",
    "🌾 AGRO PARK ESCAPE",
    "🦁 SAFARI",
    "💍 WEDDING CELEBRATIONS",
    "📸 SELFIE ZONE VIBES"
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll-left {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 50s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 50s linear infinite;
        }
      `}} />
      
      <div className='description bg-accent overflow-hidden py-1'>
        {/* First Row - Scrolling Left to Right */}
        <div className='flex whitespace-nowrap'>
          <div className='animate-scroll-left flex'>
            {[...offers, ...offers].map((offer, index) => (
              <span 
                key={`left-${index}`} 
                className='text-xl md:text-2xl font-black text-slate-900 mx-8'
              >
                {offer}
              </span>
            ))}
          </div>
          <div className='animate-scroll-left flex'>
            {[...offers, ...offers].map((offer, index) => (
              <span 
                key={`left-dup-${index}`} 
                className='text-2xl md:text-4xl font-black text-slate-900 mx-8'
              >
                {offer}
              </span>
            ))}
          </div>
        </div>

        {/* Second Row - Scrolling Right to Left */}
        <div className='flex whitespace-nowrap'>
          <div className='animate-scroll-right flex'>
            {[...offers, ...offers].map((offer, index) => (
              <span 
                key={`right-${index}`} 
                className='text-xl md:text-2xl font-black text-slate-900 mx-8'
              >
                {offer}
              </span>
            ))}
          </div>
          <div className='animate-scroll-right flex'>
            {[...offers, ...offers].map((offer, index) => (
              <span 
                key={`right-dup-${index}`} 
                className='text-xl md:text-2xl font-black text-slate-900 mx-8'
              >
                {offer}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Description