import type { Metadata } from "next";
import { Montserrat, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.shivtirthwaterpark.com"),
  title: {
    default: "Shivtirth Water Park - Best Water Park in Nagpur & Maharashtra",
    template: "%s | Shivtirth Water Park",
  },
  description:
    "Shivtirth Water Park is the top-rated water park, boating resort, bird park, adventure park and family picnic resort near Umari Dam, Saoner, Nagpur. Experience wave pools, thrill slides, bird watching, camping, and group packages.",
  keywords: [
    "best water park in nagpur",
    "shivtirth water park",
    "water park near me",
    "water park in maharashtra",
    "boating park nagpur",
    "bird park nagpur",
    "adventure park nagpur",
    "family water park nagpur",
    "school picnic water park",
    "corporate picnic spot nagpur",
    "resort with water park nagpur",
    "wave pool nagpur",
    "water rides saoner",
    "shivtirth resort camping",
    "water park entry ticket price",
  ],
  authors: [{ name: "Shivtirth Water Park" }],
  creator: "Shivtirth Water Park",
  publisher: "Shivtirth Water Park",
  alternates: {
    canonical: "https://www.shivtirthwaterpark.com",
  },
  openGraph: {
    title: "Shivtirth Water Park - Best Water Park in Nagpur & Maharashtra",
    description:
      "Experience thrilling water slides, wave pools, boating, bird park, dining and resort camping at Shivtirth Water Park near Umari Dam, Saoner, Nagpur.",
    url: "https://www.shivtirthwaterpark.com",
    siteName: "Shivtirth Water Park",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Best Water Park in Nagpur - Shivtirth Water Park",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivtirth Water Park - Best Water Park in Nagpur",
    description:
      "Thrilling water slides, boating, bird park, adventure activities and camping near Umari Dam, Saoner, Nagpur.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["WaterPark", "AmusementPark", "Resort"],
        "@id": "https://www.shivtirthwaterpark.com/#park",
        "name": "Shivtirth Water Park & Resort",
        "alternateName": ["Shivtirth Water Park", "Shivtirth Boating & Adventure Park"],
        "url": "https://www.shivtirthwaterpark.com",
        "logo": "https://www.shivtirthwaterpark.com/logo.png",
        "image": "https://www.shivtirthwaterpark.com/logo.png",
        "description": "Premier water park, boating resort, bird sanctuary park, adventure park, and family picnic destination near Umari Dam, Saoner, Nagpur, Maharashtra.",
        "telephone": "+91-8605362212",
        "email": "shivtirthtourism@gmail.com",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Near Umari Dam, Saoner",
          "addressLocality": "Nagpur",
          "addressRegion": "Maharashtra",
          "postalCode": "441107",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 21.3850,
          "longitude": 78.9100
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "09:30",
            "closes": "18:30"
          }
        ],
        "amenityFeature": [
          { "@type": "LocationFeatureSpecification", "name": "Wave Pool", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Thrill Water Slides", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Boating Park", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Exotic Bird Park", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Resort Rooms & Tent Stay", "value": true },
          { "@type": "LocationFeatureSpecification", "name": "Pure Veg Restaurant & Dining", "value": true }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.shivtirthwaterpark.com/#website",
        "url": "https://www.shivtirthwaterpark.com",
        "name": "Shivtirth Water Park",
        "publisher": { "@id": "https://www.shivtirthwaterpark.com/#park" }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <meta name="geo.region" content="IN-MH" />
        <meta name="geo.placename" content="Nagpur, Maharashtra, India" />
        <meta name="geo.position" content="21.3850;78.9100" />
        <meta name="ICBM" content="21.3850, 78.9100" />
        <link rel="author" href="https://www.shivtirthwaterpark.com/about" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${montserrat.className} ${montserrat.variable} ${poppins.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <SiteChrome />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
