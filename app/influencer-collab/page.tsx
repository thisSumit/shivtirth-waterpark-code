import type { Metadata } from "next";
import InfluencerCollab from "@/components/InfluencerCollab";

export const metadata: Metadata = {
  title: "Influencer Collaboration | Shivtirth Water Park",
  description:
    "Collaborate with Shivtirth Water Park as an influencer. Submit your profile, review brand guidelines, and create exciting social content from Nagpur's top adventure destination.",
  keywords: [
    "shivtirth influencer collaboration",
    "nagpur influencer collaboration",
    "water park influencer program",
    "instagram reels collaboration",
  ],
  openGraph: {
    title: "Join Shivtirth Influencer Family",
    description:
      "Apply for Shivtirth influencer collaborations and create content across water park, boating, and adventure experiences.",
    siteName: "Shivtirth Water Park",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InfluencerCollabPage() {
  return <InfluencerCollab />;
}