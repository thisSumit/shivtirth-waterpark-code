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
    <>
      <style jsx>{`
        @keyframes overlayFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes revealOpen {
          0% {
            opacity: 0;
            transform: translateY(16px) scaleY(0.15) scaleX(0.8);
            clip-path: inset(50% 0 50% 0 round 26px);
          }
          35% {
            opacity: 0.9;
            transform: translateY(4px) scaleY(0.6) scaleX(0.96);
            clip-path: inset(18% 0 18% 0 round 24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scaleY(1) scaleX(1);
            clip-path: inset(0 0 0 0 round 26px);
          }
        }

        @keyframes revealImage {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes revealButton {
          0% {
            opacity: 0;
            transform: translateY(18px) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes revealCloseButton {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .popup-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.62);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: overlayFade 0.5s ease-out both;
        }

        .popup-dialog {
          position: relative;
          width: min(82vw, 560px);
          max-height: 80vh;
          overflow: hidden;
          border-radius: 28px;
          background: white;
          box-shadow: 0 35px 90px rgba(15, 23, 42, 0.4);
          animation: revealOpen 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          transform-origin: center center;
        }

        .popup-image-wrap {
          opacity: 0;
          animation: revealImage 0.45s ease-out 0.55s forwards;
        }

        .popup-button-wrap {
          opacity: 0;
          animation: revealButton 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards;
        }

        .popup-close-btn {
          opacity: 0;
          animation: revealCloseButton 0.35s ease-out 0.68s forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .popup-overlay,
          .popup-dialog,
          .popup-image-wrap,
          .popup-button-wrap,
          .popup-close-btn {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
        <div
          className="popup-overlay"
          onClick={handleClose}
        />

        <div className="popup-dialog relative overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="absolute top-0 left-0 right-0 h-3 bg-accent" />

          <button
            onClick={handleClose}
            className="popup-close-btn absolute top-6 right-6 z-10 bg-white/90 hover:bg-white text-black p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110"
            aria-label="Close popup"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          <div className="p-1 text-center">
            <div className="popup-image-wrap mb-1 flex justify-center">
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

            <div className="popup-button-wrap">
              <InteractiveHoverButton
                href={"/offers"}
                onClick={handleClose}
                className="inline-block w-full"
              >
                Book Now
              </InteractiveHoverButton>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PopUp