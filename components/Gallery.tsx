"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { supabase } from "@/lib/supabase";

/* ================= TYPES ================= */

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string } // mp4
  | { type: "youtube"; url: string };

/* ================= DATA ================= */

const mediaItems: MediaItem[] = [
  { type: "image", src: "/o11.jpg" },
  { type: "image", src: "/air-tourism.jpg" },
  { type: "image", src: "/a4.jpg" },
  {
    type: "youtube",
    url: "https://youtube.com/shorts/Ew8q8UF3p_s?si=avdT_x7Ah2ZWGYda",
  },
  { type: "image", src: "/foam-dance.jpg" },
  { type: "image", src: "/Adventure-Park.jpg" },
  {
    type: "youtube",
    url: "https://www.youtube.com/shorts/ciOg6AOlTzE",
  },
  { type: "image", src: "/birdspark-1.jpg" },
  { type: "image", src: "/p1.jpeg" },
  { type: "video", src: "/ov2.MP4" },
  { type: "image", src: "/adventure.jpg" },
  { type: "image", src: "/ag4.jpg" },
];

/* ================= COMPONENT ================= */

export default function GalleryAutoScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeMedia, setActiveMedia] = useState<MediaItem[]>(mediaItems);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('type, src')
          .order('display_order', { ascending: true });
        if (data && data.length > 0) {
          setActiveMedia(
            data.map((item) => {
              if (item.type === 'youtube') {
                return { type: 'youtube', url: item.src };
              } else {
                return { type: item.type as "image" | "video", src: item.src };
              }
            })
          );
        }
      } catch (err) {
        console.error("Error loading gallery from Supabase:", err);
      }
    }
    fetchGallery();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const speed = 0.45;
    let frameId = 0;

    const tick = () => {
      const half = container.scrollWidth / 2;

      if (!isPaused && !isDraggingRef.current) {
        container.scrollLeft += speed;

        // Seamless loop because list is duplicated.
        if (container.scrollLeft >= half) {
          container.scrollLeft -= half;
        }
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [isPaused]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollLeftRef.current = container.scrollLeft;
    setIsPaused(true);

    container.setPointerCapture(e.pointerId);
    container.classList.add("cursor-grabbing");
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container || !isDraggingRef.current) return;

    const delta = e.clientX - startXRef.current;
    container.scrollLeft = startScrollLeftRef.current - delta;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollRef.current;
    if (!container) return;

    isDraggingRef.current = false;
    container.releasePointerCapture(e.pointerId);
    container.classList.remove("cursor-grabbing");
    setIsPaused(false);
  };

  return (
    <section className="py-8 md:py-10 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="uppercase text-2xl md:text-3xl font-black text-slate-900 mb-2">
            Watch Some MOMENTs!
          </h2>

          {/* <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-base md:text-lg">
            Turn every laugh, splash, and thrill into memories that last forever. From family fun to wild group adventures, every visit to Shivtirth is a story worth sharing.
📸 Show us your best moments with #ShivtirthMemories
          </p> */}

          <InteractiveHoverButton
            onClick={() =>
              window.open(
                "https://www.instagram.com/shivtirthbestwaterpark/",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Follow @ShivtirthWaterPark
          </InteractiveHoverButton>
        </div>
      </div>

      {/* Auto scrolling row */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="gallery-scroll flex w-full gap-6 overflow-x-auto overflow-y-hidden px-4 md:px-8 cursor-grab select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={() => {
            if (isDraggingRef.current) return;
            setIsPaused(false);
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            if (isDraggingRef.current) return;
            setIsPaused(false);
          }}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          aria-label="Scrollable gallery"
        >
          <div className="flex w-max gap-6 py-2">
            {[...activeMedia, ...activeMedia].map((item, index) => (
              <MediaCard key={index} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .gallery-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.7) transparent;
          touch-action: pan-y;
        }

        .gallery-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .gallery-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .gallery-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.7);
          border-radius: 999px;
        }
      `}</style>
    </section>
  );
}

/* ================= MEDIA CARD ================= */

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="relative w-72 md:w-96 h-[420px] md:h-[520px] shrink-0 rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 hover:scale-[1.02] bg-black">
      {/* IMAGE */}
      {item.type === "image" && (
        <Image
          src={item.src}
          alt="Gallery"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 288px, 384px"
        />
      )}

      {/* MP4 VIDEO */}
      {item.type === "video" && (
        <video
          src={item.src}
          className="w-full h-full object-cover"
          muted
          autoPlay
          loop
          playsInline
        />
      )}

      {/* YOUTUBE VIDEO */}
      {item.type === "youtube" && (
        <iframe
          className="w-full h-full"
          src={getYouTubeEmbedUrl(item.url)}
          title="YouTube video"
          loading="eager"
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture; clipboard-write; accelerometer; gyroscope"
          allowFullScreen
        />
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function getYouTubeEmbedUrl(url: string) {
  // Shorts → Embed
  if (url.includes("/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&rel=0&modestbranding=1`;
  }

  // Normal YouTube
  const idMatch = url.match(/v=([^&]+)/);
  if (idMatch) {
    return `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${idMatch[1]}&rel=0&modestbranding=1`;
  }

  return "";
}
