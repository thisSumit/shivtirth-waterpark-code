import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exotic Bird Park & Aviary Sanctuary in Nagpur | Shivtirth Park",
  description:
    "Visit the Exotic Bird Park at Shivtirth near Nagpur. Walk-through aviary featuring vibrant exotic birds, educational nature tours, and interactive feeding.",
  keywords: [
    "bird park nagpur",
    "exotic bird park saoner",
    "aviary sanctuary nagpur",
    "bird watching nagpur",
    "nature park nagpur",
    "shivtirth bird sanctuary",
  ],
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com/bird-park",
  },
  openGraph: {
    title: "Exotic Bird Park & Sanctuary in Nagpur - Shivtirth Bird Park",
    description:
      "Explore rare exotic birds, walk-through natural aviaries, and family nature tours at Shivtirth Water & Bird Park.",
    url: "https://www.shivtirthwaterpark.com/bird-park",
  },
};

export default function BirdParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
