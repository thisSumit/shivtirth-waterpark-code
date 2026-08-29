import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from "next";
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Package = {
  name: string;
  image: string;
  originalPrice: string;
  discountedPrice: string;
  tag?: string;
  description: string;
  inclusions: string[];
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
  singlePrice: number | null;
  groupPrice: number | null;
};

type TicketOption = {
  id?: string | number;
  label?: string;
  price?: number | string;
};

export const metadata: Metadata = {
  title: "Latest Offers | Shivtirth Water Park",
  description:
    "Discover exclusive offers at Shivtirth Water Park including Tadka Thursday, Exam Offer, Student Offer, and Ladies Special. Book now and save big!",
  keywords: [
    "shivtirth water park offers",
    "water park offers nagpur",
    "student offer water park",
    "ladies special water park",
  ],
  openGraph: {
    title: "Exclusive Offers at Shivtirth Water Park",
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

const defaultOffers = [
  {
    title: 'Monsoon Picnic Hungama',
    image: '/offers/banner4.png',
    alt: 'Monsoon picnic offer at Shivtirth Water Park',
    highlight: '🎉 MONSOON PICNIC, HUNGAMA SHURU',
    description: '🎟️ Waterpark + Amusement + Adventure + Bird Park (1 Ticket 4 Parks)',
    oldPrice: '₹620',
    newPrice: '₹590',
    badge: 'Free Pakoda & High Tea',
    cta: '👉 Book Monsoon Picnic',
    link: '/billing?planId=monsoon-picninic-hungama',
    footer: '⏳ Limited Period Offer',
    singlePrice: null,
    groupPrice: null,
  },
  {
    title: 'LADKI BAHIN SPECIAL OFFER',
    image: '/offers/banner3.jpeg',
    alt: 'Ladies special offer at Shivtirth Water Park',
    highlight: '🎟️ Ladies Only',
    description: '',
    oldPrice: '₹790',
    newPrice: '₹550',
    badge: 'अपनी सहेलियों के साथ, एक यादगार दिन।',
    cta: '👉 Book Ladies Offer',
    link: '/billing?planId=ladki-bahin-special',
    footer: '💝 Group Offer: ₹550 per person',
    singlePrice: 690,
    groupPrice: 550,
  },
];

const defaultPackages = [
  {
    name: "Water Park Package",
    image: "/waterpark-1.jpg",
    originalPrice: "₹790",
    discountedPrice: "₹590",
    tag: "Most Popular",
    description: "Enjoy Various Park with nature of Great Satpuda Mountain",
    inclusions: ["Waterpark access", "Adventure park & 3d show", "Amusement park", "Safari experience", "Agro activities"],
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
    description: "Enjoy Unlimited boating fun with exciting thrill rides",
    inclusions: ["Banana, Speed & Disco Boat", "Shikara, Kayak & Paddle Boat", "Dragon, Train & Sofa Boat", "Octopus Ride", "Zorbing Ball"],
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
    description: "Waterpark Package + Boating Park Package Activities- The perfect combination for exciting fun",
    inclusions: ["All Water Park activities", "All Boating rides (7 rides)", "Full day access"],
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
    inclusions: ["Waterpark Package", "Boating Package", "Food-(Breakfast, Lunch, Hi-Tea)"],
    cta: "Book Golden Package",
    link: '/billing?planId=golden-package',
    singlePrice: null,
    groupPrice: null,
  },
];

const defaultAccommodation = [
  {
    name: "Day & Night Package",
    image: "/Stay-Facilities.jpg",
    originalPrice: "₹3000",
    discountedPrice: "₹2500",
    tag: "Ultimate Stay",
    description: "Extended stay with overnight camping experience & farmhouse stay options",
    inclusions: ["Waterpark + Boating", "Stay Facilities- Camping stay / Farm House", "2 Meals included", "Bonfire & activities", "Breakfast next day"],
    cta: "Book Stay Package",
    link: '/billing?planId=stay-package',
    singlePrice: null,
    groupPrice: null,
  },
];

const page = async () => {
  const resolveBillingLink = (planId: string | undefined, groupPrice?: number | null) => {
    const link = planId ? `/billing?planId=${encodeURIComponent(planId)}` : '/billing'

    if (groupPrice == null) return link
    const separator = link.includes('?') ? '&' : '?'
    return `${link}${separator}groupPrice=${groupPrice}`
  }

  let offerCards: OfferCard[] = [];
  let packageCards: Package[] = [];
  let accommodationCards: Package[] = [];

  try {
    const { data: dbAll } = await supabase
      .from('packages')
      .select('*')
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    const now = Date.now();
    const visiblePackages = (dbAll || []).filter((item) => !item.hide_after || new Date(item.hide_after).getTime() > now);

    if (visiblePackages.length > 0) {
      const offers = visiblePackages.filter((item) => item.category === 'offer');
      const packages = visiblePackages.filter((item) => item.category === 'package');
      const accommodation = visiblePackages.filter((item) => item.category === 'accommodation');

      if (offers.length > 0) {
        offerCards = offers.map((item) => {
          const ticketOpts: TicketOption[] = Array.isArray(item.ticket_options) ? item.ticket_options : [];
          const singleOpt = ticketOpts.find((o) => String(o.id ?? '').includes('single') || String(o.label ?? '').toLowerCase().includes('single'));
          const groupOpt = ticketOpts.find((o) => String(o.id ?? '').includes('group') || String(o.label ?? '').toLowerCase().includes('group'));

          return {
            title: item.name,
            image: item.image,
            alt: item.name,
            highlight: item.highlight || '',
            description: item.description || '',
            oldPrice: item.original_price ? `₹${item.original_price}` : '',
            newPrice: `₹${item.discounted_price}`,
            badge: item.tag || 'Special Offer',
            cta: item.cta || 'Book Now',
            link: resolveBillingLink(item.plan_id, groupOpt?.price != null ? Number(groupOpt.price) : null),
            footer: item.footer || '',
            singlePrice: singleOpt?.price != null ? Number(singleOpt.price) : null,
            groupPrice: groupOpt?.price != null ? Number(groupOpt.price) : null,
          };
        });
      } else {
        offerCards = defaultOffers;
      }

      if (packages.length > 0) {
        packageCards = packages.map((item) => {
          const ticketOpts: TicketOption[] = Array.isArray(item.ticket_options) ? item.ticket_options : [];
          const singleOpt = ticketOpts.find((o) => String(o.id ?? '').includes('single') || String(o.label ?? '').toLowerCase().includes('single'));
          const groupOpt = ticketOpts.find((o) => String(o.id ?? '').includes('group') || String(o.label ?? '').toLowerCase().includes('group'));

          return {
            name: item.name,
            image: item.image,
            originalPrice: item.original_price ? `₹${item.original_price}` : '',
            discountedPrice: `₹${item.discounted_price}`,
            tag: item.tag || undefined,
            description: item.description || '',
            inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
            cta: item.cta || 'Book Now',
            link: resolveBillingLink(item.plan_id, groupOpt?.price != null ? Number(groupOpt.price) : null),
            singlePrice: singleOpt?.price != null ? Number(singleOpt.price) : null,
            groupPrice: groupOpt?.price != null ? Number(groupOpt.price) : null,
          };
        });
      } else {
        packageCards = defaultPackages;
      }

      if (accommodation.length > 0) {
        accommodationCards = accommodation.map((item) => {
          const ticketOpts: TicketOption[] = Array.isArray(item.ticket_options) ? item.ticket_options : [];
          const singleOpt = ticketOpts.find((o) => String(o.id ?? '').includes('single') || String(o.label ?? '').toLowerCase().includes('single'));
          const groupOpt = ticketOpts.find((o) => String(o.id ?? '').includes('group') || String(o.label ?? '').toLowerCase().includes('group'));

          return {
            name: item.name,
            image: item.image,
            originalPrice: item.original_price ? `₹${item.original_price}` : '',
            discountedPrice: `₹${item.discounted_price}`,
            tag: item.tag || undefined,
            description: item.description || '',
            inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
            cta: item.cta || 'Book Now',
            link: resolveBillingLink(item.plan_id, groupOpt?.price != null ? Number(groupOpt.price) : null),
            singlePrice: singleOpt?.price != null ? Number(singleOpt.price) : null,
            groupPrice: groupOpt?.price != null ? Number(groupOpt.price) : null,
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
    console.error("Error loading dynamically in server component:", err);
    offerCards = defaultOffers;
    packageCards = defaultPackages;
    accommodationCards = defaultAccommodation;
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50 text-slate-900 pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-8 text-center">
          <h1 className="inline-block px-4 py-2 rounded-full bg-accent/20 border border-accent/40 text-accent font-semibold mb-4 text-lg uppercase tracking-wider">
            Offers & Packages
          </h1>
          {/* <h1 className="text-4xl uppercase md:text-6xl font-black mb-6 leading-tight">
            Shivtirth Water Park<br className="hidden md:block" /> Best Deals & Discounts
          </h1> */}
          <p className="text-md font-medium text-slate-300">
            WATER PARK PACKAGE | ONLY BOATING PACKAGE | SILVER COMBO PACKAGE | GOLDEN FULL PACKAGE | DAY & NIGHT STAY PACKAGE | MEAL PACKAGE | FUNCTION PACKAGE
          </p>
        </div>
      </div>

      {/* Special Offers Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offerCards.map((offer) => (
            <Link
              key={offer.title}
              href={offer.link}
              aria-label={offer.cta}
              className="group flex h-full flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
                <Image
                  src={offer.image}
                  alt={offer.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover aspect-[9/16] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-1 flex-col">
                {/* <p className="inline-block mb-3 rounded-full bg-accent/15 border border-accent/40 px-3 py-1 text-sm font-semibold max-w-fit">
                  {offer.badge}
                </p> */}
                <h2 className="text-2xl font-black mb-2">{offer.title}</h2>
                <p className="font-bold mb-2">{offer.highlight}</p>
                <p className="text-slate-600 mb-4 text-sm">{offer.description}</p>

                {offer.groupPrice ? (
                  <div className="space-y-1 mb-4">
                    <div className="flex items-end gap-3">
                      <span className="text-2xl font-medium text-slate-900">₹{offer.groupPrice}</span>
                      <span className="text-xs font-bold text-slate-500 mb-1">per person (Group)</span>
                      {!!offer.oldPrice && <span className="text-slate-400 line-through text-lg mb-0.5">{offer.oldPrice}</span>}
                    </div>
                    {offer.singlePrice && (
                      <p className="text-xs font-semibold text-slate-600">Single Entry Price: ₹{offer.singlePrice}</p>
                    )}
                  </div>
                ) : (
                  !!offer.newPrice && (
                    <div className="flex items-end gap-3 mb-4">
                      {!!offer.oldPrice && <span className="text-slate-400 line-through text-xl">{offer.oldPrice}</span>}
                      <span className="text-2xl font-medium text-slate-900">{offer.newPrice}</span>
                    </div>
                  )
                )}

                {offer.title.includes('LADKI BAHIN') && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4 text-xs text-slate-700 space-y-1">
                    <p>• Waterpark + Amusement + Adventure (3 Parks = 1 Ticket) </p>
                    <p>• Complimentary Welcome Drink</p>
                    <p>• Group Offer: ₹550 per person</p>
                    <p>• Perfect for friends&apos; day out</p>
                  </div>
                )}

                {/* {offer.footer && <p className="text-sm text-slate-500 mb-4">{offer.footer}</p>} */}

                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 font-bold text-black group-hover:opacity-90 transition">
                    BUY TICKETS
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Packages Section */}
      <section className="md:px-8 py-10 bg-slate-50/50 border-y border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black uppercase">Standard Packages</h2>
          <p className="text-slate-600 text-sm">We have the perfect packages to match your plan and budget.</p>
        </div>

        <div id="packages-list" className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packageCards.map((pkg) => {
              const originalVal = pkg.originalPrice ? parseInt(pkg.originalPrice.replace(/[^\d]/g, '')) : 0;
              const discountedVal = pkg.discountedPrice ? parseInt(pkg.discountedPrice.replace(/[^\d]/g, '')) : 0;
              const hasSavings = originalVal > discountedVal;
              const savingsPercent = hasSavings ? Math.round(((originalVal - discountedVal) / originalVal) * 100) : 0;

              return (
                <Link
                  key={pkg.name}
                  href={pkg.link || "#"}
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
                >
                  <div>
                    {pkg.tag && (
                      <div className="absolute top-4 right-4 z-10 px-4 py-1 rounded-full bg-accent text-black text-sm font-bold shadow-lg">
                        {pkg.tag}
                      </div>
                    )}

                    <div className="relative h-56 overflow-hidden bg-slate-200">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                      <p className="text-slate-600 mb-4 text-xs leading-relaxed">{pkg.description}</p>

                      {pkg.groupPrice ? (
                        <div className="space-y-1 mb-4">
                          <div className="flex items-end gap-3">
                            <div className="text-2xl font-black text-slate-900">₹{pkg.groupPrice}</div>
                            <span className="text-xs font-bold text-slate-500 mb-1">per person (Group)</span>
                            {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                          </div>
                          {pkg.singlePrice && (
                            <p className="text-xs font-semibold text-slate-600">Single Entry Price: ₹{pkg.singlePrice}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-end gap-3 mb-4">
                          <div className="text-2xl font-medium text-slate-900">{pkg.discountedPrice}</div>
                          {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                          {hasSavings && (
                            <div className="text-sm font-bold text-green-600 mb-1">
                              Save {savingsPercent}%
                            </div>
                          )}
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mb-4">Per person pricing</p>

                      <div className="mb-2 rounded-lg">
                        <p className="text-xs font-bold text-slate-900">Package Includes</p>
                        {/* {pkg.name.includes("Water Park") && <p className="text-xs text-slate-600">✓ Best for water lovers</p>}
                        {pkg.name.includes("Boating") && <p className="text-xs text-slate-600">✓ Perfect for thrill seekers</p>}
                        {pkg.name.includes("Silver") && <p className="text-xs text-slate-600">✓ Water + Boating combo • Maximum fun</p>}
                        {pkg.name.includes("Golden") && <p className="text-xs text-slate-600">✓ Meals included • Best for families</p>} */}
                      </div>

                      <ul className="space-y-2 mb-6">
                        {pkg.inclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-accent text-lg">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
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

      {/* Stay & Accommodation Packages Section */}
      {accommodationCards.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black uppercase">Stay & Accommodation Packages</h2>
            <p className="text-slate-600 text-sm">Extend your stay with peaceful campfire nights and luxury camping accommodations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {accommodationCards.map((pkg) => {
              const originalVal = pkg.originalPrice ? parseInt(pkg.originalPrice.replace(/[^\d]/g, '')) : 0;
              const discountedVal = pkg.discountedPrice ? parseInt(pkg.discountedPrice.replace(/[^\d]/g, '')) : 0;
              const hasSavings = originalVal > discountedVal;
              const savingsPercent = hasSavings ? Math.round(((originalVal - discountedVal) / originalVal) * 100) : 0;

              return (
                <Link
                  key={pkg.name}
                  href={pkg.link || "#"}
                  className="group relative rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between mx-auto w-full"
                >
                  <div>
                    {pkg.tag && (
                      <div className="absolute top-4 right-4 z-10 px-4 py-1 rounded-full bg-accent text-black text-sm font-bold shadow-lg">
                        {pkg.tag}
                      </div>
                    )}

                    <div className="relative h-56 overflow-hidden bg-slate-200">
                      <Image
                        src={pkg.image}
                        alt={pkg.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-black mb-2">{pkg.name}</h3>
                      <p className="text-slate-600 mb-4 text-xs leading-relaxed">{pkg.description}</p>

                      <div className="flex items-end gap-3 mb-4">
                        <div className="text-2xl font-medium text-slate-900">{pkg.discountedPrice}</div>
                        {pkg.originalPrice && <div className="text-xl text-slate-400 line-through mb-1">{pkg.originalPrice}</div>}
                        {hasSavings && (
                          <div className="text-sm font-bold text-green-600 mb-1">
                            Save {savingsPercent}%
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 mb-4">Per person / night pricing</p>

                      <div className="mb-2 rounded-lg">
                        <p className="text-xs font-bold text-slate-900">Package Includes</p>
                      </div>

                      <ul className="space-y-2 mb-6">
                        {pkg.inclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                            <span className="text-accent text-lg">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
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

      {/* <div className="mt-8 text-center">
        <Link href="/packages" className="inline-flex items-center rounded-full border border-slate-300 px-6 py-3 font-bold text-slate-800 hover:bg-slate-100 transition shadow-xs">
          View Detailed Package Table
        </Link>
      </div> */}
    </main>
  );
};

export default page;