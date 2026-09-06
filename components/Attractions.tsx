"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import AnimatedHeading from "./ui/AnimatedHeading";
import { ScrollReveal, ScrollStaggerItem } from "./ui/ScrollReveal";

interface AttractionItem {
  id: string;
  title: string;
  subtitle: string;
  parkTag: string; // Short 2-3 word about park
  description: string;
  href: string;
  videoUrl: string;
  posterUrl: string;
  // Grid layout class for responsive Bento grid
  gridClass: string;
}

const attractionsData: AttractionItem[] = [
  {
    id: "waterpark",
    title: "Water Park",
    subtitle: "Splash & Thrill",
    parkTag: "Shivtirth Water Park",
    description:
      "Exciting water slides, massive wave pool, rain dance, and fun splash zones for all ages.",
    href: "/water-park",
    videoUrl: "/main.mp4",
    posterUrl: "/Water-Park.jpg",
    gridClass: "col-span-1 md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2 min-h-[340px] md:min-h-[500px]",
  },
  {
    id: "adventure-park",
    title: "Adventure Park",
    subtitle: "Heart-Pumping Thrills",
    parkTag: "Shivtirth Adventure Hub",
    description:
      "Challenge yourself with high rope bridges, zip line, climbing towers, and obstacles.",
    href: "/adventure-park",
    videoUrl: "/main.mp4",
    posterUrl: "/Adventure-Park.jpg",
    gridClass: "col-span-1 md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1 min-h-[300px] md:min-h-[240px]",
  },
  {
    id: "amusement-park",
    title: "Amusement Park",
    subtitle: "Endless Joy",
    parkTag: "Shivtirth Fun World",
    description:
      "Classic Columbus rides, spinning swings, bumper cars, and carnival fun for everyone.",
    href: "/amusement-park",
    videoUrl: "/main.mp4",
    posterUrl: "/amusement.jpg",
    gridClass: "col-span-1 md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1 min-h-[300px] md:min-h-[240px]",
  },
  {
    id: "bird-park",
    title: "Bird Park",
    subtitle: "Exotic Nature",
    parkTag: "Shivtirth Bird Aviary",
    description:
      "Interactive exotic bird aviary surrounded by lush Satpuda green valley.",
    href: "/bird-park",
    videoUrl: "/main.mp4",
    posterUrl: "/Bird-Park.jpg",
    gridClass: "col-span-1 md:col-start-1 md:col-span-1 md:row-start-3 md:row-span-1 min-h-[300px] md:min-h-[240px]",
  },
  {
    id: "accommodation",
    title: "Accommodation",
    subtitle: "Luxury Stay",
    parkTag: "Shivtirth Resort Stay",
    description:
      "Comfortable resort rooms, villas, and tranquil nature stays amidst dam views.",
    href: "/accommodation",
    videoUrl: "/main.mp4",
    posterUrl: "/Stay-Facilities.jpg",
    gridClass: "col-span-1 md:col-start-1 md:col-span-1 md:row-start-4 md:row-span-1 min-h-[300px] md:min-h-[240px]",
  },
  {
    id: "boating-park",
    title: "Boating Park",
    subtitle: "Serene Waterways",
    parkTag: "Shivtirth Boating Lake",
    description:
      "Enjoy peaceful pedal boats, family shikara boats, and scenic lake views.",
    href: "/boating-park",
    videoUrl: "/main.mp4",
    posterUrl: "/Boating-Park.jpg",
    gridClass: "col-span-1 md:col-start-2 md:col-span-2 md:row-start-3 md:row-span-2 min-h-[340px] md:min-h-[500px]",
  },
];

const Attractions: React.FC = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Title with common AnimatedHeading component matching Speciallity.tsx */}
      <AnimatedHeading
        title="Curated Destinations"
        subtitle="Explore our world-class parks and luxury stays crafted for unforgettable family adventures."
      />

      <ScrollReveal direction="up" delay={0.2} duration={0.5}>
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-5 pt-6 md:h-[1080px] lg:h-[1150px]">
          {attractionsData.map((item) => (
            <ScrollStaggerItem key={item.id} className={`${item.gridClass} w-full aspect-square md:aspect-auto md:h-full`}>
              <Link
                href={item.href}
                className="group relative overflow-hidden rounded-3xl block h-full w-full border border-white/20 shadow-lg hover:shadow-2xl hover:border-amber-400/50 transition-all duration-500 transform hover:-translate-y-1.5"
              >
                {/* Background Video with Poster Fallback */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  src={item.videoUrl}
                  poster={item.posterUrl}
                  onLoadedData={(e) => {
                    e.currentTarget.play().catch(() => { });
                  }}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLVideoElement;
                    if (target.src !== window.location.origin + "/main.mp4") {
                      target.src = "/main.mp4";
                      target.play().catch(() => { });
                    }
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 scale-110 group-hover:scale-120"
                />

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-black/20 transition-opacity duration-300 group-hover:from-slate-950 group-hover:via-slate-900/60" />

                {/* Top ParkTag Badge & Action Button */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 gap-2">
                  {/* ParkTag with glassmorphism backdrop-blur background */}
                  <span className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase bg-black/40 backdrop-blur-md border border-white/20 text-slate-100 px-3 py-1 rounded-full shadow-xs">
                    {item.parkTag}
                  </span>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/40 text-white border border-white/20 backdrop-blur-md transition-all duration-300 group-hover:bg-accent group-hover:border-amber-400 group-hover:text-slate-950 group-hover:scale-110 shadow-md">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom Content Container */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end text-white">
                  {/* Subtitle above title without background */}
                  <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-white drop-shadow-md mb-0.5">
                    {item.subtitle}
                  </span>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-accent transition-colors duration-300 drop-shadow-sm">
                    {item.title}
                  </h3>

                  {/* Description: Hidden by default, shown smoothly on hover */}
                  <div className="max-h-0 opacity-0 group-hover:max-h-28 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden">
                    <p className="text-xs sm:text-sm text-slate-200 pt-2 line-clamp-3 leading-relaxed font-normal drop-shadow-xs">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            </ScrollStaggerItem>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Attractions;
