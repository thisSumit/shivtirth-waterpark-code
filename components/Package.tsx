import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { link } from 'fs'

const packages = [
  {
  id: 1,
  link: '/water-park',
  title: 'Water Park',
  subtitle: 'THE ULTIMATE SPLASH ADVENTURE',
  description: 'Feel the rush on heart-pounding water slides, splash into wave pools, and enjoy endless aquatic fun designed for thrill-seekers and families alike.',
  image: '/Water-Park.jpg',
  span: 'col-span-2'
},
{
  id: 2,
  link: '/adventure-park',
  title: 'Mowgli Adventure Park',
  subtitle: 'EMBRACE THE WILD SIDE OF ADVENTURE',
  description: 'Step into a jungle-inspired escape where thrilling outdoor challenges, nature trails, and adrenaline-packed activities await you.',
  image: '/mowgli-adventure.jpg',
  span: 'col-span-1'
},
{
  id: 3,
  link: '/amusement-park',
  title: 'Amusement Park',
  subtitle: 'NON-STOP THRILLS & LAUGHTER',
  description: 'Get your adrenaline pumping with high-speed rides, fun-filled attractions, and unforgettable moments for every age group.',
  image: '/a5.jpeg',
  span: 'col-span-2'
},
{
  id: 4,
  link: '/boating-park',
  title: 'Boating Park',
  subtitle: 'SAIL INTO SERENE EXCITEMENT',
  description: 'Glide across the water with exciting boating experiences that combine relaxation with a splash of adventure.',
  image: '/Boating-Park.jpg',
  span: 'col-span-1'
},
{
  id: 5,
  title: 'Dining',
  link: '/parks-experiences#dining',
  subtitle: 'TASTE THE FLAVOUR OF FUN',
  description: 'Refuel your adventure with delicious cuisines, refreshing beverages, and treats that satisfy every craving.',
  image: '/dining-shivtirth.png',
  span: 'col-span-1'
},
{
  id: 6,
  title: 'Camping Stay',
  link: '/parks-experiences#stay-facilities',
  subtitle: 'STAY, RELAX & RECHARGE',
  description: 'Extend the fun with cozy camping stays, surrounded by nature, comfort, and unforgettable night-time experiences.',
  image: '/Stay-Facilities.jpg',
  span: 'col-span-1'
}
]

const Package = () => {
  return (
    <section className='relative py-20 px-4 md:px-8  bg-slate-900 overflow-hidden'>
      {/* Background Pattern */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl'></div>
        <div className='absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)]'>
            मौज मस्ती चाहिये<br />शिवतीर्थ आइए
          </h2>
          <p className='text-gray-300 max-w-3xl mx-auto text-sm md:text-base leading-relaxed'>
            Shivtirth Water Park- where thrill, fun, and relaxation come together!
Slides, rides, boating, food & stays <br /> All in one unforgettable destination.
          </p>
        </div>

        {/* Package Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative ${pkg.id === 1 || pkg.id === 4 ? 'md:col-span-2' : 'md:col-span-1'} aspect-[3/2] rounded-2xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              {/* Background Image */}
              <div className='absolute inset-0 bg-gray-800'>
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className={`object-cover ${pkg.id === 1 ? 'object-top md:object-[50%_18%]' : ''} ${pkg.id === 2 ? 'object-[100%_70%] md:object-[50%_60%]' : ''} ${pkg.id === 3 ? 'object-bottom' : ''} group-hover:scale-110 transition-transform duration-500`}
                />
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent'></div>
              </div>

              {/* Content */}
              <div className='relative h-full p-6 md:p-8 flex flex-col justify-end'>
                <p className='text-accent font-bold text-sm tracking-wide'>
                  {pkg.subtitle}
                </p>
                <h3 className='text-3xl md:text-5xl font-black text-white mb-2'>
                  {pkg.title}
                </h3>
                
                {/* Learn More Button */}
                <Link href={pkg.link}>
                  <button className='w-fit px-6 py-2.5 bg-accent text-slate-900 font-bold rounded-full transition-all duration-300 transform group-hover:scale-105 shadow-lg cursor-pointer'>
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Package