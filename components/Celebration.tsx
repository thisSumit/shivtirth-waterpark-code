'use client'

import React, { useState } from 'react'
import { ChevronRight, X } from 'lucide-react'
import { InteractiveHoverButton } from './ui/interactive-hover-button'
import { useRouter } from 'next/navigation'

interface Venue {
  id: number
  number: string
  name: string
  description: string
  image?: string
  parkSectionId: string
}

const venuesData: Venue[] = [
  {
    id: 1,
    number: '01',
    name: 'Stay Facilities',
    description: 'Comfortable and clean accommodation for families, groups, and event guests.',
    image: '/farmhouse.png',
    parkSectionId: 'stay-facilities'
  },
  {
    id: 2,
    number: '02',
    name: 'School Picnic',
    description: 'Safe, fun-filled picnic packages with exciting rides and smooth group management.',
    image: '/ag2.jpeg',
    parkSectionId: 'school-and-college-picnics'
  },
  {
    id: 3,
    number: '03',
    name: 'Wedding Celebrations',
    description: 'Spacious venue and complete support for your memorable wedding functions.',
    image: '/Wedding-Events.png',
    parkSectionId: 'wedding-celebrations'
  },
  {
    id: 4,
    number: '04',
    name: 'Corporate Events',
    description: 'Perfect setting for team outings, meetings, and corporate celebrations.',
    image: '/corperate.webp',
    parkSectionId: 'corporate-events'
  },
  {
    id: 5,
    number: '05',
    name: 'Birthday Parties',
    description: 'Make birthdays special with water fun and customized party setups.',
    image: '/birthday-1.jpg',
    parkSectionId: 'birthday-parties'
  },
  {
    id: 6,
    number: '06',
    name: 'Festive Celebrations',
    description: 'Celebrate New Year and festivals with music, energy, and grand vibes.',
    image: '/festival-celebration.jpeg',
    parkSectionId: 'festive-celebrations'
  },
  {
    id: 7,
    number: '07',
    name: 'Event Planning',
    description: 'Flexible planning tailored to your unique event needs.',
    image: '/custom-events.png',
    parkSectionId: 'custom-event-planning'
  },
]

const Venue = () => {
  const router = useRouter()
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleVenueClick = (venue: Venue) => {
    setSelectedVenue(venue)
    setIsDetailOpen(true)
  }

  const closeDetail = () => {
    setIsDetailOpen(false)
    setTimeout(() => {
      setSelectedVenue(null)
    }, 300)
  }

  const goToParkSection = () => {
    if (!selectedVenue) return
    router.push(`/parks-experiences#${selectedVenue.parkSectionId}`)
    closeDetail()
  }

  return (
    <section className='relative w-full min-h-screen bg-background py-20 lg:py-32'>
      <div className='max-w-7xl mx-auto px-4 lg:px-16'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
          {/* Left Section - Image */}
          <div className='lg:w-1/2'>
            <div className='sticky top-24 h-150 lg:h-225 rounded-lg overflow-hidden shadow-2xl'>
              {selectedVenue?.image ? (
                <img
                  src={selectedVenue.image}
                  alt={selectedVenue.name}
                  className='w-full h-full object-cover transition-opacity duration-500'
                />
              ) : (
                <div className='w-full h-full bg-linear-to-br from-[#1b3d2c] to-[#2d5a47] flex items-center justify-center'>
                  <div className='w-full h-full object-cover '>
                  <img src="/birthday-1.jpg" className='w-full h-full object-cover' alt="" />
                  </div>
                </div>
              )}
              {/* Overlay gradient for better text readability if needed */}
              <div className='absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none' />
            </div>
          </div>

          {/* Right Section - Venue List */}
          <div className='lg:w-1/2 flex flex-col justify-center'>
            <div className='mb-4'>
              <h2 className="text-4xl uppercase md:text-6xl font-black text-slate-900 mb-6">
                Weddings, Parties & Grand Celebrations, All in One Destination
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto mb-2 text-base md:text-lg">
                From joyful school picnics to luxurious weddings and high-energy corporate events, Shivtirth is where every celebration comes alive. With seamless planning, beautiful spaces, and a dedicated team taking care of every detail, you don’t just host an event, you create unforgettable memories in style.
              </p>
            </div>

            {/* Venue List */}
            <div className='space-y-0'>
              {venuesData.map((venue, index) => (
                <div
                  key={venue.id}
                  className='venue-item group border-b border-foreground/10 last:border-b-0'
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <button
                    onClick={() => handleVenueClick(venue)}
                    className='w-full py-6 flex items-center justify-between hover:bg-foreground/5 transition-all duration-300 group-hover:pl-4 px-2 rounded-lg'
                  >
                    <div className='flex items-center gap-6 flex-1 text-left'>
                      <span className='text-foreground/40 text-sm font-light tracking-widest min-w-10'>
                        {venue.number}
                      </span>
                      <span className='text-xl lg:text-2xl font-semibold text-foreground group-hover:text-foreground/80 transition-colors duration-300'>
                        {venue.name}
                      </span>
                    </div>
                    <ChevronRight 
                      className='w-5 h-5 text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300' 
                    />
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 mt-6'>
              <InteractiveHoverButton onClick={() => window.location.href = "tel:+918275737579"} className='flex-1 py-4 px-6'>
                Plan Your Perfect Event
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal/Overlay */}
      {isDetailOpen && selectedVenue && (
        <div
          className={`fixed inset-0 z-999 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isDetailOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={closeDetail}
        >
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' />

          {/* Detail Card */}
          <div
            className={`relative bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-300 ${
              isDetailOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeDetail}
              className='absolute top-4 right-4 p-2 text-foreground/60 hover:text-foreground transition-colors duration-300 z-10'
              aria-label="Close"
            >
              <X className='w-6 h-6' />
            </button>

            <div className='flex flex-col lg:flex-row'>
              {/* Image Section */}
              <div className='lg:w-1/2 h-64 lg:h-auto min-h-75 bg-linear-to-br from-[#1b3d2c] to-[#2d5a47]'>
                {selectedVenue.image ? (
                  <img
                    src={selectedVenue.image}
                    alt={selectedVenue.name}
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-background/40'>
                    <p className='text-center px-8'>No image available</p>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className='lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center'>
                <div className='mb-4'>
                  <span className='text-foreground/40 text-sm font-light tracking-widest'>
                    {selectedVenue.number}
                  </span>
                </div>
                <h3 className='text-3xl lg:text-4xl font-bold text-foreground mb-6'>
                  {selectedVenue.name}
                </h3>
                <p className='text-lg text-foreground/70 leading-relaxed mb-8'>
                  {selectedVenue.description}
                </p>
                <div className='flex flex-col sm:flex-row gap-4'>
                  <InteractiveHoverButton onClick={goToParkSection} className='flex-1 w-50 justify-center'>
                    Learn More
                  </InteractiveHoverButton>
                  <InteractiveHoverButton
                    onClick={() => {
                      window.location.href = 'tel:+918275737579'
                    }}
                    className='flex-1 w-50 justify-center'
                  >
                    Call Now
                  </InteractiveHoverButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Venue
