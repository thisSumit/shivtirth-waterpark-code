import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adventure Park in Nagpur | Zip Line, Rope Course & Thrill Activities",
  description:
    "Experience thrill activities at Shivtirth Adventure Park near Nagpur & Saoner. Featuring zip line, high ropes course, obstacle challenges, and team outings.",
  keywords: [
    "adventure park nagpur",
    "zip line nagpur",
    "rope course nagpur",
    "adventure activities saoner",
    "corporate team outing nagpur",
    "shivtirth adventure park",
  ],
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com/adventure-park",
  },
  openGraph: {
    title: "Adventure Park in Nagpur - Shivtirth Water & Adventure Park",
    description:
      "Zip line rides, high rope courses, obstacle courses, and thrill sports at Shivtirth Adventure Park near Umari Dam, Saoner.",
    url: "https://www.shivtirthwaterpark.com/adventure-park",
  },
};

export default function AdventureParkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
