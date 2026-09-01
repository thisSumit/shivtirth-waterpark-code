"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ScrollReveal, ScrollStaggerItem } from './ui/ScrollReveal';

const packages = [
  {
    id: 1,
    link: '/water-park',
    title: 'Water Park',
    subtitle: 'THE ULTIMATE SPLASH ADVENTURE',
    description: 'Feel the rush on heart-pounding water slides, splash into wave pools, and enjoy endless aquatic fun designed for thrill-seekers and families alike.',
    image: '/Water-Park.jpg',
    span: 'md:col-span-2'
  },
  {
    id: 2,
    link: '/adventure-park',
    title: 'Mowgli Adventure Park',
    subtitle: 'EMBRACE THE WILD SIDE OF ADVENTURE',
    description: 'Step into a jungle-inspired escape where thrilling outdoor challenges, nature trails, and adrenaline-packed activities await you.',
    image: '/mowgli-adventure.jpg',
    span: 'md:col-span-1'
  },
  {
    id: 3,
    link: '/amusement-park',
    title: 'Amusement Park',
    subtitle: 'NON-STOP THRILLS & LAUGHTER',
    description: 'Get your adrenaline pumping with high-speed rides, fun-filled attractions, and unforgettable moments for every age group.',
    image: '/a5.jpeg',
    span: 'md:col-span-2'
  },
  {
    id: 4,
    link: '/boating-park',
    title: 'Boating Park',
    subtitle: 'SAIL INTO SERENE EXCITEMENT',
    description: 'Glide across the water with exciting boating experiences that combine relaxation with a splash of adventure.',
    image: '/Boating-Park.jpg',
    span: 'md:col-span-1'
  },
  {
    id: 5,
    title: 'Dining',
    link: '/parks-experiences#dining',
    subtitle: 'TASTE THE FLAVOUR OF FUN',
    description: 'Refuel your adventure with delicious cuisines, refreshing beverages, and treats that satisfy every craving.',
    image: '/dining-shivtirth.png',
    span: 'md:col-span-1'
  },
  {
    id: 6,
    title: 'Camping Stay',
    link: '/parks-experiences#stay-facilities',
    subtitle: 'STAY, RELAX & RECHARGE',
    description: 'Extend the fun with cozy camping stays, surrounded by nature, comfort, and unforgettable night-time experiences.',
    image: '/Stay-Facilities.jpg',
    span: 'md:col-span-1'
  }
];

const Package = () => {
  return (
    <section className='relative py-20 px-4 md:px-8 bg-slate-900 overflow-hidden'>
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

      <div className='relative z-10 max-w-7xl mx-auto'>
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1} duration={0.6} className='text-center mb-14'>
          <h2 
            className='text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-4 leading-tight drop-shadow-xl font-times'
            style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
          >
            मौज मस्ती चाहिये<br />
            <span className="text-amber-400">शिवतीर्थ आइए</span>
          </h2>
          <p className='text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed font-normal'>
            Shivtirth Water Park — where thrill, fun, and relaxation come together!
            Slides, rides, boating, food & stays, all in one unforgettable destination.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-amber-400 to-amber-600" />
        </ScrollReveal>

        {/* Package Grid */}
        <ScrollReveal direction="up" delay={0.3} duration={0.7}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6'>
            {packages.map((pkg) => (
              <ScrollStaggerItem key={pkg.id} className={pkg.span}>
                <div
                  className='group relative aspect-[3/2] rounded-2xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-800'
                >
                  {/* Background Image */}
                  <div className='absolute inset-0 bg-slate-950'>
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className={`object-cover ${pkg.id === 1 ? 'object-top md:object-[50%_18%]' : ''} ${pkg.id === 2 ? 'object-[100%_70%] md:object-[50%_60%]' : ''} ${pkg.id === 3 ? 'object-bottom' : ''} group-hover:scale-110 transition-transform duration-700 ease-out`}
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:via-black/50 transition-colors duration-300' />
                  </div>

                  {/* Content */}
                  <div className='relative h-full p-6 md:p-8 flex flex-col justify-end text-left z-10'>
                    <p className='text-amber-400 font-bold text-xs md:text-sm tracking-wider uppercase mb-1'>
                      {pkg.subtitle}
                    </p>
                    <h3 
                      className='text-2xl md:text-4xl font-bold text-white mb-4 font-times drop-shadow-md'
                      style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
                    >
                      {pkg.title}
                    </h3>
                    
                    <Link href={pkg.link} className="w-fit">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-fit px-6 py-2.5 bg-amber-400 text-slate-950 font-bold text-xs md:text-sm rounded-full transition-all duration-300 shadow-lg hover:bg-amber-300 uppercase tracking-wide'
                      >
                        Learn More
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </ScrollStaggerItem>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Package;