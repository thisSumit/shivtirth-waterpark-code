"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { InteractiveHoverButton } from "./ui/interactive-hover-button";
import { supabase } from "@/lib/supabase";
import AnimatedHeading from "./ui/AnimatedHeading";
import { ScrollReveal } from "./ui/ScrollReveal";

interface OfferImage {
  src: string;
  alt: string;
  aspectRatio?: number;
}

const DEFAULT_OFFER_ASPECT_RATIO = 16 / 9;

const offers: OfferImage[] = [
  {
    src: "offers/banner4.png",
    alt: "Offer 1",
    aspectRatio: DEFAULT_OFFER_ASPECT_RATIO,
  },
  {
    src: "offers/banner3.jpeg",
    alt: "Offer 2",
    aspectRatio: DEFAULT_OFFER_ASPECT_RATIO,
  },
];

const OfferSection = () => {
  const router = useRouter();
  const [activeOffers, setActiveOffers] = useState<OfferImage[]>(offers);
  const offerTrackRef = useRef<HTMLDivElement | null>(null);

  const scrollOffers = (direction: number) => {
    const container = offerTrackRef.current;
    if (!container) return;

    const firstCard =
      container.querySelector<HTMLElement>("[data-offer-card]");
    if (!firstCard) return;

    const gap = window.innerWidth >= 768 ? 24 : 16;
    const cardWidth = firstCard.getBoundingClientRect().width + gap;

    container.scrollBy({
      left: direction * cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    async function fetchOffers() {
      try {
        const { data } = await supabase
          .from("offers")
          .select("src, alt, aspect_ratio, is_hidden")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (data && data.length > 0) {
          setActiveOffers(
            data.map((item) => ({
              src: item.src,
              alt: item.alt || "",
              aspectRatio:
                Number(item.aspect_ratio) ||
                DEFAULT_OFFER_ASPECT_RATIO,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading offers from Supabase:", err);
      }
    }

    fetchOffers();
  }, []);

  if (activeOffers.length === 0) return null;

  return (
    <section className="w-full bg-background py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <AnimatedHeading
          title="Best Offers"
          subtitle="Exclusive deals and packages tailored for maximum fun and unbeatable value."
        />

        <ScrollReveal direction="up" delay={0.2} duration={0.6}>
          <div className="relative mx-auto w-full max-w-6xl">
            <button
              onClick={() => scrollOffers(-1)}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white md:-left-5 md:p-3"
              aria-label="Previous offer"
            >
              <ChevronLeft
                size={24}
                strokeWidth={2.5}
                className="md:h-7 md:w-7"
              />
            </button>

            <button
              onClick={() => scrollOffers(1)}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-white md:-right-5 md:p-3"
              aria-label="Next offer"
            >
              <ChevronRight
                size={24}
                strokeWidth={2.5}
                className="md:h-7 md:w-7"
              />
            </button>

            <div
              ref={offerTrackRef}
              className="
                flex
                gap-4
                md:gap-6
                overflow-x-auto
                scroll-smooth
                snap-x
                snap-mandatory
                pb-2
                [scrollbar-width:none]
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {activeOffers.map((offer, index) => {
                const imgUrl =
                  offer.src.startsWith("http") ||
                  offer.src.startsWith("/")
                    ? offer.src
                    : `/${offer.src}`;

                return (
                  <div
                    key={`${offer.src}-${index}`}
                    data-offer-card
                    className="
                      group
                      min-w-full
                      snap-center
                      md:min-w-[calc(50%-12px)]
                    "
                  >
                    <div
                      onClick={() => router.push("/offers")}
                      className="
                        relative
                        w-full
                        cursor-pointer
                        overflow-hidden
                        rounded-2xl
                        shadow-md
                        transition-all
                        duration-500
                        hover:-translate-y-2
                        hover:shadow-2xl
                        border
                        border-slate-200/80
                      "
                      style={{
                        aspectRatio:
                          offer.aspectRatio ||
                          DEFAULT_OFFER_ASPECT_RATIO,
                      }}
                    >
                      <Image
                        src={imgUrl}
                        alt={offer.alt}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.4} duration={0.5} className="mt-8 flex justify-center md:mt-12">
          <InteractiveHoverButton
            onClick={() => router.push("/offers")}
          >
            Explore Offers
          </InteractiveHoverButton>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default OfferSection;