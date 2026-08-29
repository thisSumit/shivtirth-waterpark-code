"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Sparkles, Play, X, Image as ImageIcon, Video, Filter } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import OfferSection from "@/components/OfferSection";

type GalleryItem = {
  id: string;
  type: "image" | "video";
  src: string;
  category: string;
  title: string;
  is_hidden?: boolean;
};

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "1", type: "image", src: "/waterpark-1.jpg", category: "water-park", title: "Wave Pool & Splash Zone" },
  { id: "2", type: "image", src: "/Boating-Park.jpg", category: "boating-park", title: "Vidarbha Boating Rides" },
  { id: "3", type: "image", src: "/Bird-Park.jpg", category: "attractions", title: "Exotic Bird Aviary" },
  { id: "4", type: "image", src: "/Stay-Facilities.jpg", category: "stay", title: "Overnight Camping Tents" },
  { id: "5", type: "image", src: "/ag4.jpg", category: "agro-park", title: "Agro Plantation Walk" },
  { id: "6", type: "image", src: "/festival-celebration.jpeg", category: "events", title: "Festive Holi Celebrations" },
  { id: "7", type: "image", src: "/custom-events.png", category: "events", title: "Event & Party Setup" },
  { id: "8", type: "image", src: "/farmhouse.png", category: "stay", title: "Farmhouse Bungalow Lawn" },
  { id: "9", type: "image", src: "/g8.png", category: "water-park", title: "High-Speed Water Slides" },
  { id: "10", type: "image", src: "/g10.png", category: "water-park", title: "Family Fun Pool" },
  { id: "11", type: "video", src: "/ov2.MP4", category: "videos", title: "Park Thrills & Highlights" },
];

const BASE_CATEGORIES = [
  { id: "all", label: "All Media" },
  { id: "water-park", label: "Water Park" },
  { id: "boating-park", label: "Boating" },
  { id: "attractions", label: "Attractions" },
  { id: "stay", label: "Stay & Camping" },
  { id: "events", label: "Events & Festivals" },
  { id: "videos", label: "Videos" },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(DEFAULT_GALLERY);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: GalleryItem[] = data.map((g: any) => ({
            id: g.id,
            type: g.type === "video" ? "video" : "image",
            src: g.src,
            category: g.category || "water-park",
            title: g.title || "Shivtirth Experience",
            is_hidden: !!g.is_hidden,
          }));
          setItems(mapped);
        }
      } catch (err) {
        console.error("Error loading gallery from Supabase:", err);
      }
    }
    fetchGallery();
  }, []);

  // Dynamically compute filter tabs including any custom category created by Admin
  const dynamicCategories = useMemo(() => {
    const existingIds = BASE_CATEGORIES.map(c => c.id);
    const customCategoriesFromDb = Array.from(
      new Set(items.map(item => item.category).filter(Boolean))
    ).filter(cat => !existingIds.includes(cat));

    const tabs = [...BASE_CATEGORIES];
    customCategoriesFromDb.forEach(cat => {
      tabs.push({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
      });
    });

    return tabs;
  }, [items]);

  const filteredItems = selectedCategory === "all"
    ? items
    : items.filter((item) => item.category === selectedCategory || (selectedCategory === "videos" && item.type === "video"));

  const getImageSrc = (src: string) => {
    if (!src) return "/waterpark-1.jpg";
    if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
      return src;
    }
    return `/${src}`;
  };

  return (
    <main id="about-park" className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
          <Image
            src="/g8.png"
            alt="Shivtirth Gallery & Moments"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-12 md:bottom-20 px-6 flex justify-center pointer-events-none">
            <div className="max-w-3xl text-center">
              <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg uppercase tracking-tight">
                Photo & Video Gallery
              </h1>
              <p className="mt-3 text-sm md:text-lg text-white/90 drop-shadow-sm leading-relaxed">
                Explore glimpses of pure joy, high-thrill water slides, peaceful nature stays, and vibrant celebrations at Shivtirth Water Park.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Book Now Button */}
      <InteractiveHoverButton
        href={"/offers"}
        className="flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center z-20 px-8 py-3"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* Filter Tabs & Gallery Grid Section */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Explore Our Showcase
            </h2>
            <p className="text-slate-600 mt-2 text-base md:text-lg leading-snug">
              Filter media by category to preview rides, water slides, stay facilities, and festive celebrations.
            </p>
          </div>

          {/* Dynamic Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            <Filter size={18} className="text-amber-500 shrink-0 ml-1 mr-2 hidden md:block" />
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition shrink-0 border ${selectedCategory === cat.id
                  ? "bg-accent text-black border-accent shadow-md font-black"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400 font-bold"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Media Masonry Grid */}
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No media items found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  className="group relative aspect-[4/3] bg-slate-100 border border-slate-200 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:border-amber-400 transition duration-300"
                >
                  {item.type === "video" ? (
                    <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
                      <video
                        src={getImageSrc(item.src)}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition">
                        <div className="w-12 h-12 rounded-full bg-accent text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                          <Play size={20} className="fill-black ml-1" />
                        </div>
                      </div>
                      <span className="absolute top-3 right-3 bg-black/70 text-accent font-bold text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-800">
                        <Video size={12} /> Video
                      </span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <Image
                        src={getImageSrc(item.src)}
                        alt={item.title || "Gallery image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 right-3 bg-black/70 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full flex items-center gap-1 border border-slate-800">
                        <ImageIcon size={12} /> Photo
                      </span>
                    </div>
                  )}

                  {/* Overlay Title */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <p className="text-xs font-bold text-white uppercase tracking-wider leading-snug drop-shadow">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
        >
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2.5 rounded-full bg-black/60 border border-slate-700 transition z-50"
          >
            <X size={24} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-4"
          >
            {lightboxItem.type === "video" ? (
              <video
                src={getImageSrc(lightboxItem.src)}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] rounded-3xl border border-slate-700 shadow-2xl"
              />
            ) : (
              <div className="relative w-full h-[65vh] md:h-[75vh]">
                <Image
                  src={getImageSrc(lightboxItem.src)}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-sm md:text-base font-bold text-white uppercase tracking-wider text-center bg-black/80 border border-slate-700 px-6 py-2.5 rounded-full shadow-lg">
              {lightboxItem.title}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
