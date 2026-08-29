'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { InteractiveHoverButton } from './ui/interactive-hover-button'
import { getWhatsAppBookingHref } from '@/lib/whatsapp'
import { supabase } from '@/lib/supabase'

interface PopUpProps {
  onClose?: () => void
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [popupData, setPopupData] = useState({
    imageUrl: "/offers/banner3.jpeg",
    title: "Grab Your Tickets Now & Dive Into the Fun!",
    description: "Exclusive packages with up to 30% discount!",
    enabled: true
  })

  useEffect(() => {
    setIsClient(true)

    async function fetchAndShow() {
      let isEnabled = true
      try {
        const { data } = await supabase
          .from('website_content')
          .select('content')
          .eq('section', 'popup')
          .single();
        if (data?.content) {
          setPopupData({
            imageUrl: data.content.imageUrl || popupData.imageUrl,
            title: data.content.title || popupData.title,
            description: data.content.description || popupData.description,
            enabled: data.content.enabled !== undefined ? data.content.enabled : true
          });
          isEnabled = data.content.enabled !== undefined ? data.content.enabled : true;
        }
      } catch (err) {
        console.error("Popup fetch error:", err)
      }

      const popupShown = sessionStorage.getItem('popupShown')
      if (!popupShown && isEnabled) {
        setIsVisible(true)
        sessionStorage.setItem('popupShown', 'true')
      }
    }

    fetchAndShow()
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  // Don't render on server
  if (!isClient || !isVisible) return null

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-[min(82vw,560px)] max-h-[80vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in zoom-in-95 duration-500">
        {/* Top Gradient - Yellow accent */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-accent" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 bg-white/90 hover:bg-white text-black p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
          aria-label="Close popup"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {/* Content */}
        <div className="p-4 md:p-3 text-center">
          {/* Image Section */}
          <div className="mb-4 flex justify-center">
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={popupData.imageUrl}
                alt="Shivtirth Water Park"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-xl font-black text-black mb-2 leading-tight">
            {popupData.title}
          </h2>

          {/* Divider - Yellow */}
          <div className="w-20 h-1 bg-accent rounded-full mx-auto mb-6" />

          {/* Highlight with yellow dot */}
          <div className="bg-accent rounded-xl p-3 mb-4">
            <p className="text-xs md:text-xs font-bold text-black flex items-center justify-center gap-2">
              <span className="inline-block w-3 h-3 bg-accent rounded-full" />
              {popupData.description}
              <span className="inline-block w-3 h-3 bg-accent rounded-full" />
            </p>
          </div>

          {/* Button */}
          <InteractiveHoverButton
            href={"/offers"}
            onClick={handleClose}
            className="inline-block w-full"
          >
            Book Now
          </InteractiveHoverButton>

          {/* Footer Text */}
          <p className="text-xs text-slate-500 text-center mt-4">
            Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PopUp