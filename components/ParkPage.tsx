"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

type ParkItem = {
  name: string;
  image: string;
  description: string;
  features: string[];
  href?: string;
};

const parks: ParkItem[] = [
  // {
  //   name: "Agro Park",
  //   image: "/ag4.jpg",
  //   description:
  //     "Trade the city noise for the scent of fresh soil and endless horizons. Dive into an authentic farm life experience where tradition meets nature, offering you the ultimate soul-recharging escape amidst our lush, vibrant plantations.",
  //   features: [
  //     "Kitchen Garden",
  //     "Fruit Orchards",
  //     "Rural Games",
  //     "Traditional Equipment",
  //     "Exotic Plants",
  //     "Irrigation & Farming Techniques",
  //   ],
  // },
  // {
  //   name: "Air Tourism (Helicopter Ride)",
  //   image: "/air-tourism.jpg",
  //   description:
  //     "Soar above the skies of Nagpur with breathtaking helicopter tours at Shivtirth - an adventure like no other. Take your thrill to new heights with Shivtirth Air Tourism Experience. A 25 km helicopter ride that reveals Nagpur's breathtaking beauty from the sky.",
  //   features: [
  //     "25 km Panoramic Flight",
  //     "Family-Friendly Adventure",
  //     "Aerial Photography",
  //     "Bird's-Eye City Views",
  //   ],
  // },
  // {
  //   name: "Accommodation (Stay Facilities)",
  //   image: "/Stay-Facilities.jpg",
  //   description:
  //     "Extend your stay with peaceful farmhouse bungalows, dormitory cottages, camping tents, and AC rooms equipped with modern amenities, bonfire nights, and 24/7 security.",
  //   features: [
  //     "Farmhouse Bungalows",
  //     "Dormitory Cottages",
  //     "Camping Tents",
  //     "AC Rooms",
  //     "24/7 Security",
  //     "Night Bonfire & Dining",
  //   ],
  //   href: "/accommodation",
  // },
  // {
  //   name: "Wedding Celebrations",
  //   image: "/wedding-1.jpg",
  //   description:
  //     'Exchange your vows where the horizon meets the water. From breathtaking lakeside views to lush garden ceremonies, we transform your "I Do" into a grand, multi-sensory experience. Whether it is a vibrant Haldi by the pool or a starlit reception in the wild, our dedicated team handles every detail so you can focus on the magic of the moment.',
  //   features: [
  //     "Wedding Functions",
  //     "Receptions",
  //     "Pre-wedding Shoots",
  //     "Birthday Events",
  //     "Anniversaries",
  //     "Festival Celebrations",
  //   ],
  // },
  // {
  //   name: "Corporate Events",
  //   image: "/corperate.webp",
  //   description:
  //     "Break the boardroom walls and ignite your team's potential in a landscape designed for high-impact engagement. From high-energy team-building challenges to sophisticated open-air conferences, we provide a seamless blend of professional excellence and adventurous spirit. Whether it is a strategy retreat or an annual celebration, we deliver the perfect environment to recharge, reconnect, and hit your next milestone.",
  //   features: [
  //     "Team Outings",
  //     "Corporate Parties",
  //     "Workshops",
  //     "Team Building Activities",
  //     "Conference Setup",
  //   ],
  // },
  // {
  //   name: "Birthday Parties",
  //   image: "/birthday-1.jpg",
  //   description:
  //     "Why settle for a room when you can have a whole park? Turn your special day into a legendary celebration where every moment is a thrill. From high-energy water splashes to vibrant outdoor setups, we create the ultimate party atmosphere that blends adventure with celebration. Whether it is your 10th or your 25th, we bring the vibes, the cake, and the non-stop fun!",
  //   features: [
  //     "Theme Decorations",
  //     "Fun Activities",
  //     "Custom Cakes",
  //     "Music & Entertainment",
  //     "Group Packages",
  //   ],
  // },
  // {
  //   name: "Festive Celebrations",
  //   image: "/festival-celebration.jpeg",
  //   description:
  //     "Do not just mark the calendar - live the moment. From the high-energy colors of Holi to the sparkling magic of Diwali, we transform traditional festivals into immersive, larger-than-life experiences. Feel the pulse of the music, the warmth of the community, and the thrill of the park all coming together in one vibrant explosion of joy. Whether it is a family gathering or a massive public event, we bring the soul to your celebrations.",
  //   features: [
  //     "Holi Celebration",
  //     "Festival Events",
  //     "Live Entertainment",
  //     "Special Decorations",
  //     "Seasonal Activities",
  //     "Group Celebrations",
  //   ],
  // },
  // {
  //   name: "Event Planning",
  //   image: "/custom-events.png",
  //   description:
  //     "Stop searching for the perfect venue and start creating it. Whether it is a bespoke private gala, a niche themed festival, or a one-of-a-kind milestone celebration, our dedicated planning team turns your wildest ideas into a seamless reality. From the first sketch to the final firework, we customize every detail - decor, dining, and thrills - to reflect your unique story in a setting that defies the ordinary.",
  //   features: [
  //     "Custom Themes",
  //     "Event Setup",
  //     "Entertainment Planning",
  //     "Food Arrangements",
  //     "End-to-End Management",
  //   ],
  // },
];

const getParkSectionId = (name: string) => {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export const ParkPage = () => {
  const [activeParks, setActiveParks] = useState<ParkItem[]>(parks);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data, error } = await supabase
          .from("activities")
          .select("title, image, description, features, is_hidden")
          .eq("is_hidden", false)
          .order("display_order", { ascending: true });

        if (error) {
          console.error("Error loading activities:", error);
          return;
        }

        if (data && data.length > 0) {
          const dbParks: ParkItem[] = data.map((item) => ({
            name: item.title || "",
            image: item.image || "",
            description: item.description || "",
            features: Array.isArray(item.features) ? item.features : [],
            href: item.title?.toLowerCase().includes("accommodation")
              ? "/accommodation"
              : undefined,
          }));

          const merged = [...parks];

          dbParks.forEach((dbItem) => {
            const index = merged.findIndex(
              (park) =>
                park.name.toLowerCase().trim() ===
                dbItem.name.toLowerCase().trim()
            );

            if (index !== -1) {
              merged[index] = {
                ...merged[index],
                image: dbItem.image || merged[index].image,
                description:
                  dbItem.description || merged[index].description,
                features:
                  dbItem.features.length > 0
                    ? dbItem.features
                    : merged[index].features,
                href: dbItem.href || merged[index].href,
              };
            } else {
              merged.push(dbItem);
            }
          });

          setActiveParks(merged);
        }
      } catch (err) {
        console.error("Error loading activities from Supabase:", err);
      }
    }

    fetchActivities();
  }, []);

  return (
    <main
      id="parks-experiences"
      className="min-h-screen bg-gradient-to-b from-[#8ECAE6] via-[#219EBC] to-[#023047] text-slate-900"
    >
      {/* ================= HERO ================= */}
      <section className="relative">
        <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
          <Image
            src="/park-experience.png"
            alt="Parks and experiences background"
            fill
            className="object-cover object-center"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#023047] via-[#023047]/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center">
            <div className="max-w-4xl text-center">
              <h1
                className="text-2xl md:text-4xl font-bold text-amber-400 drop-shadow-lg uppercase tracking-wide"
                style={{
                  fontFamily:
                    "'Times New Roman', Times, Georgia, serif",
                }}
              >
                Parks & Experiences
              </h1>

              <p className="mt-2 text-xs md:text-sm text-cyan-100/90 drop-shadow-sm font-medium">
                Water Park | Adventure Park | Amusement Park | Agro Park |
                Bird Park | Boating | Air Tourism | Accommodation | Events
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PARKS SECTION ================= */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#004e64] via-[#219EBC] to-[#003440] text-white">
        <div className="max-w-6xl mx-auto px-4">
          {/* SECTION HEADING */}
          <ScrollReveal direction="up" delay={0.1}>
            <h2
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              style={{
                fontFamily:
                  "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Parks & Experiences
            </h2>

            <p className="text-cyan-100/90 mb-8 text-xs md:text-sm leading-relaxed max-w-2xl">
              Explore exciting attractions, entertainment experiences,
              adventure activities and memorable moments at Shivtirth.
            </p>
          </ScrollReveal>

          {/* PARK LIST */}
          <div className="space-y-8 md:space-y-10">
            {activeParks.map((park, idx) => (
              <ScrollReveal
                key={park.name}
                direction="up"
                delay={0.1}
                duration={0.6}
              >
                <div
                  id={getParkSectionId(park.name)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-cyan-400/20"
                >
                  {/* IMAGE */}
                  <div
                    className={`order-1 ${idx % 2 === 1 ? "md:order-2" : "md:order-1"
                      }`}
                  >
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={park.image}
                        alt={park.name}
                        fill
                        className="object-cover object-center hover:scale-105 transition duration-500"
                        sizes="(min-width: 768px) 50vw, 100vw"
                        priority={idx === 0}
                      />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div
                    className={`order-2 ${idx % 2 === 1 ? "md:order-1" : "md:order-2"
                      }`}
                  >
                    <h3
                      className="text-lg md:text-xl font-bold text-amber-300 mb-2"
                      style={{
                        fontFamily:
                          "'Times New Roman', Times, Georgia, serif",
                      }}
                    >
                      {park.name}
                    </h3>

                    <p className="text-xs md:text-sm text-cyan-50 leading-relaxed font-normal">
                      {park.description}
                    </p>

                    {/* DATABASE FEATURES */}
                    {park.features && park.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {park.features.map((feature, fIdx) => (
                          <span
                            key={`${park.name}-feature-${fIdx}`}
                            className="inline-block px-2 py-1 bg-amber-50 border border-amber-300/60 rounded-full text-xs font-semibold text-slate-800 hover:bg-amber-100 transition"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* BUTTONS */}
                    <div className="flex flex-wrap gap-3 pt-3">
                      {park.href ? (
                        <Link
                          href={park.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-amber-500 transition shadow-md"
                        >
                          View Accommodation Stay
                        </Link>
                      ) : null}

                      <Link
                        href="tel:+918605362212"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-amber-500 hover:text-slate-950 transition shadow-md"
                      >
                        Call to Plan
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOTTOM ================= */}
      <div className="h-10 bg-[#023047]" />
    </main>
  );
};

export default ParkPage;