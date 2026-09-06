'use client';

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Sparkles } from 'lucide-react'
import { InteractiveHoverButton } from './ui/interactive-hover-button'
import { supabase } from '@/lib/supabase'

interface PopUpProps {
  onClose?: () => void
}

const PopUp: React.FC<PopUpProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [popupData, setPopupData] = useState({
    imageUrl: "/offers/banner3.jpeg",
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
      <style>{`
        @keyframes scrollOverlayFade {
          0% { opacity: 0; backdrop-filter: blur(0px); }
          100% { opacity: 1; backdrop-filter: blur(6px); }
        }

        /* Outer unroll container expansion */
        @keyframes scrollUnrollExpand {
          0% {
            max-height: 24px;
            transform: scale(0.75, 0.15) rotateX(25deg);
            opacity: 0.2;
            box-shadow: 0 5px 20px rgba(0,0,0,0.6);
          }
          40% {
            opacity: 1;
            transform: scale(0.98, 0.6) rotateX(10deg);
          }
          75% {
            transform: scale(1.02, 1.02) rotateX(0deg);
          }
          100% {
            max-height: 620px;
            transform: scale(1, 1) rotateX(0deg);
            opacity: 1;
            box-shadow: 0 25px 60px -10px rgba(0,0,0,0.5), 0 0 35px rgba(37, 129, 129, 0.3);
          }
        }

        /* Top Roller Unroll */
        @keyframes rollerTopMove {
          0% { transform: translateY(0px) scaleY(1.3); }
          100% { transform: translateY(-8px) scaleY(1); }
        }

        /* Bottom Roller Unroll */
        @keyframes rollerBottomMove {
          0% { transform: translateY(0px) scaleY(1.3); }
          100% { transform: translateY(8px) scaleY(1); }
        }

        /* Shimmer light across scroll */
        @keyframes parchmentShimmer {
          0% { transform: translateX(-150%) rotate(25deg); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: translateX(200%) rotate(25deg); opacity: 0; }
        }

        /* Content fade and pop */
        @keyframes scrollContentAppear {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        /* Badge Pop */
        @keyframes badgePop {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.1) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .scroll-backdrop {
          animation: scrollOverlayFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .scroll-body {
          perspective: 1000px;
          animation: scrollUnrollExpand 0.85s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          transform-origin: center center;
        }

        .top-roller-anim {
          animation: rollerTopMove 0.85s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .bottom-roller-anim {
          animation: rollerBottomMove 0.85s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .scroll-shimmer {
          animation: parchmentShimmer 1.2s ease-in-out 0.6s forwards;
        }

        .scroll-content-inner {
          animation: scrollContentAppear 0.5s ease-out 0.5s forwards;
          opacity: 0;
        }

        .offer-badge {
          animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.75s forwards;
          opacity: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .scroll-backdrop,
          .scroll-body,
          .scroll-shimmer,
          .scroll-content-inner,
          .offer-badge {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Dark Backdrop */}
        <div
          className="scroll-backdrop absolute inset-0 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Main Scroll Container */}
        <div className="relative w-full max-w-[480px] z-10 my-auto">

          {/* Top Roller Handles (Teal & Gold Theme) */}
          <div className="top-roller-anim relative z-20 flex items-center justify-between px-2 -mb-2 pointer-events-none">
            <div className="w-6 h-7 rounded-l-md bg-gradient-to-r from-teal-900 via-[#258181] to-teal-900 shadow-md border-r border-teal-950/40" />
            <div className="flex-1 h-5 bg-gradient-to-b from-[#258181] via-teal-600 to-teal-900 rounded-sm shadow-md border-y border-teal-950/60 flex items-center justify-center">
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
            <div className="w-6 h-7 rounded-r-md bg-gradient-to-l from-teal-900 via-[#258181] to-teal-900 shadow-md border-l border-teal-950/40" />
          </div>

          {/* Scroll Canvas (Shivtirth Website Aesthetics) */}
          <div className="scroll-body relative overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-slate-50 to-[#f2f7f7] rounded-2xl border-x-4 border-[#258181]/40 shadow-2xl">

            {/* Side Accent Lines */}
            <div className="absolute inset-y-0 left-2 w-[2px] bg-gradient-to-b from-[#258181]/30 via-amber-400/50 to-[#258181]/30" />
            <div className="absolute inset-y-0 right-2 w-[2px] bg-gradient-to-b from-[#258181]/30 via-amber-400/50 to-[#258181]/30" />

            {/* Shimmer Light */}
            <div className="scroll-shimmer absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-20" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-30 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 focus:outline-none shadow-md"
              aria-label="Close popup"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Offer Tag Badge */}
            {/* <div className="offer-badge absolute top-3 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-[#258181] text-amber-300 rounded-full shadow-md border border-amber-300/40 text-[11px] font-bold tracking-wider uppercase">
              <Sparkles size={12} className="text-amber-300 animate-pulse" />
              <span>Special Offer</span>
            </div> */}

            {/* Inner Content (Only Image & Button) */}
            <div className="scroll-content-inner">

              {/* Clickable Image Banner with 4:3 Aspect Ratio */}
              <Link
                href="/offers"
                onClick={handleClose}
                className="block relative w-full aspect-[4/3] overflow-hidden rounded-xl shadow-lg border border-slate-200 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#258181]"
              >
                <Image
                  src={popupData.imageUrl}
                  alt="Shivtirth Water Park Special Offer"
                  fill
                  className="object-cover"
                  priority
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20">
                    Click to View Offers &rarr;
                  </span>
                </div> */}
              </Link>

              {/* Book Now Button */}
              <div className="w-full">
                <InteractiveHoverButton
                  href="/offers"
                  onClick={handleClose}
                  className="w-full bg-accent hover:bg-[#1d6b6b] text-black"
                >
                  Book Now
                </InteractiveHoverButton>
              </div>

            </div>
          </div>

          {/* Bottom Roller Handles */}
          <div className="bottom-roller-anim relative z-20 flex items-center justify-between px-2 -mt-2 pointer-events-none">
            <div className="w-6 h-7 rounded-l-md bg-gradient-to-r from-teal-900 via-[#258181] to-teal-900 shadow-md border-r border-teal-950/40" />
            <div className="flex-1 h-5 bg-gradient-to-b from-[#258181] via-teal-600 to-teal-900 rounded-sm shadow-md border-y border-teal-950/60 flex items-center justify-center">
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
            </div>
            <div className="w-6 h-7 rounded-r-md bg-gradient-to-l from-teal-900 via-[#258181] to-teal-900 shadow-md border-l border-teal-950/40" />
          </div>
        </div>
      </div>
    </>
  )
}

export default PopUp