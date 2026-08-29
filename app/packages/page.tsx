import PackagesPage from '@/components/PackagesPage'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Park Packages & Prices in Nagpur | Shivtirth Water Park",
  description:
    "Explore thrilling water park packages at Shivtirth Water Park, Nagpur. Affordable prices for solo visitors, families, and groups. Book your adventure today!",
  keywords: [
    "shivtirth water park packages",
    "water park ticket prices nagpur",
    "best water park packages in nagpur",
    "family water park offers nagpur",
    "group water park packages",
  ],
  openGraph: {
    title: "Thrilling Water Park Packages | Shivtirth Water Park",
    description:
      "Choose from specially curated water park packages designed for solo visitors, families, and adventure lovers in Nagpur.",
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
  return (
    <PackagesPage/>
  )
}

export default page