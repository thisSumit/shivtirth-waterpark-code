import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  MapPin,
  ShieldCheck,
  Leaf,
  GraduationCap,
  Waves,
  Mountain,
  Users,
  Trophy,
  Heart,
  Sparkles,
  TreePine,
  Building2,
  Star,
} from "lucide-react";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Logos from "@/components/Logos";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";
import Testimonials from "@/components/Testimonials";

export const metadata: Metadata = {
  title: "About Shivtirth | Best Water Park & Picnic Spot in Nagpur",
  description:
    "Discover Shivtirth Best Water Park and Picnic Spot in Nagpur. Explore our water park, boating, adventure, amusement, agro and nature experiences surrounded by the Satpuda mountain range.",
  keywords: [
    "Shivtirth",
    "Shivtirth Water Park",
    "best water park in Nagpur",
    "picnic spot near Nagpur",
    "school picnic Nagpur",
    "water park near Nagpur",
    "amusement park Nagpur",
    "adventure park Nagpur",
    "boating park Nagpur",
    "family picnic spot Nagpur",
  ],
  openGraph: {
    title: "About Shivtirth | Best Water Park & Picnic Spot in Nagpur",
    description:
      "Discover Shivtirth – a unique destination for water, adventure, amusement, agriculture, nature, learning and unforgettable memories.",
    siteName: "Shivtirth Best Water Park",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const highlights = [
  {
    number: "100K+",
    title: "Happy People",
    icon: Users,
    bg: "from-cyan-50 to-sky-100",
    border: "border-cyan-200",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-700",
  },
  {
    number: "150+",
    title: "Activities",
    icon: Sparkles,
    bg: "from-emerald-50 to-teal-100",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    number: "4.7",
    title: "Google Rating",
    icon: Star,
    bg: "from-orange-50 to-yellow-100",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
  },
  {
    number: "17K+",
    title: "Reviews",
    icon: Heart,
    bg: "from-pink-50 to-rose-100",
    border: "border-pink-200",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-700",
  },
];

const experiences = [
  {
    icon: Waves,
    title: "Aqua",
    description:
      "Enjoy exciting water pools, slides, waterfalls, rain dances and splash experiences designed for refreshing family fun.",
  },
  {
    icon: Mountain,
    title: "Adventure",
    description:
      "Experience outdoor adventure activities that encourage courage, confidence, teamwork and exploration.",
  },
  {
    icon: TreePine,
    title: "Agro & Nature",
    description:
      "Explore agriculture, plantations, gardens, birds, nature and hands-on learning experiences surrounded by greenery.",
  },
  {
    icon: Sparkles,
    title: "Amusement",
    description:
      "Enjoy entertaining rides and activities that bring together children, families, students and groups.",
  },
  {
    icon: Building2,
    title: "Events",
    description:
      "A versatile destination for birthdays, weddings, anniversaries, corporate events, school trips and celebrations.",
  },
];

const facilities = [
  "Clean and family-friendly water park environment",
  "Food and catering facilities",
  "Locker facilities for personal belongings",
  "Safety and trained staff support",
  "Water, adventure and amusement activities",
  "School picnic and educational tour arrangements",
  "Group picnic and corporate event facilities",
  "Wedding, birthday and celebration arrangements",
];

const reasons = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "Safety, trained staff and responsible operations remain at the heart of every visitor experience.",
  },
  {
    icon: Leaf,
    title: "Nature Connected",
    description:
      "Enjoy recreation surrounded by forests, plantations, mountains, valleys and the peaceful dam environment.",
  },
  {
    icon: GraduationCap,
    title: "Learning Through Experience",
    description:
      "Our destination combines recreation with agriculture, nature and educational experiences for students.",
  },
  {
    icon: Users,
    title: "For Everyone",
    description:
      "Families, children, schools, corporates, groups and senior visitors can all find experiences suited to them.",
  },
];

const affiliations = [
  {
    icon: BadgeCheck,
    title: "ISO 9001:2015 Certified",
    description:
      "For maintaining high standards in safety and service quality.",
    bg: "from-blue-50 to-cyan-100",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-700",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Tourism",
    description:
      "Focused on sustainable and nature-based recreation and tourism.",
    bg: "from-emerald-50 to-teal-100",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
  },
  {
    icon: GraduationCap,
    title: "Educational Destination",
    description:
      "Designed to support school and college educational visits and learning experiences.",
    bg: "from-purple-50 to-violet-100",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-700",
  },
  {
    icon: Trophy,
    title: "Tourism Excellence",
    description:
      "Committed to memorable hospitality, family recreation and visitor experiences.",
    bg: "from-orange-50 to-yellow-100",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-700",
  },
];

const AboutPage = () => {
  const whatsappHref = getWhatsAppBookingHref();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023047] via-[#005f73] to-[#004e64] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-6 text-center md:px-8 pt-36">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-300" />
            About Shivtirth
          </span>

          <h1
            className="text-2xl font-bold uppercase leading-tight tracking-wide text-white md:text-3xl"
            style={{
              fontFamily: "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Best Water Park & Picnic Spot in Nagpur
          </h1>

          <p className="mx-auto max-w-4xl text-sm leading-relaxed text-cyan-50/90">
            Discover Shivtirth — a unique destination where adventure,
            entertainment, learning and natural beauty come together. From
            water parks and boating to adventure, amusement, agriculture and
            nature experiences, Shivtirth offers something for everyone.
          </p>
        </div>
      </section>

      {/* =========================
          INTRODUCTION
      ========================== */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-8 md:px-8 lg:grid-cols-5">

        <div className="relative h-[300px] overflow-hidden rounded-3xl shadow-2xl md:h-[440px] lg:col-span-2">
          <Image
            src="/g1.png"
            alt="Shivtirth Best Water Park and Picnic Spot"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/20 bg-black/30 p-3 text-white backdrop-blur-md">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-300" />
              <span className="text-xs font-semibold">
                Umari (Dam), Saoner, Nagpur
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
            Discover Shivtirth
          </span>

          <h2
            className="text-2xl font-bold leading-tight text-slate-900"
            style={{
              fontFamily: "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Adventure, Learning & Natural Beauty
          </h2>

          <p className="mt-2 text-sm leading-7 text-slate-700 md:text-base">
            Shivtirth is an entertainment and learning destination combining
            Aadishakti Water Park, Thrill Power Boating Park, Mowgali Adventure
            Park, Amusement, Agriculture and Nature.
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-700 md:text-base">
            Located at Umari (Dam), Saoner, Nagpur, Shivtirth is surrounded by
            the Satpuda mountain range, forests, dam and peaceful valley.
            Situated approximately 47 km from Nagpur on Betul National Highway
            (NH 47), it provides an ideal escape from the city.
          </p>

          <p className="mt-2 text-sm leading-7 text-slate-700 md:text-base">
            Shivtirth welcomes school picnics, family outings, group picnics,
            corporate events, weddings, birthdays, anniversaries,
            pre-wedding shoots and educational programs.
          </p>

          {/* <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              "Waterpark",
              "Adventure Park",
              "Amusement Park",
              "Boating Park",
              "Agro Tourism",
              "Air Tourism",
              "Jungle Safari",
              "Bird Watching",
              "Camping"
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-cyan-800"
              >
                {item}
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* =========================
          EXPERIENCE
      ========================== */}
      {/* <section className="bg-gradient-to-br from-[#004e64] via-[#007f8b] to-[#023047] py-8 text-white">
        <div className="mx-auto max-w-6xl px-4 md:px-8">

          <div className="mb-2 text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
              One Destination
            </span>

            <h2
              className="text-2xl font-bold uppercase"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Many Experiences
            </h2>

            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-cyan-50/80">
              From thrilling rides to peaceful nature experiences, Shivtirth
              brings recreation, adventure and learning together under one roof.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {experiences.map((experience) => {
              const Icon = experience.icon;

              return (
                <div
                  key={experience.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-black/30"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3
                    className="text-lg font-bold text-white"
                    style={{
                      fontFamily: "'Times New Roman', Times, Georgia, serif",
                    }}
                  >
                    {experience.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-cyan-50/75">
                    {experience.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* =========================
          MISSION & VISION
      ========================== */}
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-8">

        <div className="mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
            Our Purpose
          </span>

          <h2
            className="text-2xl font-bold text-slate-900"
            style={{
              fontFamily: "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Mission & Vision
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Mission */}
          <div className="rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-sky-100 p-7 shadow-lg md:p-9">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md">
              <GraduationCap className="h-6 w-6" />
            </div>

            <h3
              className="text-2xl font-bold text-slate-900"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Our Mission
            </h3>

            <p className="text-sm leading-7 text-slate-700 md:text-base">
              To provide a transformative outdoor learning experience that
              connects children with nature and agriculture, fostering courage,
              confidence and creativity through hands-on activities and
              educational programs.
            </p>

            <div className="mt-2 space-y-2">
              {[
                "Connect children with nature",
                "Promote agricultural learning",
                "Build courage and confidence",
                "Encourage creativity and teamwork",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Vision */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-100 p-7 shadow-lg md:p-9">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <Leaf className="h-6 w-6" />
            </div>

            <h3
              className="text-2xl font-bold text-slate-900"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Our Vision
            </h3>

            <p className="text-sm leading-7 text-slate-700 md:text-base">
              To inspire the next generation to embrace environmental
              stewardship and agricultural knowledge, nurturing a deep
              appreciation for nature and empowering them to thrive in a
              rapidly changing world.
            </p>

            <div className="mt-2 space-y-2">
              {[
                "Encourage environmental responsibility",
                "Promote agricultural awareness",
                "Create meaningful outdoor experiences",
                "Build a stronger connection with nature",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-700"
                >
                  <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-700" />
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          HIGHLIGHTS
      ========================== */}
      <Testimonials/>
      {/* <section className="bg-slate-50 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">

          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
              Shivtirth By Numbers
            </span>

            <h2
              className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Our Highlights
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600">
              A growing destination loved by families, students, groups and
              adventure seekers.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-5 text-center shadow-md md:p-7`}
                >
                  <div
                    className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="text-3xl font-black leading-none text-slate-900 md:text-4xl">
                    {item.number}
                  </div>

                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-700 md:text-sm">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-6 text-center shadow-md">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Trophy className="h-6 w-6 text-amber-600" />

              <span className="text-3xl font-black text-slate-900">
                9+
              </span>

              <span className="text-sm font-bold uppercase tracking-wide text-slate-700">
                Years of Legacy
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          FACILITIES
      ========================== */}
      {/* <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">

        <div className="grid items-center gap-8 md:grid-cols-2">

          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
              Designed For Comfort
            </span>

            <h2
              className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Facilities & Experiences
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              Shivtirth is designed to make every visit comfortable,
              enjoyable and memorable. Whether you are visiting with family,
              school students, friends or a corporate group, our facilities are
              planned around convenience and recreation.
            </p>

            <Link
              href="/parks"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-700 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-cyan-800"
            >
              Explore Parks
            </Link>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-[#004e64] to-[#023047] p-6 shadow-xl md:p-8">

            <div className="space-y-3">
              {facilities.map((facility) => (
                <div
                  key={facility}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300">
                    <BadgeCheck className="h-3.5 w-3.5" />
                  </span>

                  <span className="text-xs leading-relaxed text-cyan-50 md:text-sm">
                    {facility}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section> */}

      {/* =========================
          WHY SHIVTIRTH
      ========================== */}
      {/* <section className="bg-gradient-to-br from-[#e8f8fa] via-white to-[#e7f6f3] py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-8">

          <div className="mb-10 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
              Why Choose Us
            </span>

            <h2
              className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Why Shivtirth?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => {
              const Icon = reason.icon;

              return (
                <div
                  key={reason.title}
                  className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3
                    className="text-lg font-bold text-slate-900"
                    style={{
                      fontFamily:
                        "'Times New Roman', Times, Georgia, serif",
                    }}
                  >
                    {reason.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {reason.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section> */}

      {/* =========================
          LOCATION
      ========================== */}
      {/* <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#023047] via-[#005f73] to-[#004e64] text-white shadow-2xl">

          <div className="grid items-center md:grid-cols-2">

            <div className="p-7 md:p-10">

              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                <MapPin className="h-5 w-5" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
                Visit Shivtirth
              </span>

              <h2
                className="mt-2 text-3xl font-bold md:text-4xl"
                style={{
                  fontFamily: "'Times New Roman', Times, Georgia, serif",
                }}
              >
                Escape Into Nature
              </h2>

              <p className="mt-4 text-sm leading-7 text-cyan-50/85 md:text-base">
                Located at Umari (Dam), Saoner, Nagpur, Shivtirth is surrounded
                by the Satpuda mountain range, forest, dam and valley.
              </p>

              <div className="mt-5 space-y-2 text-xs text-cyan-50/90 md:text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-300" />
                  Umari (Dam), Saoner, Nagpur, Maharashtra
                </div>

                <div className="flex items-center gap-2">
                  <Mountain className="h-4 w-4 text-amber-300" />
                  Approximately 47 km from Nagpur
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-amber-300" />
                  Betul National Highway (NH 47)
                </div>
              </div>

              <Link
                href="https://www.google.com/maps/search/?api=1&query=Shivtirth+Best+Water+Park+Nagpur"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-amber-300"
              >
                Get Directions
              </Link>

            </div>

            <div className="relative min-h-[280px] md:min-h-[360px]">
              <Image
                src="/g1.png"
                alt="Shivtirth natural surroundings"
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#023047]/70 via-transparent to-transparent md:bg-gradient-to-r" />
            </div>

          </div>
        </div>
      </section> */}

      {/* =========================
          AFFILIATIONS
      ========================== */}
      <section className="mx-auto max-w-6xl px-4 pb-8 md:px-8">

        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">
            Trust & Recognition
          </span>

          <h2
            className="text-2xl font-bold text-slate-900"
            style={{
              fontFamily: "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Our Affiliations & Recognition
          </h2>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-slate-600">
            Shivtirth continues to focus on safety, quality, educational
            experiences, eco-friendly recreation and memorable hospitality.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {affiliations.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`rounded-2xl border ${item.border} bg-gradient-to-br ${item.bg} p-4 shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
              >
                <div
                  className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <h3
                  className="text-xl font-bold text-slate-900"
                  style={{
                    fontFamily:
                      "'Times New Roman', Times, Georgia, serif",
                  }}
                >
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-700">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================
          LOGOS
      ========================== */}
      <Logos />

      {/* =========================
          STICKY BOOK NOW
      ========================== */}
      <InteractiveHoverButton
        href="/offers"
        className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center px-8 py-3 text-xs font-bold shadow-2xl md:text-sm"
      >
        BOOK NOW
      </InteractiveHoverButton>

    </main>
  );
};

export default AboutPage;
// import Image from "next/image";

// import type { Metadata } from "next";
// import Link from "next/link";
// import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
// import Description from "@/components/Description";
// import Logos from "@/components/Logos";
// import { getWhatsAppBookingHref } from "@/lib/whatsapp";

// export const metadata: Metadata = {
//   title: "Our Story & Promise | Shivtirth Water Park Nagpur",
//   description:
//     "Discover the story of Shivtirth Water Park built on joy, safety, and unforgettable memories for families, friends, and adventurers in Nagpur.",
//   keywords: [
//     "shivtirth water park",
//     "best water park in nagpur",
//     "family water park nagpur",
//     "safe water park near nagpur",
//     "amusement park nagpur",
//   ],
//   openGraph: {
//     title: "Our Story & Promise | Shivtirth Water Park",
//     description:
//       "A destination built on joy, safety, and unforgettable memories crafted for families, friends, and adventurers alike.",
//     siteName: "Shivtirth Water Park",
//     locale: "en_IN",
//     type: "website",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
// };


// const AboutPage = () => {
//   return (
//     <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900">
//       {/* Hero */}
//       <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
//           <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
//         </div>

//         <div className="relative max-w-6xl mx-auto px-4 md:px-8 md:pt-46 pb-18 py-28 text-center">
//           <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight text-white">
//             Shivtirth Best Water Park
//           </h1>
          
//           <p className="text-slate-300 max-w-4xl mx-auto mb-8 text-sm md:text-base">
//             Located in Umari (Dam), Saoner, Nagpur,  surrounded by the serene Satpuda mountain range, lush forests, and the peaceful dam valley. Perfect for school picnics, family outings, corporate groups, weddings, and birthday celebrations.
//           </p>
//         </div>
//       </div>
//       {/* <Description/> */}

//       {/* Introduction & History */}
//       <section className="max-w-6xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
//         <div className="lg:col-span-2 relative h-72 md:h-96 rounded-3xl overflow-hidden shadow-xl">
//           <Image
//             src="/g1.png"
//             alt="Shivtirth Water Park"
//             fill
//             className="object-cover"
//             sizes="(min-width: 1024px) 40vw, 100vw"
//             priority
//           />
//           <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />
//         </div>
//         <div className="lg:col-span-3 space-y-4">
//           <h2 className="text-3xl md:text-4xl font-black text-slate-900">Shivtirth Best Water Park</h2>
//           <p className="text-lg md:text-xl text-slate-700 leading-relaxed">
//             Founded with a vision to bring world-class recreation to central India, Shivtirth Best Water Park blends thrilling attractions with serene natural surroundings. We continue to evolve with safety, hospitality, and innovation at the core.
//           </p>
//           <p className="text-lg text-slate-700 leading-relaxed">
//             Over the years, we have welcomed families, schools, corporates, and adventure seekers crafting experiences that combine excitement, comfort, and memorable service.
//           </p>
//         </div>
//       </section>

//       <Logos/>

//       {/* Mission & Vision */}
//       <section className="max-w-6xl mx-auto px-4 md:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="rounded-3xl bg-linear-to-br from-blue-50 to-cyan-50 p-8 md:p-10 shadow-xl border border-blue-200 hover:shadow-2xl transition-shadow">
//           <div className="text-5xl mb-4">🎯</div>
//           <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Our Mission</h3>
//           <p className="text-lg text-slate-700 leading-relaxed mb-4">
//             Our mission is to create a joyful and refreshing destination where families and students can reconnect with nature, adventure, and togetherness. At Shivtirth Water Park & Boating, we aim to offer a safe, thrilling, and nature-friendly experience through exciting water rides, boating rides, adventure, amusement, while promoting fun, relaxation, and harmony with the environment. We strive to make every visitor leave with smiles, cherished memories, and a renewed love for nature and outdoor fun.
//           </p>
//         </div>
//         <div className="rounded-3xl bg-linear-to-br from-emerald-50 to-teal-50 p-8 md:p-10 shadow-xl border border-emerald-200 hover:shadow-2xl transition-shadow">
//           <div className="text-5xl mb-4">🚀</div>
//           <h3 className="text-3xl md:text-4xl font-black mb-4 text-slate-900">Our Vision</h3>
//           <p className="text-lg text-slate-700 leading-relaxed mb-4">
//             Our vision is to make Shivtirth the most loved and eco-friendly destination for recreation and adventure in Central India,  a place where fun meets nature. We aspire to inspire happiness, wellness, and togetherness by offering world-class water and boating experiences surrounded by the natural beauty of the Satpuda mountains. Through continuous innovation and sustainable practices, we aim to make Shivtirth a symbol of joy, adventure, and harmony with nature for families and visitors of all ages.
//           </p>
//         </div>
//       </section>

//       {/* Our Achievements */}
//       <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
//             Our Achievements Speak for Themselves
//           </h2>
//           <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
//             Here's what makes Shivtirth Best Waterpark special for thousands of visitors.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 mb-16 items-stretch">
//           <div className="rounded-2xl bg-linear-to-br from-blue-50 to-cyan-50 p-6 md:p-8 text-center border border-blue-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
//             <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">100K+</div>
//             <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Happy People</p>
//           </div>
//           <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-teal-50 p-6 md:p-8 text-center border border-emerald-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
//             <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">150+</div>
//             <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Activities</p>
//           </div>
//           <div className="rounded-2xl bg-linear-to-br from-orange-50 to-yellow-50 p-6 md:p-8 text-center border border-orange-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
//             <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">4.7</div>
//             <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Rating</p>
//           </div>
//           <div className="rounded-2xl bg-linear-to-br from-pink-50 to-rose-50 p-6 md:p-8 text-center border border-pink-200 shadow-lg min-h-44 flex flex-col items-center justify-center">
//             <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-none">15K+</div>
//             <p className="text-base md:text-lg font-bold text-slate-800 leading-tight">Reviews</p>
//           </div>
//         </div>
//       </section>

//       {/* Affiliations & Certifications */}
//       <section className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
//             Our Affiliations & Certifications
//           </h2>
//           <p className="text-lg text-slate-600">
//             Shivtirth Water Park is proud to be recognized by trusted organizations and institutions for our commitment to safety, quality, and eco-friendly tourism.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="rounded-2xl bg-linear-to-br from-blue-50 to-blue-100 p-8 border border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
//             <div className="text-4xl mb-4">✅</div>
//             <h3 className="text-2xl font-black mb-2 text-slate-900">ISO 9001:2015 Certified</h3>
//             <p className="text-slate-700 leading-relaxed">
//               For maintaining high standards in safety and service quality.
//             </p>
//           </div>

//           <div className="rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100 p-8 border border-emerald-300 shadow-lg hover:shadow-xl transition-shadow">
//             <div className="text-4xl mb-4">🌱</div>
//             <h3 className="text-2xl font-black mb-2 text-slate-900">Eco-Friendly Tourism Partner</h3>
//             <p className="text-slate-700 leading-relaxed">
//               Recognized for promoting sustainable and nature-based recreation.
//             </p>
//           </div>

//           <div className="rounded-2xl bg-linear-to-br from-purple-50 to-purple-100 p-8 border border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
//             <div className="text-4xl mb-4">📚</div>
//             <h3 className="text-2xl font-black mb-2 text-slate-900">Educational Tour Certified</h3>
//             <p className="text-slate-700 leading-relaxed">
//               Approved as a safe and learning destination for school & college trips.
//             </p>
//           </div>

//           <div className="rounded-2xl bg-linear-to-br from-orange-50 to-orange-100 p-8 border border-orange-300 shadow-lg hover:shadow-xl transition-shadow">
//             <div className="text-4xl mb-4">🏅</div>
//             <h3 className="text-2xl font-black mb-2 text-slate-900">Tourism Excellence Award</h3>
//             <p className="text-slate-700 leading-relaxed">
//               Awarded for outstanding hospitality and family-friendly tourism.
//             </p>
//           </div>
//         </div>
//       </section>
//       <InteractiveHoverButton
//         href={"/offers"}
//         className='flex fixed bottom-8 left-1/2 -translate-x-1/2 items-center z-20 px-8 py-3'
//       >
//         BOOK NOW
//       </InteractiveHoverButton>
//     </main>
//   );
// };

// export default AboutPage;