'use client';
import React, { useState, useEffect } from 'react';
import Description from "@/components/Description";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";
import { supabase } from "@/lib/supabase";

const parks = [
  // {
  //   name: "Water Park",
  //   image: "/Water-Park.jpg",
  //   description: "Dive into an action-packed water world with high-thrill slides, massive pools, and immersive splash zones, all designed for ultimate fun with top-notch safety.",
  //   features: ["8 Water Pools", "Grand Waterfall", "Rappelling", "High-Thrill Slides", "Foam Dance Arena", "Rain Dance Zones"],
  // },
  // {
  //   name: "Amusement Park",
  //   image: "/a5.jpeg",
  //   description: "Feel the adrenaline rush with electrifying rides, vibrant attractions, and non-stop entertainment designed to thrill every moment.",
  //   features: ["Tora Tora Ride", "Columbus Ride", "High Swing", "Round Swing", "Jumper Ride", "Kids Play Zone", "Shooting Games"],
  // },
  // {
  //   name: "Adventure Park",
  //   image: "/Adventure-Park.jpg",
  //   description: "Unleash your inner explorer with Mowgli-inspired adventures packed with adrenaline, challenges, and unforgettable outdoor experiences.",
  //   features: ["Zip Line", "Rope Bridges", "Obstacle Courses", "Burma Bridges", "Net Climbing", "Commando Tower", "Target Shooting", "Tree House", "3D Experience", "Butterfly Garden"],
  // },
  // {
  //   name: "Boating Park",
  //   image: "/Boating-Park.jpg",
  //   description: "Sail through excitement with a wide range of boating adventures, combining scenic beauty with thrilling water experiences.",
  //   features: ["Banana Boat", "Speed Boat", "Shikara Ride", "Dragon Boat", "Sofa Boat", "Train Boat", "Octopus Ride", "Disco Boat", "Zorbing Ball", "Mini Cruise"],
  // },
  {
    name: "Bird Park",
    image: "/Bird-Park.jpg",
    description: "Leave the ordinary behind and step into a lush, interactive sanctuary. Shivtirth Bird Park is more than just a habitat - it is a journey designed to bring you face-to-face with the wild. From the graceful glide of swans to the playful hops of our furry residents, discover a peaceful haven where you can experience a rare, hand-in-hand connection with nature's most beautiful creatures.",
    features: ["Swan Feeding", "Duck Feeding", "Guinea Fowl", "Pigeons", "Love Birds", "Roosters", "Rabbits", "Turkey", "Exotic Birds", "Sheep & More"],
  },
  {
    name: "Agro Park",
    image: "/ag4.jpg",
    description: "Trade the city noise for the scent of fresh soil and endless horizons. Dive into an authentic farm life experience where tradition meets nature, offering you the ultimate soul-recharging escape amidst our lush, vibrant plantations.",
    features: ["Kitchen Garden", "Fruit Orchards", "Rural Games", "Traditional Equipment", "Exotic Plants", "Irrigation & Farming Techniques"],
  },
  {
    name: "Air Tourism (Helicopter Ride)",
    image: "/air-tourism.jpg",
    description: "Soar above the skies of Nagpur with breathtaking helicopter tours at Shivtirth - an adventure like no other. Take your thrill to new heights with Shivtirth Air Tourism Experience. A 25 km helicopter ride that reveals Nagpur's breathtaking beauty from the sky.",
    features: ["25 km Panoramic Flight", "Family-Friendly Adventure", "Aerial Photography", "Bird's-Eye City Views"],
  },
  // {
  //   name: "Safari",
  //   image: "/safari-1.jpg",
  //   description: "Forget the zoo - experience the pulse-pounding heart of the wild. Our Safari Expedition takes you deep into a rugged habitat where every turn reveals a new wonder. Whether you are chasing the sunset or spotting majestic wildlife, it is a high-octane, off-road journey designed for the brave and the curious.",
  //   features: ["Jungle Gypsy Safari", "Tractor Safari", "Train Safari (Shivapuri)", "Shivshahi Bus Safari", "Bullock Cart Safari"],
  // },
  // {
  //   name: "Stay Facilities",
  //   image: "/farmhouse.png",
  //   description: "Why let the fun end at sunset? Trade the long drive home for a night under the stars. From cozy, rustic stays to premium comfort, our facilities are designed to let you recharge in the heart of nature. Wake up to the sound of birds and the fresh scent of the wild - your ultimate staycation starts here.",
  //   features: ["Farmhouse Bungalows", "Dormitory Cottages", "Camping Tents", "AC Rooms"],
  // },
  // {
  //   name: "Dining",
  //   image: "/Dining-Image.jpeg",
  //   description: "Refuel your body and treat your taste buds to a culinary journey like no other. From authentic local delicacies to popular global favorites, our dining experience is the perfect break between thrills. Whether it is a quick snack to keep you going or a hearty meal with the whole family, we serve every dish with a side of spectacular views.",
  //   features: ["Family Dining", "Cafeteria", "Specialty Beverages", "Vegetarian Options", "Kids Menu", "Outdoor Seating"],
  // },
  // {
  //   name: "School & College Picnics",
  //   image: "/s1.jpg",
  //   description: "Elevate the classroom to the great outdoors! We specialize in creating high-energy, perfectly organized picnic experiences that balance heart-pounding thrills with meaningful team-building. From safety-first water adventures to educational nature trails, we provide a secure environment where students can bond, learn, and create stories that will last a lifetime.",
  //   features: ["School Trips", "College Picnics", "Group Activities", "Educational Tours", "Safe Supervision"],
  // },
  {
    name: "Wedding Celebrations",
    image: "/wedding-1.jpg",
    description: "Exchange your vows where the horizon meets the water. From breathtaking lakeside views to lush garden ceremonies, we transform your \"I Do\" into a grand, multi-sensory experience. Whether it is a vibrant Haldi by the pool or a starlit reception in the wild, our dedicated team handles every detail so you can focus on the magic of the moment.",
    features: ["Wedding Functions", "Receptions", "Pre-wedding Shoots", "Birthday Events", "Anniversaries", "Festival Celebrations"],
  },
  {
    name: "Corporate Events",
    image: "/corperate.webp",
    description: "Break the boardroom walls and ignite your team's potential in a landscape designed for high-impact engagement. From high-energy team-building challenges to sophisticated open-air conferences, we provide a seamless blend of professional excellence and adventurous spirit. Whether it is a strategy retreat or an annual celebration, we deliver the perfect environment to recharge, reconnect, and hit your next milestone.",
    features: ["Team Outings", "Corporate Parties", "Workshops", "Team Building Activities", "Conference Setup"],
  },
  {
    name: "Birthday Parties",
    image: "/birthday-1.jpg",
    description: "Why settle for a room when you can have a whole park? Turn your special day into a legendary celebration where every moment is a thrill. From high-energy water splashes to vibrant outdoor setups, we create the ultimate party atmosphere that blends adventure with celebration. Whether it is your 10th or your 25th, we bring the vibes, the cake, and the non-stop fun!",
    features: ["Theme Decorations", "Fun Activities", "Custom Cakes", "Music & Entertainment", "Group Packages"],
  },
  {
    name: "Festive Celebrations",
    image: "/festival-celebration.jpeg",
    description: "Do not just mark the calendar - live the moment. From the high-energy colors of Holi to the sparkling magic of Diwali, we transform traditional festivals into immersive, larger-than-life experiences. Feel the pulse of the music, the warmth of the community, and the thrill of the park all coming together in one vibrant explosion of joy. Whether it is a family gathering or a massive public event, we bring the soul to your celebrations.",
    features: ["Holi Celebration", "Festival Events", "Live Entertainment", "Special Decorations", "Seasonal Activities", "Group Celebrations"],
  },
  {
    name: "Event Planning",
    image: "/custom-events.png",
    description: "Stop searching for the perfect venue and start creating it. Whether it is a bespoke private gala, a niche themed festival, or a one-of-a-kind milestone celebration, our dedicated planning team turns your wildest ideas into a seamless reality. From the first sketch to the final firework, we customize every detail - decor, dining, and thrills - to reflect your unique story in a setting that defies the ordinary.",
    features: ["Custom Themes", "Event Setup", "Entertainment Planning", "Food Arrangements", "End-to-End Management"],
  }
];

const getParkSectionId = (name: string) => {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export const ParkPage = () => {
  const [activeParks, setActiveParks] = useState(parks);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const { data } = await supabase
          .from('activities')
          .select('title, image, description, features, is_hidden')
          .eq('is_hidden', false)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) {
          const dbParks = data.map((item) => ({
            name: item.title,
            image: item.image,
            description: item.description,
            features: Array.isArray(item.features) ? item.features : [],
          }));

          const merged = [...parks];
          dbParks.forEach((dbItem) => {
            const index = merged.findIndex(
              (p) => p.name.toLowerCase().trim() === dbItem.name.toLowerCase().trim()
            );
            if (index !== -1) {
              merged[index] = {
                ...merged[index],
                image: dbItem.image || merged[index].image,
                description: dbItem.description || merged[index].description,
                features: dbItem.features.length > 0 ? dbItem.features : merged[index].features,
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
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900">
      <div className="relative">
        <div className="relative h-[56vh] md:h-[72vh] overflow-hidden">
          <Image src="/park-experience.png" alt="Parks and experiences background" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-12 md:bottom-20 px-6 flex justify-center text-center">
            <div className="max-w-3xl text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold text-xs uppercase tracking-wider mb-3 backdrop-blur-md">
                Parks & Experiences
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg uppercase tracking-wide">
                Nagpur’s Ultimate Fun Destination
              </h1>
              <p className="mt-3 text-sm md:text-lg text-white/90 drop-shadow-md leading-relaxed font-medium">
                Get Shivtirth non-stop excitement at Shivtirth Water Park, packed with thrilling rides, scenic spaces, and endless entertainment.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 -mt-8" />
      </div>

      {/* <Description/> */}

      {/* Parks List */}
      <section className="max-w-7xl mx-auto px-2 md:px-4 py-10 md:py-12 space-y-6 md:space-y-7">
        {activeParks.map((park, idx) => (
          <div
            key={park.name}
            id={getParkSectionId(park.name)}
            className="grid grid-cols-1 md:grid-cols-2 items-stretch gap-0 rounded-3xl bg-white shadow-2xl overflow-hidden"
          >
            <div
              className={`relative w-full aspect-square overflow-hidden order-1 ${idx % 2 === 1 ? "md:order-2" : "md:order-1"
                }`}
            >
              <Image
                src={park.image}
                alt={park.name}
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={idx === 0}
              />
            </div>

            <div
              className={`space-y-3 md:space-y-4 order-2 px-5 md:px-8 py-5 md:py-6 self-center ${idx % 2 === 1 ? "md:order-1" : "md:order-2"
                }`}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                Featured Park
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                {park.name}
              </h2>
              <p className="text-base md:text-lg text-slate-700 leading-relaxed">
                {park.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {park.features && park.features.map((feature, fIdx) => (
                  <span key={fIdx} className="inline-block px-2.5 py-1 bg-linear-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-full text-xs md:text-sm font-semibold text-slate-700 hover:bg-accent/30 transition">
                    {feature}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="tel:+918275737579"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 text-slate-800 font-semibold hover:bg-accent/20 transition"
                >
                  Call to Plan
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default ParkPage