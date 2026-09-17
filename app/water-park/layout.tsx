import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Water Park in Nagpur & Maharashtra | Thrill Slides & Wave Pool",
  description:
    "Explore Shivtirth Water Park near Nagpur & Saoner. Featuring thrilling high-speed water slides, giant wave pool, rain dance DJ floor, family splash pools and kids pool.",
  keywords: [
    "best water park in nagpur",
    "water park ticket price",
    "wave pool in nagpur",
    "water slides nagpur",
    "water park near me",
    "water park near saoner",
    "rain dance water park",
    "family water rides nagpur",
  ],
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com/water-park",
  },
  openGraph: {
    title: "Best Water Park in Nagpur & Maharashtra - Shivtirth Water Park",
    description:
      "Giant wave pools, thrilling water slides, umbrella showers, and rain dance floor at Shivtirth Water Park near Umari Dam, Saoner.",
    url: "https://www.shivtirthwaterpark.com/water-park",
  },
};

export default function WaterParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
