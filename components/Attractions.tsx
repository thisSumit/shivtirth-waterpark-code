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
    description:
      "Exciting water slides, massive wave pool, rain dance, and fun splash zones for all ages.",
    href: "/water-park",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-people-sliding-down-a-water-slide-in-a-water-41539-large.mp4",
    posterUrl: "/Water-Park.jpg",
    gridClass: "col-span-1 md:col-start-1 md:col-span-2 md:row-start-1 md:row-span-2 min-h-[260px] md:min-h-[440px]",
  },
  {
    id: "adventure-park",
    title: "Adventure Park",
    subtitle: "Heart-Pumping Thrills",
    description:
      "Challenge yourself with high rope bridges, zip line, climbing towers, and obstacles.",
    href: "/adventure-park",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-person-doing-zipline-over-a-forest-42588-large.mp4",
    posterUrl: "/Adventure-Park.jpg",
    gridClass: "col-span-1 md:col-start-3 md:col-span-1 md:row-start-1 md:row-span-1 min-h-[260px] md:min-h-[200px]",
  },
  {
    id: "amusement-park",
    title: "Amusement Park",
    subtitle: "Endless Joy",
    description:
      "Classic Columbus rides, spinning swings, bumper cars, and carnival fun for everyone.",
    href: "/amusement-park",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-amusement-park-ferris-wheel-at-dusk-41549-large.mp4",
    posterUrl: "/amusement.jpg",
    gridClass: "col-span-1 md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1 min-h-[260px] md:min-h-[200px]",
  },
  {
    id: "bird-park",
    title: "Bird Park",
    subtitle: "Exotic Nature",
    description:
      "Interactive exotic bird aviary surrounded by lush Satpuda green valley.",
    href: "/bird-park",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-colorful-parrots-in-a-tree-41530-large.mp4",
    posterUrl: "/Bird-Park.jpg",
    gridClass: "col-span-1 md:col-start-1 md:col-span-1 md:row-start-3 md:row-span-1 min-h-[260px] md:min-h-[200px]",
  },
  {
    id: "accommodation",
    title: "Accommodation",
    subtitle: "Luxury Stay",
    description:
      "Comfortable resort rooms, villas, and tranquil nature stays amidst dam views.",
    href: "/accommodation",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-swimming-pool-and-palm-trees-41544-large.mp4",
    posterUrl: "/Stay-Facilities.jpg",
    gridClass: "col-span-1 md:col-start-1 md:col-span-1 md:row-start-4 md:row-span-1 min-h-[260px] md:min-h-[200px]",
  },
  {
    id: "boating-park",
    title: "Boating Park",
    subtitle: "Serene Waterways",
    description:
      "Enjoy peaceful pedal boats, family shikara boats, and scenic lake views.",
    href: "/boating-park",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-boat-floating-on-a-lake-41554-large.mp4",
    posterUrl: "/Boating-Park.jpg",
    gridClass: "col-span-1 md:col-start-2 md:col-span-2 md:row-start-3 md:row-span-2 min-h-[260px] md:min-h-[440px]",
  },
];

const Attractions: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* Title with common AnimatedHeading component matching Speciallity.tsx */}
      <AnimatedHeading
        title="Curated Destinations"
        subtitle="Explore our world-class parks and luxury stays crafted for unforgettable family adventures."
      />

      <ScrollReveal direction="up" delay={0.2} duration={0.5}>
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-4 pt-4 md:h-[900px]">
          {attractionsData.map((item) => (
            <ScrollStaggerItem key={item.id} className={`${item.gridClass} h-full`}>
              <Link
                href={item.href}
                className="group relative overflow-hidden rounded-2xl block h-full w-full border border-slate-200/60 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
              >
                {/* Background Video with Poster Fallback */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={item.posterUrl}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src={item.videoUrl} type="video/mp4" />
                </video>

                {/* Bottom to Top Dark Gradient Shadow (0 opacity at top to rich dark gradient at bottom) */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent transition-opacity duration-300 group-hover:from-slate-950/95 group-hover:via-slate-900/50" />

                {/* Top Badge & Action Button */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="text-[11px] font-semibold tracking-wider uppercase bg-amber-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full shadow-xs">
                    {item.subtitle}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-amber-500 group-hover:scale-110">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Bottom Content Container (Title & Short Description) */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end text-white">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-1 group-hover:text-amber-300 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-200 line-clamp-2 leading-relaxed font-normal opacity-90 group-hover:opacity-100 transition-opacity">
                    {item.description}
                  </p>
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
