import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boating Park in Nagpur | Pedal & Motor Boating at Umari Dam Lake",
  description:
    "Enjoy peaceful pedal boating, motor speed boats, and scenic lakeside views at Shivtirth Boating Park near Umari Dam, Saoner, Nagpur.",
  keywords: [
    "boating park in nagpur",
    "best boating park nagpur",
    "umari dam boating",
    "pedal boating nagpur",
    "boating lake near saoner",
    "boating resort nagpur",
  ],
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com/boating-park",
  },
  openGraph: {
    title: "Boating Park in Nagpur - Shivtirth Water & Boating Park",
    description:
      "Scenic lake boating, pedal boats, and family boating experiences at Shivtirth Water Park near Umari Dam, Saoner.",
    url: "https://www.shivtirthwaterpark.com/boating-park",
  },
};

export default function BoatingParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
