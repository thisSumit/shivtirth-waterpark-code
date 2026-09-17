import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resort Stay & Luxury Tent Camping near Nagpur | Shivtirth Resort",
  description:
    "Book deluxe AC room stay, wooden eco-cottages, and luxury lakeside camping tents at Shivtirth Water Park & Resort near Umari Dam, Saoner, Nagpur.",
  keywords: [
    "resort near nagpur with water park",
    "camping near nagpur",
    "shivtirth resort room booking",
    "tent stay umari dam",
    "family resort saoner",
    "night stay water park nagpur",
  ],
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com/accommodation",
  },
  openGraph: {
    title: "Resort Accommodation & Camping - Shivtirth Resort Nagpur",
    description:
      "Stay in deluxe AC rooms, wooden cottages, or luxury camping tents with campfire near Umari Dam backwaters.",
    url: "https://www.shivtirthwaterpark.com/accommodation",
  },
};

export default function AccommodationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
