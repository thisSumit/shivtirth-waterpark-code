import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from "next";
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { createClient } from '@supabase/supabase-js';
import { Tag } from 'lucide-react';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder-project-id.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* =========================================================
   TYPES
========================================================= */

type Package = {
  name: string;
  image: string;
  originalPrice: string;
  discountedPrice: string;
  tag?: string;
  description: string;
  inclusions: string[];
  note?: string | null; // Uses consent_text from database
  cta: string;
  link: string;
  singlePrice?: number | null;
  groupPrice?: number | null;
};

type OfferCard = {
  title: string;
  image: string;
  alt: string;
  highlight: string;
  description: string;
  oldPrice: string;
  newPrice: string;
  badge: string;
  cta: string;
  link: string;
  footer: string;
  note?: string | null; // Uses consent_text from database
  singlePrice: number | null;
  groupPrice: number | null;
};

type TicketOption = {
  id?: string | number;
  label?: string;
  price?: number | string;
};

/* =========================================================
   METADATA
========================================================= */

export const metadata: Metadata = {
  title: "Latest Offers & Packages | Shivtirth Water Park",
  description:
    "Discover exclusive offers at Shivtirth Water Park including Monsoon Picnic, Ladies Special, and Combo Packages. Book now for maximum savings!",
  keywords: [
    "shivtirth water park offers",
    "water park offers nagpur",
    "student offer water park",
    "ladies special water park",
  ],
  openGraph: {
    title: "Exclusive Offers & Packages at Shivtirth Water Park",
    description:
      "Special deals for students, families, and groups. Enjoy Waterpark + Amusement + Adventure with huge discounts.",
    siteName: "Shivtirth Water Park",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* =========================================================
   DEFAULT OFFERS
========================================================= */

const defaultOffers: OfferCard[] = [
  {
    title: 'Monsoon Picnic Hungama',
    image: '/offers/banner4.png',
    alt: 'Monsoon picnic offer at Shivtirth Water Park',
    highlight: '🎉 MONSOON PICNIC, HUNGAMA SHURU',
    description:
      '🎟️ Waterpark + Amusement + Adventure + Bird Park (1 Ticket 4 Parks)',
    oldPrice: '₹620',
    newPrice: '₹690',
    badge: 'Free Pakoda & High Tea',
    cta: '👉 Book Monsoon Picnic',
    link: '/billing?planId=monsoon-picninic-hungama',
    footer: '⏳ Limited Period Offer',
    note: '',
    singlePrice: null,
    groupPrice: null,
  },
  {
    title: 'LADKI BAHIN SPECIAL OFFER',
    image: '/offers/banner3.jpeg',
    alt: 'Ladies special offer at Shivtirth Water Park',
    highlight: '🎟️ Ladies Only',
    description:
      'Special group offer for a memorable day out with friends.',
    oldPrice: '₹790',
    newPrice: '₹550',
    badge: 'अपनी सहेलियों के साथ, एक यादगार दिन।',
    cta: '👉 Book Ladies Offer',
    link: '/billing?planId=ladki-bahin-special',
    footer: '💝 Group Offer: ₹550 per person',
    note: '',
    singlePrice: 690,
    groupPrice: 550,
  },
];

/* =========================================================
   DEFAULT PACKAGES
========================================================= */

const defaultPackages: Package[] = [
  {
    name: "Water Park Package",
    image: "/waterpark-1.jpg",
    originalPrice: "₹790",
    discountedPrice: "₹690",
    tag: "Most Popular",
    description:
      "Enjoy Various Park with nature of Great Satpuda Mountain",
    inclusions: [
      "Waterpark access",
      "Adventure park & 3d show",
      "Amusement park",
      "Safari experience",
      "Agro activities",
    ],
    note: "",
    cta: "Book Water Park",
    link: '/billing?planId=waterpark-package',
    singlePrice: null,
    groupPrice: null,
  },
  {
    name: "Boating Package",
    image: "/Boating-Park.jpg",
    originalPrice: "₹1000",
    discountedPrice: "₹690",
    description:
      "Enjoy Unlimited boating fun with exciting thrill rides",
    inclusions: [
      "Banana, Speed & Disco Boat",
      "Shikara, Kayak & Paddle Boat",
      "Dragon, Train & Sofa Boat",
      "Octopus Ride",
      "Zorbing Ball",
    ],
    note: "",
    cta: "Book Boating",
    link: '/billing?planId=boating-package',
    singlePrice: null,
    groupPrice: null,
  },
  {
    name: "Silver Combo Package",
    image: "/g8.png",
    originalPrice: "₹1280",
    discountedPrice: "₹890",
    tag: "Best Value",
    description:
      "Waterpark Package + Boating Park Package Activities - The perfect combination for exciting fun",
    inclusions: [
      "All Water Park activities",
      "All Boating rides (7 rides)",
      "Full day access",
    ],
    note: "",
    cta: "Book Silver Combo",
    link: '/billing?planId=silver-combo',
    singlePrice: null,
    groupPrice: null,
  },
  {
    name: "Golden Full Package",
    image: "/g10.png",
    originalPrice: "₹1630",
    discountedPrice: "₹1190",
    tag: "Premium",
    description: "Complete Enjoyment with Tasty Food",
    inclusions: [
      "Waterpark Package",
      "Boating Package",
      "Food - (Breakfast, Lunch, Hi-Tea)",
    ],
    note: "",
    cta: "Book Golden Package",
    link: '/billing?planId=golden-package',
    singlePrice: null,
    groupPrice: null,
  },
];

/* =========================================================
   DEFAULT ACCOMMODATION
========================================================= */

const defaultAccommodation: Package[] = [
  {
    name: "Day & Night Package",
    image: "/Stay-Facilities.jpg",
    originalPrice: "₹3000",
    discountedPrice: "₹2500",
    tag: "Ultimate Stay",
    description:
      "Extended stay with overnight camping experience & farmhouse stay options",
    inclusions: [
      "Waterpark + Boating",
      "Stay Facilities - Camping stay / Farm House",
      "2 Meals included",
      "Bonfire & activities",
      "Breakfast next day",
    ],
    note: "",
    cta: "Book Stay Package",
    link: '/billing?planId=stay-package',
    singlePrice: null,
    groupPrice: null,
  },
];

/* =========================================================
   NOTE COMPONENT
========================================================= */

function NoteSection({ note }: { note?: string | null }) {
  if (!note || !note.trim()) return null;

  return (
    <div className="mt-2 mb-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5">
      <div className="flex items-start gap-2">

        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">
            Note
          </p>

          <p className="text-xs leading-relaxed text-amber-100 whitespace-pre-line">
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

const Page = async () => {
  const resolveBillingLink = (
    planId: string | undefined,
    groupPrice?: number | null
  ) => {
    const link = planId
      ? `/billing?planId=${encodeURIComponent(planId)}`
      : '/billing';

    if (groupPrice == null) return link;

    const separator = link.includes('?') ? '&' : '?';

    return `${link}${separator}groupPrice=${groupPrice}`;
  };

  let offerCards: OfferCard[] = [];
  let packageCards: Package[] = [];
  let accommodationCards: Package[] = [];

  try {
    const { data: dbAll, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    if (error) {
      throw error;
    }

    const now = Date.now();

    const visiblePackages = (dbAll || []).filter(
      (item) =>
        !item.hide_after ||
        new Date(item.hide_after).getTime() > now
    );

    if (visiblePackages.length > 0) {
      const offers = visiblePackages.filter(
        (item) => item.category === 'offer'
      );

      const packages = visiblePackages.filter(
        (item) => item.category === 'package'
      );

      const accommodation = visiblePackages.filter(
        (item) => item.category === 'accommodation'
      );

      /* =====================================================
         OFFERS
      ===================================================== */

      if (offers.length > 0) {
        offerCards = offers.map((item) => {
          const ticketOpts: TicketOption[] = Array.isArray(
            item.ticket_options
          )
            ? item.ticket_options
            : [];

          const singleOpt = ticketOpts.find(
            (o) =>
              String(o.id ?? '').includes('single') ||
              String(o.label ?? '')
                .toLowerCase()
                .includes('single')
          );

          const groupOpt = ticketOpts.find(
            (o) =>
              String(o.id ?? '').includes('group') ||
              String(o.label ?? '')
                .toLowerCase()
                .includes('group')
          );

          return {
            title: item.name,
            image: item.image,
            alt: item.name,
            highlight: item.highlight || '',
            description: item.description || '',
            oldPrice: item.original_price
              ? `₹${item.original_price}`
              : '',
            newPrice: `₹${item.discounted_price}`,
            badge: item.tag || 'Special Offer',
            cta: item.cta || 'Book Now',

            link: resolveBillingLink(
              item.plan_id,
              groupOpt?.price != null
                ? Number(groupOpt.price)
                : null
            ),

            footer: item.footer || '',

            /*
             * IMPORTANT:
             * consent_text from Supabase is used as NOTE.
             */
            note: item.consent_text || '',

            singlePrice:
              singleOpt?.price != null
                ? Number(singleOpt.price)
                : null,

            groupPrice:
              groupOpt?.price != null
                ? Number(groupOpt.price)
                : null,
          };
        });
      } else {
        offerCards = defaultOffers;
      }

      /* =====================================================
         PACKAGES
      ===================================================== */

      if (packages.length > 0) {
        packageCards = packages.map((item) => {
          const ticketOpts: TicketOption[] = Array.isArray(
            item.ticket_options
          )
            ? item.ticket_options
            : [];

          const singleOpt = ticketOpts.find(
            (o) =>
              String(o.id ?? '').includes('single') ||
              String(o.label ?? '')
                .toLowerCase()
                .includes('single')
          );

          const groupOpt = ticketOpts.find(
            (o) =>
              String(o.id ?? '').includes('group') ||
              String(o.label ?? '')
                .toLowerCase()
                .includes('group')
          );

          return {
            name: item.name,
            image: item.image,
            originalPrice: item.original_price
              ? `₹${item.original_price}`
              : '',
            discountedPrice: `₹${item.discounted_price}`,
            tag: item.tag || undefined,
            description: item.description || '',

            inclusions: Array.isArray(item.inclusions)
              ? item.inclusions
              : [],

            /*
             * IMPORTANT:
             * consent_text -> note
             */
            note: item.consent_text || '',

            cta: item.cta || 'Book Now',

            link: resolveBillingLink(
              item.plan_id,
              groupOpt?.price != null
                ? Number(groupOpt.price)
                : null
            ),

            singlePrice:
              singleOpt?.price != null
                ? Number(singleOpt.price)
                : null,

            groupPrice:
              groupOpt?.price != null
                ? Number(groupOpt.price)
                : null,
          };
        });
      } else {
        packageCards = defaultPackages;
      }

      /* =====================================================
         ACCOMMODATION
      ===================================================== */

      if (accommodation.length > 0) {
        accommodationCards = accommodation.map((item) => {
          const ticketOpts: TicketOption[] = Array.isArray(
            item.ticket_options
          )
            ? item.ticket_options
            : [];

          const singleOpt = ticketOpts.find(
            (o) =>
              String(o.id ?? '').includes('single') ||
              String(o.label ?? '')
                .toLowerCase()
                .includes('single')
          );

          const groupOpt = ticketOpts.find(
            (o) =>
              String(o.id ?? '').includes('group') ||
              String(o.label ?? '')
                .toLowerCase()
                .includes('group')
          );

          return {
            name: item.name,
            image: item.image,

            originalPrice: item.original_price
              ? `₹${item.original_price}`
              : '',

            discountedPrice: `₹${item.discounted_price}`,

            tag: item.tag || undefined,

            description: item.description || '',

            inclusions: Array.isArray(item.inclusions)
              ? item.inclusions
              : [],

            /*
             * consent_text -> note
             */
            note: item.consent_text || '',

            cta: item.cta || 'Book Now',

            link: resolveBillingLink(
              item.plan_id,
              groupOpt?.price != null
                ? Number(groupOpt.price)
                : null
            ),

            singlePrice:
              singleOpt?.price != null
                ? Number(singleOpt.price)
                : null,

            groupPrice:
              groupOpt?.price != null
                ? Number(groupOpt.price)
                : null,
          };
        });
      } else {
        accommodationCards = defaultAccommodation;
      }
    } else {
      offerCards = defaultOffers;
      packageCards = defaultPackages;
      accommodationCards = defaultAccommodation;
    }
  } catch (err) {
    console.error(
      "Error loading dynamically in server component:",
      err
    );

    offerCards = defaultOffers;
    packageCards = defaultPackages;
    accommodationCards = defaultAccommodation;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-cyan-950 via-slate-950 to-cyan-950 text-slate-100 pb-24">

      {/* =====================================================
          HERO
      ===================================================== */}
      <div className="relative">
              <div className="relative h-[52vh] md:h-[65vh] overflow-hidden">
                <Image
                  src="/Water-Park.jpg"
                  alt="Water Park"
                  fill
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-cyan-950/40 to-black/60 pointer-events-none" />
      
                <div className="absolute left-0 right-0 bottom-6 md:bottom-10 px-6 flex justify-center pointer-events-none">
                  <div className="max-w-3xl text-center">
                    <h1 className="text-4xl font-bold text-accent drop-shadow-lg font-times uppercase tracking-wide" style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}>
                      Offer & Packages
                    </h1>
                    <p className="mt-2 text-sm text-cyan-100/90 drop-shadow-sm font-medium">
                      WATER PARK PACKAGE | ONLY BOATING PACKAGE | SILVER COMBO PACKAGE |
            GOLDEN FULL PACKAGE | DAY & NIGHT STAY PACKAGE | MEAL PACKAGE |
            FUNCTION PACKAGE
                    </p>
                  </div>
                </div>
              </div>
            </div>

      {/* <div className="relative overflow-hidden bg-gradient-to-br from-cyan-950 via-slate-900 to-cyan-950 text-white border-b border-cyan-900/50">

        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-12 text-center">

          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold mb-3 text-xs uppercase tracking-widest backdrop-blur-md">
            <Tag className="w-3.5 h-3.5" />
            Offers & Packages
          </span>

          <p className="text-xs md:text-sm font-normal text-slate-300 max-w-3xl mx-auto leading-relaxed">
            WATER PARK PACKAGE | ONLY BOATING PACKAGE | SILVER COMBO PACKAGE |
            GOLDEN FULL PACKAGE | DAY & NIGHT STAY PACKAGE | MEAL PACKAGE |
            FUNCTION PACKAGE
          </p>

        </div>
      </div> */}

      {/* =====================================================
          SPECIAL OFFERS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Featured Deals
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold text-white font-times uppercase"
            style={{
              fontFamily:
                "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Limited-Time Special Offers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {offerCards.map((offer) => (
            <Link
              key={offer.title}
              href={offer.link}
              aria-label={offer.cta}
              className="group flex h-full flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1"
            >

              <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">

                <Image
                  src={offer.image}
                  alt={offer.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                {offer.badge && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                    {offer.badge}
                  </div>
                )}

              </div>

              <div className="p-5 flex flex-1 flex-col justify-between text-white">

                <div>

                  <h3
                    className="text-xl md:text-2xl font-bold font-times mb-1 text-white"
                    style={{
                      fontFamily:
                        "'Times New Roman', Times, Georgia, serif",
                    }}
                  >
                    {offer.title}
                  </h3>

                  <p className="font-bold text-amber-400 mb-1 text-xs md:text-sm">
                    {offer.highlight}
                  </p>

                  <p className="text-slate-300 mb-3 text-xs md:text-sm leading-relaxed">
                    {offer.description}
                  </p>

                  {/* Pricing */}

                  {offer.groupPrice ? (
                    <div className="space-y-1 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">

                      <div className="flex items-end gap-2.5">

                        <span className="text-2xl font-bold text-amber-400">
                          ₹{offer.groupPrice}
                        </span>

                        <span className="text-xs font-semibold text-amber-300/90 mb-1">
                          per person (Group)
                        </span>

                        {!!offer.oldPrice && (
                          <span className="text-slate-400 line-through text-base mb-0.5">
                            {offer.oldPrice}
                          </span>
                        )}

                      </div>

                      {offer.singlePrice && (
                        <p className="text-xs font-medium text-slate-300">
                          Single Entry Price: ₹{offer.singlePrice}
                        </p>
                      )}

                    </div>
                  ) : (
                    !!offer.newPrice && (
                      <div className="flex items-end gap-3 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">

                        <span className="text-2xl font-bold text-amber-400">
                          {offer.newPrice}
                        </span>

                        {!!offer.oldPrice && (
                          <span className="text-slate-400 line-through text-base mb-0.5">
                            {offer.oldPrice}
                          </span>
                        )}

                      </div>
                    )
                  )}

                  {/* Ladies Offer Special Information */}

                  {offer.title.includes('LADKI BAHIN') && (
                    <div className="rounded-xl bg-amber-400/10 border border-amber-400/30 p-3 mb-4 text-xs text-amber-200 space-y-1">
                      <p>
                        • Waterpark + Amusement + Adventure
                        (3 Parks = 1 Ticket)
                      </p>

                      <p>• Complimentary Welcome Drink</p>

                      <p>• Group Offer: ₹550 per person</p>

                      <p>• Perfect for friends&apos; day out</p>
                    </div>
                  )}

                  {/* =================================================
                      OFFER NOTE
                  ================================================= */}

                  <NoteSection note={offer.note} />

                </div>

                <div className="px-5 pb-5 pt-1 text-slate-900">

                  <InteractiveHoverButton>
                    BUY TICKETS
                  </InteractiveHoverButton>

                </div>

              </div>

            </Link>
          ))}

        </div>

      </section>

      {/* =====================================================
          STANDARD PACKAGES
      ===================================================== */}

      <section className="py-12 bg-gradient-to-b from-slate-950/60 via-cyan-950/40 to-slate-950/60 border-y border-slate-800">

        <div className="text-center mb-10">

          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            All-Inclusive Packages
          </p>

          <h2
            className="text-2xl md:text-3xl font-bold text-white font-times uppercase"
            style={{
              fontFamily:
                "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Standard Entry Packages
          </h2>

          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl mx-auto">
            Choose the perfect package to match your family plan and budget.
          </p>

        </div>

        <div
          id="packages-list"
          className="max-w-7xl mx-auto px-4 md:px-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {packageCards.map((pkg) => {

              const originalVal = pkg.originalPrice
                ? parseInt(
                  pkg.originalPrice.replace(/[^\d]/g, '')
                )
                : 0;

              const discountedVal = pkg.discountedPrice
                ? parseInt(
                  pkg.discountedPrice.replace(/[^\d]/g, '')
                )
                : 0;

              const hasSavings =
                originalVal > discountedVal;

              const savingsPercent = hasSavings
                ? Math.round(
                  ((originalVal - discountedVal) /
                    originalVal) *
                  100
                )
                : 0;

              return (
                <Link
                  key={pkg.name}
                  href={pkg.link || "#"}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >

                  <div>

                    {pkg.tag && (
                      <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                        {pkg.tag}
                      </div>
                    )}

                    {/* Image */}

                    <div className="relative h-48 overflow-hidden bg-slate-950">

                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    </div>

                    <div className="p-5 text-white">

                      <h3
                        className="text-xl font-bold font-times mb-1 text-white"
                        style={{
                          fontFamily:
                            "'Times New Roman', Times, Georgia, serif",
                        }}
                      >
                        {pkg.name}
                      </h3>

                      <p className="text-slate-300 mb-3 text-xs leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Pricing */}

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-4">

                        {pkg.groupPrice ? (

                          <div className="space-y-0.5">

                            <div className="flex items-end gap-2">

                              <div className="text-2xl font-bold text-amber-400">
                                ₹{pkg.groupPrice}
                              </div>

                              <span className="text-xs font-semibold text-amber-300/90 mb-0.5">
                                per person (Group)
                              </span>

                              {pkg.originalPrice && (
                                <div className="text-sm text-slate-400 line-through mb-0.5">
                                  {pkg.originalPrice}
                                </div>
                              )}

                            </div>

                            {pkg.singlePrice && (
                              <p className="text-[11px] font-medium text-slate-300">
                                Single Entry: ₹{pkg.singlePrice}
                              </p>
                            )}

                          </div>

                        ) : (

                          <div className="flex items-end gap-2">

                            <div className="text-2xl font-bold text-amber-400">
                              {pkg.discountedPrice}
                            </div>

                            {pkg.originalPrice && (
                              <div className="text-sm text-slate-400 line-through mb-0.5">
                                {pkg.originalPrice}
                              </div>
                            )}

                            {hasSavings && (
                              <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 mb-0.5">
                                Save {savingsPercent}%
                              </div>
                            )}

                          </div>

                        )}

                        <p className="text-[10px] text-slate-400 mt-1">
                          Per person pricing
                        </p>

                      </div>

                      {/* Package Includes */}

                      <div className="mb-2">

                        <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                          Package Includes
                        </p>

                      </div>

                      <ul className="space-y-1.5">

                        {pkg.inclusions.map((item, index) => (
                          <li
                            key={`${item}-${index}`}
                            className="flex items-start gap-2 text-xs text-slate-200"
                          >
                            <span className="text-amber-400 font-bold">
                              ✓
                            </span>

                            <span>{item}</span>
                          </li>
                        ))}

                      </ul>

                      {/* =================================================
                          SEPARATE NOTE SECTION
                      ================================================= */}

                      <NoteSection note={pkg.note} />

                    </div>

                  </div>

                  <div className="px-5 pb-5 pt-1 text-slate-900">

                    <InteractiveHoverButton>
                      BUY TICKETS
                    </InteractiveHoverButton>

                  </div>

                </Link>
              );
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          STAY & ACCOMMODATION
      ===================================================== */}

      {accommodationCards.length > 0 && (

        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">

          <div className="text-center mb-8">

            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Overnight Experience
            </p>

            <h2
              className="text-2xl md:text-3xl font-bold text-white font-times uppercase"
              style={{
                fontFamily:
                  "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Stay & Accommodation Packages
            </h2>

            <p className="text-slate-300 text-xs md:text-sm mt-1">
              Extend your stay with peaceful campfire nights and luxury
              camping accommodations
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">

            {accommodationCards.map((pkg) => {

              const originalVal = pkg.originalPrice
                ? parseInt(
                  pkg.originalPrice.replace(/[^\d]/g, '')
                )
                : 0;

              const discountedVal = pkg.discountedPrice
                ? parseInt(
                  pkg.discountedPrice.replace(/[^\d]/g, '')
                )
                : 0;

              const hasSavings =
                originalVal > discountedVal;

              const savingsPercent = hasSavings
                ? Math.round(
                  ((originalVal - discountedVal) /
                    originalVal) *
                  100
                )
                : 0;

              return (
                <Link
                  key={pkg.name}
                  href={pkg.link || "#"}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between mx-auto w-full"
                >

                  <div>

                    {pkg.tag && (
                      <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                        {pkg.tag}
                      </div>
                    )}

                    {/* Image */}

                    <div className="relative h-48 overflow-hidden bg-slate-950">

                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                    </div>

                    <div className="p-5 text-white">

                      <h3
                        className="text-xl font-bold font-times mb-1 text-white"
                        style={{
                          fontFamily:
                            "'Times New Roman', Times, Georgia, serif",
                        }}
                      >
                        {pkg.name}
                      </h3>

                      <p className="text-slate-300 mb-3 text-xs leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Pricing */}

                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-4">

                        <div className="flex items-end gap-2">

                          <div className="text-2xl font-bold text-amber-400">
                            {pkg.discountedPrice}
                          </div>

                          {pkg.originalPrice && (
                            <div className="text-sm text-slate-400 line-through mb-0.5">
                              {pkg.originalPrice}
                            </div>
                          )}

                          {hasSavings && (
                            <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 mb-0.5">
                              Save {savingsPercent}%
                            </div>
                          )}

                        </div>

                        <p className="text-[10px] text-slate-400 mt-1">
                          Per person / night pricing
                        </p>

                      </div>

                      {/* Package Includes */}

                      <div className="mb-2">

                        <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                          Package Includes
                        </p>

                      </div>

                      <ul className="space-y-1.5">

                        {pkg.inclusions.map((item, index) => (
                          <li
                            key={`${item}-${index}`}
                            className="flex items-start gap-2 text-xs text-slate-200"
                          >
                            <span className="text-amber-400 font-bold">
                              ✓
                            </span>

                            <span>{item}</span>
                          </li>
                        ))}

                      </ul>

                      {/* =================================================
                          SEPARATE NOTE SECTION
                      ================================================= */}

                      <NoteSection note={pkg.note} />

                    </div>

                  </div>

                  <div className="px-5 pb-5 pt-1 text-slate-900">

                    <InteractiveHoverButton>
                      BUY TICKETS
                    </InteractiveHoverButton>

                  </div>

                </Link>
              );
            })}

          </div>

        </section>
      )}

    </main>
  );
};

export default Page;