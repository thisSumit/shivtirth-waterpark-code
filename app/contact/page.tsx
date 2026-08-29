import type { Metadata } from "next";
import { ContactForm } from "../../components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Shivtirth Water Park | Best Water Park in Nagpur",
  description:
    "Get in touch with Shivtirth Water Park for bookings, timings, and queries. Visit or contact the best water park in Nagpur for family fun.",
  keywords: [
    "contact shivtirth water park",
    "shivtirth water park nagpur",
    "best water park in nagpur",
    "water park near nagpur",
  ],
  openGraph: {
    title: "Contact Shivtirth Water Park",
    description:
      "Have questions or planning a visit? Get in touch with Shivtirth Water Park, the best water park in Nagpur.",
    siteName: "Shivtirth Water Park",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactForm />;
}
