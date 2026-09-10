import Image from 'next/image';
import type { Metadata } from "next";
import { createClient } from '@supabase/supabase-js';
import OffersView, { OfferCardItem, PackageItem } from '@/components/OffersView';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://placeholder-project-id.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'placeholder-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

const defaultOffers: OfferCardItem[] = [
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

const defaultPackages: PackageItem[] = [
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

const defaultAccommodation: PackageItem[] = [
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

  let offerCards: OfferCardItem[] = [];
  let packageCards: PackageItem[] = [];
  let accommodationCards: PackageItem[] = [];

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
              <h1
                className="text-4xl font-bold text-accent drop-shadow-lg font-times uppercase tracking-wide"
                style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
              >
                Offer & Packages
              </h1>
              <p className="mt-2 text-sm text-cyan-100/90 drop-shadow-sm font-medium">
                Customized and Affordable Various packages designed for every age group having special discounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          OFFERS & PACKAGES TABS VIEW
      ===================================================== */}
      <OffersView
        offerCards={offerCards}
        packageCards={packageCards}
        accommodationCards={accommodationCards}
      />
    </main>
  );
};

export default Page;
