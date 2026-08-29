import type { Metadata } from "next";
import ParkPage from "@/components/ParkPage";

export const metadata: Metadata = {
  title: "Best Park in Nagpur | Water Park & Experiences – Shivtirth",
  description:
    "Discover the best park in Nagpur at Shivtirth Water Park. From thrilling water rides to family-friendly experiences, enjoy unforgettable fun for all ages.",
  keywords: [
    "best park in nagpur",
    "best water park in nagpur",
    "amusement park nagpur",
    "family park nagpur",
    "things to do in nagpur",
  ],
  openGraph: {
    title: "Parks & Experiences | Best Park in Nagpur",
    description:
      "Explore thrilling rides, water attractions, and unforgettable experiences at Shivtirth,  the best park in Nagpur.",
    siteName: "Shivtirth Water Park",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const page = () => {
  return <ParkPage />;
};

export default page;