"use client";

import React from "react";
import Image from "next/image";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BadgeCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const attractionZones = [
  {
    title: "Water Park & Adishakti Water Fall",
    image: "/Water-Park.jpg",
    description:
      "A fun-filled water experience designed for students with exciting slides, splash zones, rain dance, foam dance and the iconic Adishakti Water Fall.",
  },
  {
    title: "Mowgli Adventure Park",
    image: "/mowgli-adventure.jpg",
    description:
      "An exciting outdoor adventure zone featuring zip lines, rope bridges, obstacle courses, trekking, tree houses and team-building activities.",
  },
  {
    title: "Baliraja Agro & Bird Park",
    image: "/ag4.jpg",
    description:
      "An interactive learning experience where students explore agriculture, nature, plants, birds, farming activities and the surrounding ecosystem.",
  },
  {
    title: "Amusement Park & Boating",
    image: "/amusement.jpg",
    description:
      "Enjoy exciting amusement rides along with optional boating experiences including speed boats, shikara, dragon boats, kayaks and pedal boats.",
  },
];

const schoolPicnicFacilities = [
  "Multi-Park Access – Water Park, Boating, Adventure, Amusement & Bird Park",
  "Hygienic Catering Services",
  "Dedicated Teachers & School Coordinators",
  "CCTV Surveillance & Trained Staff",
  "Lifeguards & First-Aid Support",
  "Games, Treasure Hunts & Group Activities",
  "Easy Parking & Bus Loading/Unloading",
  "Accommodation Options for Overnight Stays",
  "Photography & Dedicated Photo Zones",
];

const schoolPicnicRules = [
  "Mandatory student headcount during entry and activities",
  "Students must remain with their assigned group and teachers",
  "Teachers and group leaders must supervise their students",
  "Proper 100% nylon/lycra swimwear required for water activities",
  "No running, pushing or rough behaviour near pools",
  "Follow all lifeguard, instructor and staff instructions",
  "No outside food inside the park",
  "Inform coordinators about medical requirements in advance",
  "Keep valuables safely inside lockers",
  "Follow all attraction-specific safety instructions",
];

const schoolPicnicFaqs = [
  {
    question: "How many students can visit Shivtirth for a school picnic?",
    answer:
      "Shivtirth can accommodate school groups of different sizes. Groups are coordinated according to student strength, activities and preferred schedule.",
  },
  {
    question: "What activities are available for school students?",
    answer:
      "Students can enjoy Water Park, Adventure Park, Amusement Rides, Bird Park, Agro Park, Boating and various team-building and educational activities.",
  },
  {
    question: "Are overnight stays available for school groups?",
    answer:
      "Yes. Overnight accommodation options include farmhouse bungalows, tents, dormitories and AC rooms, subject to availability.",
  },
  {
    question: "Is Shivtirth safe for school picnics?",
    answer:
      "Yes. Shivtirth provides CCTV surveillance, trained staff, lifeguards, first-aid support and dedicated coordinators for school groups.",
  },
  {
    question: "How can we book a school picnic?",
    answer:
      "Contact the Shivtirth school coordinator with your student strength, preferred date and required activities to plan a suitable package.",
  },
];

const SchoolPicnicPage = () => {
  return (
    <main
      id="school-picnic"
      className="min-h-screen bg-gradient-to-b from-violet-950 via-slate-950 to-indigo-950 text-slate-100"
    >
      {/* ================= HERO ================= */}
      <section className="relative">
        <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
          <Image
            src="/picnic.png"
            alt="Shivtirth School Picnic"
            fill
            className="object-cover object-center"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-black/60 pointer-events-none" />

          <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center">
            <div className="max-w-4xl text-center">

              <h1
                className="text-4xl font-bold text-accent drop-shadow-lg uppercase tracking-wide"
                style={{
                  fontFamily:
                    "'Times New Roman', Times, Georgia, serif",
                }}
              >
                School Picnic
              </h1>

              <p className="mt-2 text-sm text-violet-100/90 drop-shadow-sm font-medium">
                Water Park | Adventure Park | Amusement Park | Agro Park |
                Bird Park | Boating | Team Activities | Educational Experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BOOK NOW ================= */}
      <InteractiveHoverButton
        href="/offers"
        className="text-slate-900 flex fixed bottom-6 left-1/2 -translate-x-1/2 items-center z-50 px-7 py-2.5 shadow-2xl text-xs md:text-sm font-bold"
      >
        BOOK NOW
      </InteractiveHoverButton>

      {/* ================= ATTRACTIONS ================= */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-[#35105f] via-[#673a9e] to-[#16072d] text-white">
        <div className="max-w-6xl mx-auto px-4">

          <ScrollReveal direction="up" delay={0.1}>
            <h2
              className="text-2xl font-bold text-white mb-2"
              style={{
                fontFamily:
                  "'Times New Roman', Times, Georgia, serif",
              }}
            >
              School Picnic Experiences
            </h2>

            <p className="text-violet-100/90 mb-8 text-sm leading-relaxed max-w-2xl">
              A complete school outing combining fun, adventure, education,
              teamwork and memorable experiences in one destination.
            </p>
          </ScrollReveal>

          <div className="space-y-8 md:space-y-10">
            {attractionZones.map((zone, index) => (
              <ScrollReveal
                key={zone.title}
                direction="up"
                delay={0.1}
                duration={0.5}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-violet-300/20">

                  {/* IMAGE */}
                  <div
                    className={`order-1 ${index % 2 === 1 ? "md:order-2" : ""
                      }`}
                  >
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={zone.image}
                        alt={zone.title}
                        fill
                        className="object-cover hover:scale-105 transition duration-500"
                      />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div
                    className={`order-2 ${index % 2 === 1 ? "md:order-1" : ""
                      }`}
                  >
                    <h3
                      className="text-2xl font-bold text-white mb-2"
                      style={{
                        fontFamily:
                          "'Times New Roman', Times, Georgia, serif",
                      }}
                    >
                      {zone.title}
                    </h3>

                    <p className="text-sm text-violet-50 leading-relaxed">
                      {zone.description}
                    </p>
                  </div>

                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FACILITIES & RULES ================= */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <ScrollReveal direction="up" delay={0.2}>

          <div className="grid gap-6 md:grid-cols-2">

            {/* FACILITIES */}
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-violet-100">

              <h3
                className="text-lg md:text-xl font-bold text-slate-900 mb-3"
                style={{
                  fontFamily:
                    "'Times New Roman', Times, Georgia, serif",
                }}
              >
                Facilities
              </h3>

              <ul className="space-y-2.5">
                {schoolPicnicFacilities.map((facility) => (
                  <li
                    key={facility}
                    className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700"
                  >
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-violet-100 text-violet-700 shrink-0">
                      <BadgeCheck className="h-3 w-3" />
                    </span>

                    <span>{facility}</span>
                  </li>
                ))}
              </ul>

            </div>

            {/* RULES */}
            <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-violet-100">

              <h3
                className="text-lg md:text-xl font-bold text-slate-900 mb-3"
                style={{
                  fontFamily:
                    "'Times New Roman', Times, Georgia, serif",
                }}
              >
                Rules & Regulations
              </h3>

              <ul className="space-y-2.5">
                {schoolPicnicRules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700"
                  >
                    <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                      <ShieldCheck className="h-3 w-3" />
                    </span>

                    <span>{rule}</span>
                  </li>
                ))}
              </ul>

            </div>

          </div>

        </ScrollReveal>
      </section>

      {/* ================= FAQ ================= */}
      <section className="mx-auto max-w-6xl px-4 py-6 pb-10">

        <ScrollReveal direction="up" delay={0.25}>

          <div className="rounded-2xl bg-white/95 text-slate-900 p-5 md:p-6 shadow-lg border border-violet-100">

            <h3
              className="text-lg md:text-xl font-bold text-slate-900 mb-3"
              style={{
                fontFamily:
                  "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Frequently Asked Questions
            </h3>

            <Accordion
              type="single"
              collapsible
              className="w-full"
            >
              {schoolPicnicFaqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`school-faq-${index}`}
                  className="border-slate-200"
                >
                  <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-violet-600 text-left">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="text-xs md:text-sm text-slate-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

          </div>

        </ScrollReveal>

      </section>
    </main>
  );
};

export default SchoolPicnicPage;

// import Image from 'next/image';
// import Link from 'next/link';
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import {
//   BadgeCheck,
//   HeartPulse,
//   ShieldCheck,
//   Sparkles,
//   Users,
//   Utensils,
//   Clock3,
//   MapPinned,
//   School,
//   Waves,
//   Trophy,
// } from 'lucide-react';

// const safetyPillars = [
//   {
//     icon: ShieldCheck,
//     title: '100% CCTV & Security Coverage',
//     description:
//       'The entire campus is monitored by surveillance cameras, backed by 24/7 gated entry and night police patrolling for overnight stays.',
//   },
//   {
//     icon: Waves,
//     title: 'Certified Water Lifeguards',
//     description:
//       'Every pool, slide exit, and water fall area is actively supervised by trained lifeguard staff.',
//   },
//   {
//     icon: HeartPulse,
//     title: 'First-Aid & Medical Readiness',
//     description:
//       'On-site first-aid equipment and immediate medical support protocols are in place for emergencies.',
//   },
//   {
//     icon: Utensils,
//     title: 'Hygienic Catering Standards',
//     description:
//       'Meals are freshly prepared in clean kitchens using quality ingredients suitable for school children.',
//   },
//   {
//     icon: Users,
//     title: 'Dedicated School Coordinators',
//     description:
//       'Each school group is assigned a dedicated coordinator to ensure smooth scheduling and headcounts.',
//   },
// ];

// const schoolPicnicFacilities = [
//   'Multi-park Access - Water Park, Boating Park, Adventure Park, Amusement Park, and Bird Park',
//   'Hygienic Catering Services - Pre-planned meals with variety and quality ingredients for students',
//   'Dedicated Teachers & Coordinators - School coordinators assigned for smooth operations',
//   'Safety-First Environment - Full CCTV coverage, lifeguards, first-aid, and trained staff',
//   'Activity Coordination - Games, treasure hunts, group activities, and educational experiences',
//   'Transportation Coordination - Easy parking and loading/unloading zone for bus facilities',
//   'Accommodation Options - For overnight stays: farmhouse bungalows, tents, dormitories, and AC rooms',
//   'Photography & Memories - Designated photo zones and option to capture moments'
// ];

// const schoolPicnicRules = [
//   'Mandatory headcount during entry and after each activity with designated coordinators',
//   'Students must remain with assigned group marshals and staff members at all times',
//   'Teachers and group leaders are responsible for supervising assigned student groups',
//   'Proper swimwear (100% nylon/lycra) required for water activities',
//   'No running, pushing, or rash behavior in pool areas',
//   'Obey all lifeguards, instructors, and park staff instructions immediately',
//   'No outside food; only consume food provided by approved catering',
//   'Students with medical conditions must inform coordinators and carry required documentation',
//   'No mobile phones or valuables allowed; secure lockers available',
//   'Follow all park rules and regulations as displayed at attractions',
//   'Report any injuries, incidents, or concerns to nearest staff member immediately'
// ];

// const schoolPicnicFaqs = [
//   {
//     question: 'How many students can visit Shivtirth for a school picnic?',
//     answer: 'Shivtirth can accommodate groups of any size. We recommend groups of 30-50 students per session for better coordination.'
//   },
//   {
//     question: 'What is the best season for school picnics at Shivtirth?',
//     answer: 'October to March is the best time for school picnics, offering pleasant weather and manageable water temperatures.'
//   },
//   {
//     question: 'Are overnight stay options available for school groups?',
//     answer: 'Yes. We offer farmhouse bungalows, camping tents, dormitory cottages, and AC rooms for overnight school group stays.'
//   },
//   {
//     question: 'What educational activities are available during school visits?',
//     answer: 'We offer nature walks, bird watching, wildlife observation, adventure challenges, team-building activities, and interactive sessions.'
//   },
//   {
//     question: 'How do I book a school picnic at Shivtirth?',
//     answer: 'Contact our school coordinator with your group size, preferred dates, and activities. We\'ll provide customized packages.'
//   }
// ];

// const attractionZones = [
//   {
//     title: 'Water Park & Adishakti Water Fall',
//     image: '/Water-Park.jpg',
//     overview:
//       'A water playground designed for maximum excitement and complete safety across all age groups.',
//     points: [
//       'Multi-play water stations and splash buckets',
//       'Thrill and gentle slides tailored for primary to high school students',
//       'Foam dance, rain guns, rain dance floors, and live DJ music pools',
//       'Adishakti Water Fall with glass flooring, fog, laser lights, and bubble effects',
//     ],
//   },
//   {
//     title: 'Mowgli Adventure Park',
//     image: '/mowgli-adventure.jpg',
//     overview:
//       'Designed to foster physical agility, teamwork, and confidence in students through thrilling outdoor challenges.',
//     points: [
//       'High and low zip lines, tyre bridges, rope bridges, and crawl bridges',
//       'Obstacle courses, net climbing, and commando towers',
//       'Satpuda trekking, net Burma bridge, and hanging bamboo bridges',
//       'Tree houses, 3D shows, and a serene butterfly garden',
//     ],
//   },
//   {
//     title: 'Baliraja Agro & Bird Park',
//     image: '/ag4.jpg',
//     overview:
//       'Bringing textbooks to life by teaching students about nature, agriculture, and ecosystems in an interactive setting.',
//     points: [
//       'Guided tours through crop cultivation fields, flower zones, and kitchen gardens',
//       'Nursery visits focusing on medicinal and botanical plant species',
//       'Hands-on exposure to traditional and modern farming processes',
//       'Automatic weather measuring center, bird safaris, and animal interaction points',
//     ],
//   },
//   {
//     title: 'Amusement Rides & Optional Boating',
//     image: '/amusement.jpg',
//     overview:
//       'A perfect mix of nostalgia, thrilling rides, and optional water adventures for a complete student outing.',
//     points: [
//       'Classic rides including Tora Tora, Break Dance, Columbus, swings, play zones, and selfie spots',
//       'Optional boating add-on with speed boats, shikara, dragon boats, train boats, kayaks, pedal boats, and banana boats',
//       'Multi-activity format suited for all groups and age levels',
//     ],
//   },
// ];

// const dayTourSchedule = [
//   '09:00 AM – 10:00 AM: Arrival, welcome breakfast, fun group games, and Baliraja Agro Park tour.',
//   '10:00 AM – 01:00 PM: Water Park session with slides, rain dance, foam party, and Adishakti Water Fall.',
//   '01:00 PM – 03:00 PM: Unlimited hygienic lunch buffet and relaxation time.',
//   '03:00 PM – 05:00 PM: Mowgli Adventure Park challenges and amusement park rides.',
//   '05:00 PM – 06:00 PM: Evening tea/snacks, group photos, and departure.',
// ];

// const overnightSchedule = [
//   'Day 1 Evening (06:00 PM – 07:00 PM): Room allotment and fresh-up session.',
//   'Day 1 Night (07:00 PM – 11:00 PM): Recreation, team-building games, dinner buffet, night bonfire, and security patrolling.',
//   'Day 2 Morning (06:00 AM – 10:00 AM): Wake-up call, nature trekking, fresh-up, breakfast, and games.',
//   'Day 2 Afternoon (10:00 AM – 06:00 PM): Full access to Water Park, lunch, Mowgli Adventure activities, and final departure.',
// ];

// const teacherPerks = [
//   'Complimentary passes: free entry and meal tickets for teachers and staff (1 free teacher per 15 students)',
//   'Dedicated staff room: relaxed seating area while students enjoy supervised activities',
//   'Custom group discounts: tiered pricing based on total student strength',
//   'Free event planning: assistance with inter-class games, award distribution, or school celebrations',
// ];

// export default function SchoolPicnicPage() {
//   return (
//     <main className="bg-gradient-to-b from-slate-950 via-sky-950 to-slate-950 text-slate-100 min-h-screen">
//       <section className="relative">
//         <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
//           <Image
//             src="/picnic.png"
//             alt="School picnic banner"
//             fill
//             className="object-cover object-center"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/60" />

//           <div className="absolute inset-0 flex items-end justify-center pb-8 px-6">
//             <div className="max-w-4xl text-center">
//               <span className="inline-flex items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 backdrop-blur-sm mb-2">
//                 School Picnics & Adventure Camps
//               </span>
//               <h1 className="text-2xl md:text-4xl font-bold leading-tight text-white drop-shadow-md font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
//                 Central India’s School Picnic & Adventure Destination
//               </h1>
//               <p className="mt-2 max-w-3xl mx-auto text-xs md:text-sm font-normal text-slate-200 leading-relaxed">
//                 Turn your school trip into an unforgettable mix of thrilling water slides, exciting adventure sports, hands-on agro-learning, and 100% safe, hygienic meals.
//               </p>

//               <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
//                 <Link
//                   href="/billing"
//                   className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md transition hover:scale-105 uppercase tracking-wider"
//                 >
//                   Plan School Trip Now
//                 </Link>
//                 <Link
//                   href="tel:+918605362212"
//                   className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 uppercase tracking-wider"
//                 >
//                   Call: +91 8605362212
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Safety Pillars */}
//       <section className="relative z-10 mx-auto -mt-6 w-[94%] max-w-6xl px-2">
//         <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-md p-4 shadow-xl md:grid-cols-5">
//           {safetyPillars.map(({ icon: Icon, title, description }) => (
//             <div
//               key={title}
//               className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left"
//             >
//               <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/20 text-amber-300">
//                 <Icon className="h-4 w-4" />
//               </div>
//               <h3 className="text-xs font-bold text-slate-100 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>{title}</h3>
//               <p className="text-[11px] leading-relaxed text-slate-400">{description}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Attraction Zones */}
//       <section className="mx-auto max-w-6xl px-4 py-12">
//         <div className="mb-8 text-center">
//           <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-400">Core Attraction Zones</p>
//           <h2 className="mt-1 uppercase text-2xl md:text-3xl font-bold text-white font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
//             Learning & Adventure Experience
//           </h2>
//         </div>

//         <div className="space-y-6">
//           {attractionZones.map(({ title, image, overview, points }, index) => (
//             <div
//               key={title}
//               className="overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-md"
//             >
//               <div className="grid items-center gap-0 md:grid-cols-2">
//                 <div className={`relative h-[220px] w-full md:h-full ${index % 2 === 1 ? 'md:order-2' : ''}`}>
//                   <Image src={image} alt={title} fill className="object-cover" />
//                 </div>

//                 <div className={`p-5 md:p-6 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
//                   <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
//                     <Sparkles className="h-3 w-3" />
//                     Zone {index + 1}
//                   </div>
//                   <h3 className="text-lg md:text-xl font-bold text-white font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>{title}</h3>
//                   <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{overview}</p>

//                   <ul className="mt-4 space-y-2">
//                     {points.map((point) => (
//                       <li key={point} className="flex items-start gap-2 text-xs text-slate-300">
//                         <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 shrink-0">
//                           <BadgeCheck className="h-2.5 w-2.5" />
//                         </span>
//                         <span>{point}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Schedules */}
//       <section className="bg-slate-950 py-12 text-white border-y border-slate-800">
//         <div className="mx-auto max-w-6xl px-4">
//           <div className="mb-8 text-center">
//             <h2 className="uppercase text-2xl md:text-3xl font-bold text-amber-400 font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
//               Package Schedules
//             </h2>
//           </div>

//           <div className="grid gap-6 lg:grid-cols-2">
//             <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
//               <div className="mb-4 flex items-center gap-2.5">
//                 <Clock3 className="h-5 w-5 text-amber-400" />
//                 <h3 className="text-base font-bold text-white font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>Day Tour Itinerary (9:00 AM – 6:00 PM)</h3>
//               </div>
//               <ul className="space-y-3">
//                 {dayTourSchedule.map((item) => (
//                   <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
//                     <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 shrink-0">
//                       <MapPinned className="h-2.5 w-2.5" />
//                     </span>
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
//               <div className="mb-4 flex items-center gap-2.5">
//                 <School className="h-5 w-5 text-amber-400" />
//                 <h3 className="text-base font-bold text-white font-times" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>Overnight Camp (2 Days / 1 Night)</h3>
//               </div>
//               <ul className="space-y-3">
//                 {overnightSchedule.map((item) => (
//                   <li key={item} className="flex items-start gap-2 text-xs text-slate-300">
//                     <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20 text-amber-300 shrink-0">
//                       <Trophy className="h-2.5 w-2.5" />
//                     </span>
//                     <span>{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Facilities & Rules */}
//       <section className="mx-auto max-w-6xl px-4 pt-6">
//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="rounded-2xl bg-white text-slate-900 p-5 shadow-lg border border-slate-200">
//             <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>Facilities</h3>
//             <ul className="space-y-2.5">
//               {schoolPicnicFacilities.map((facility) => (
//                 <li key={facility} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
//                   <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-100 text-amber-700 shrink-0">
//                     <BadgeCheck className="h-3 w-3" />
//                   </span>
//                   <span>{facility}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="rounded-2xl bg-white text-slate-900 p-5 shadow-lg border border-slate-200">
//             <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>Rules & Regulations</h3>
//             <ul className="space-y-2.5">
//               {schoolPicnicRules.map((rule) => (
//                 <li key={rule} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-700">
//                   <span className="mt-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shrink-0">
//                     <ShieldCheck className="h-3 w-3" />
//                   </span>
//                   <span>{rule}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="mx-auto max-w-6xl px-4 py-6 pb-10">
//         <div className="rounded-2xl bg-white text-slate-900 p-5 md:p-6 shadow-lg border border-slate-200">
//           <h3 className="text-lg md:text-xl font-bold text-slate-900 font-times mb-3" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>Frequently Asked Questions</h3>
//           <Accordion type="single" collapsible className="w-full">
//             {schoolPicnicFaqs.map((faq, idx) => (
//               <AccordionItem key={idx} value={`school-faq-${idx}`} className="border-slate-200">
//                 <AccordionTrigger className="text-xs md:text-sm font-semibold text-slate-900 hover:text-amber-600 text-left">{faq.question}</AccordionTrigger>
//                 <AccordionContent className="text-xs md:text-sm text-slate-600 leading-relaxed">{faq.answer}</AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </div>
//       </section>
//     </main>
//   );
// }
