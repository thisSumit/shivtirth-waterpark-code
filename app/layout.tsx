import type { Metadata } from "next";
import { Montserrat, Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import SiteFooter from "@/components/SiteFooter";

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
  title: {
    default: "Shivtirth Best Water Park in Nagpur",
    template: "%s | Shivtirth Water Park",
  },
  description:
    "Shivtirth Water Park is the best water park in Nagpur offering thrilling water slides, amusement rides, boating, dining and camping near Umari Dam, Saoner.",
  keywords: [
    "best water park in nagpur",
    "shivtirth water park",
    "water park near nagpur",
    "water park near me",
    "boating park in nagpur",
    "best boating park in nagpur",
    "amusement park in nagpur",
    "family water park nagpur",
    "adventure park nagpur",
    "best picnic spot nagpur",
    "school trip nagpur",
    "corporate outing nagpur",
    "water rides nagpur",
    "camping near nagpur",
    "dining in water park nagpur",
  ],
  openGraph: {
    title: "Shivtirth Best Water Park in Nagpur",
    description:
      "Experience thrilling water slides, amusement rides, boating, dining and camping at Shivtirth Water Park near Umari Dam, Saoner, Nagpur.",
    url: "https://shivtirth.com",
    siteName: "Shivtirth Best Water Park",
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TouristAttraction",
              "name": "Shivtirth Best Water Park",
              "description":
                "Best water park in Nagpur offering thrilling water slides, boating, dining and camping.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nagpur, Chandrapur, Bhandara, Gadchiroli, Wardha, Yavatmal, Umred, Saoner",
                "addressRegion": "MH",
                "addressCountry": "IN",
              },
            }),
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
