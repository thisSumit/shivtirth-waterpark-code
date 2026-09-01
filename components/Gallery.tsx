"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { supabase } from "@/lib/supabase";
import AnimatedHeading from "./ui/AnimatedHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string }
  | { type: "youtube"; url: string };

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
  { type: "image", src: "/adventure.jpg" },
  { type: "image", src: "/ag4.jpg" },
];

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
        const { data } = await supabase
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
    <section className="py-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedHeading
          title="Watch Some MOMENTs!"
          subtitle="Turn every laugh, splash, and thrill into memories that last forever."
        />

        <ScrollReveal direction="up" delay={0.2} duration={0.5} className="flex justify-center mb-8">
          <InteractiveHoverButton
            onClick={() =>
              window.open(
                "https://www.instagram.com/shivtirthbestwaterpark/",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Visit Our Instagram
          </InteractiveHoverButton>
        </ScrollReveal>
      </div>

      <ScrollReveal direction="fade" delay={0.3} duration={0.8}>
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
      </ScrollReveal>

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

function MediaCard({ item }: { item: MediaItem }) {
  return (
    <div className="group relative w-72 md:w-96 h-[420px] md:h-[520px] shrink-0 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl bg-black border border-slate-800">
      {item.type === "image" && (
        <Image
          src={item.src}
          alt="Gallery"
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 288px, 384px"
        />
      )}

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

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

function getYouTubeEmbedUrl(url: string) {
  if (url.includes("/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&rel=0&modestbranding=1`;
  }

  const idMatch = url.match(/v=([^&]+)/);
  if (idMatch) {
    return `https://www.youtube.com/embed/${idMatch[1]}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${idMatch[1]}&rel=0&modestbranding=1`;
  }

  return "";
}
