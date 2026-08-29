import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Trees,
  Users,
  Utensils,
  Clock3,
  MapPinned,
  School,
  Waves,
  Trophy,
} from 'lucide-react'

const safetyPillars = [
  {
    icon: ShieldCheck,
    title: '100% CCTV & Security Coverage',
    description:
      'The entire campus is monitored by surveillance cameras, backed by 24/7 gated entry and night police patrolling for overnight stays.',
  },
  {
    icon: Waves,
    title: 'Certified Water Lifeguards',
    description:
      'Every pool, slide exit, and water fall area is actively supervised by trained lifeguard staff.',
  },
  {
    icon: HeartPulse,
    title: 'First-Aid & Medical Readiness',
    description:
      'On-site first-aid equipment and immediate medical support protocols are in place for emergencies.',
  },
  {
    icon: Utensils,
    title: 'Hygienic Catering Standards',
    description:
      'Meals are freshly prepared in clean, audited kitchens using quality ingredients suitable for school children.',
  },
  {
    icon: Users,
    title: 'Dedicated School Coordinators',
    description:
      'Each school group is assigned a dedicated coordinator to ensure smooth scheduling and headcounts.',
  },
]

const attractionZones = [
  {
    title: 'Water Park & Adishakti Water Fall',
    image: '/Water-Park.jpg',
    overview:
      'A water playground designed for maximum excitement and complete safety across all age groups.',
    points: [
      'Multi-play water stations and splash buckets',
      'Thrill and gentle slides tailored for primary to high school students',
      'Foam dance, rain guns, rain dance floors, and live DJ music pools',
      'Adishakti Water Fall with glass flooring, fog, laser lights, bubble effects, and supervised waterfall rappelling',
    ],
  },
  {
    title: 'Mowgli Adventure Park',
    image: '/mowgli-adventure.jpg',
    overview:
      'Designed to foster physical agility, teamwork, and confidence in students through thrilling outdoor challenges.',
    points: [
      'High and low zip lines, tyre bridges, rope bridges, and crawl bridges',
      'Obstacle courses, net climbing, and commando towers',
      'Satpuda trekking, net Burma bridge, and hanging bamboo bridges',
      'Tree houses, 3D shows, and a serene butterfly garden',
    ],
  },
  {
    title: 'Baliraja Agro & Bird Park',
    image: '/ag4.jpg',
    overview:
      'Bringing textbooks to life by teaching students about nature, agriculture, and ecosystems in an interactive setting.',
    points: [
      'Guided tours through crop cultivation fields, flower zones, and vegetable kitchen gardens',
      'Nursery visits focusing on medicinal and botanical plant species',
      'Hands-on exposure to traditional and modern farming processes',
      'Automatic weather measuring center, bird safaris, animal interaction points, and sunset view decks',
    ],
  },
  {
    title: 'Amusement Rides & Optional Boating',
    image: '/amusement.jpg',
    overview:
      'A perfect mix of nostalgia, thrilling rides, and optional water adventures for a complete student outing.',
    points: [
      'Classic rides including Tora Tora, Break Dance, Columbus, swings, play zones, and selfie spots',
      'Optional boating add-on with speed boats, shikara, dragon boats, train boats, kayaks, pedal boats, and banana boats',
      'Multi-activity format suited for all groups and age levels',
      'Flexible additions to make each school outing uniquely memorable',
    ],
  },
]

const dayTourSchedule = [
  '09:00 AM – 10:00 AM: Arrival, welcome breakfast, fun group games, and Baliraja Agro Park tour.',
  '10:00 AM – 01:00 PM: Water Park session with slides, rain dance, foam party, and Adishakti Water Fall.',
  '01:00 PM – 03:00 PM: Unlimited hygienic lunch buffet and relaxation time.',
  '03:00 PM – 05:00 PM: Mowgli Adventure Park challenges and amusement park rides.',
  '05:00 PM – 06:00 PM: Evening tea/snacks, group photos, and departure.',
]

const overnightSchedule = [
  'Day 1 Evening (06:00 PM – 07:00 PM): Room allotment and fresh-up session.',
  'Day 1 Night (07:00 PM – 11:00 PM): Recreation, team-building games, dinner buffet, night bonfire, and lights out at 11 PM with security patrolling.',
  'Day 2 Morning (06:00 AM – 10:00 AM): Wake-up call, nature trekking, fresh-up, breakfast, and games.',
  'Day 2 Afternoon (10:00 AM – 06:00 PM): Full access to Water Park, lunch, Mowgli Adventure activities, evening snacks, and final departure.',
]

const teacherPerks = [
  'Complimentary passes: free entry and meal tickets for teachers and staff (1 free teacher per 15 students)',
  'Dedicated staff room: relaxed seating area while students enjoy supervised activities',
  'Custom group discounts: tiered pricing based on total student strength',
  'Free event planning: assistance with inter-class games, award distribution, or school celebrations on our event lawn',
]

export default function SchoolPicnicPage() {
  return (
    <main className="bg-slate-50 text-slate-900">
      <section className="relative">
        <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
          <Image
            src="/picnic.png"
            alt="School picnic banner"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10" />

          <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12 px-6">
            <div className="max-w-5xl text-center">
              <span className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                School Picnics & Adventure Camps
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight text-white drop-shadow-md md:text-6xl">
                Central India’s School Picnic & Adventure Destination
              </h1>
              <p className="mt-4 max-w-4xl mx-auto text-sm font-medium text-white/90 md:text-xl">
                Turn your school trip into an unforgettable mix of thrilling water slides, exciting adventure sports, hands-on agro-learning, and 100% safe, hygienic meals.
              </p>
              <p className="mt-3 text-base font-semibold italic text-yellow-300 md:text-2xl">
                "पढ़ाई के बीच एक दिन ऐसा भी... जहाँ बच्चों को मिले मस्ती, यादें और ढेर सारी खुशियाँ!"
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/billing"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-bold text-slate-900 shadow-lg transition hover:scale-[1.01] md:text-base"
                >
                  Plan School Trip Now
                </Link>
                <Link
                  href="tel:+918605362212"
                  className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/10 px-7 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 md:text-base"
                >
                  Call Booking Office: +91 8605362212
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-7 w-[92%] max-w-7xl px-2 md:px-0">
        <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl md:grid-cols-5 md:p-6">
          {safetyPillars.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-20">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Core Attraction Zones</p>
          <h2 className="mt-3 uppercase text-2xl md:text-3xl font-black text-slate-900">
            A complete learning & adventure experience
          </h2>
        </div>

        <div className="space-y-8 md:space-y-12">
          {attractionZones.map(({ title, image, overview, points }, index) => (
            <div
              key={title}
              className="overflow-hidden rounded-[30px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
            >
              <div className="grid items-center gap-0 md:grid-cols-2">
                <div className={`relative h-[300px] w-full md:h-full ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <Image src={image} alt={title} fill className="object-cover" />
                </div>

                <div className={`p-6 md:p-10 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    Zone {index + 1}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 md:text-3xl">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{overview}</p>

                  <ul className="mt-6 space-y-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm text-slate-700 md:text-base">
                        <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent">
                          <BadgeCheck className="h-3.5 w-3.5" />
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-yellow-300">Package Schedule</p>
            <h2 className="mt-3 uppercase text-2xl font-black md:text-3xl">
              Comprehensive plan for every picnic and overnight camp
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <Clock3 className="h-6 w-6 text-yellow-300" />
                <h3 className="text-xl font-black">Day Tour Itinerary (9:00 AM – 6:00 PM)</h3>
              </div>
              <ul className="space-y-4">
                {dayTourSchedule.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300/20 text-yellow-300">
                      <MapPinned className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <School className="h-6 w-6 text-yellow-300" />
                <h3 className="text-xl font-black">Overnight Adventure Camp (2 Days / 1 Night)</h3>
              </div>
              <ul className="space-y-4">
                {overnightSchedule.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-200">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-300/20 text-yellow-300">
                      <Trophy className="h-3 w-3" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Teacher Perks</p>
          <h2 className="mt-3 uppercase text-2xl font-black md:text-3xl text-slate-900">
            Built for stress-free school planning
          </h2>
        </div>

        <div className="rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 md:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center justify-center rounded-[28px] bg-gradient-to-br from-accent/20 via-white to-slate-100 p-6">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent text-slate-900 shadow-lg md:h-20 md:w-20">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-900">School Organizer Advantage</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-700">
                  We support schools with smooth coordination, well-structured scheduling, and personalized event planning so your day remains engaging, safe, and memorable.
                </p>
              </div>
            </div>

            <ul className="space-y-4">
              {teacherPerks.map((perk) => (
                <li key={perk} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* <section className="bg-gradient-to-r from-accent to-yellow-300 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-5xl">
            Ready to plan your next school outing?
          </h2>
          <p className="mt-4 text-base text-slate-800 md:text-xl">
            Give your students a day packed with adventure, learning, safety, and lifelong memories.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/billing"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-95 md:text-base"
            >
              Plan School Trip Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="tel:+918605362212"
              className="inline-flex items-center justify-center rounded-full border border-slate-900/40 bg-white/55 px-7 py-3 text-sm font-bold text-slate-900 md:text-base"
            >
              Call Booking Office: +91 8605362212
            </Link>
          </div>
        </div>
      </section> */}
    </main>
  )
}
