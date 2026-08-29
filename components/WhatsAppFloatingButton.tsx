"use client";

import { usePathname } from "next/navigation";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";
import { useSiteSettings } from "@/lib/useSiteSettings";

const hiddenRoutes = new Set(["/checkout", "/terms", "/privacy"]);

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const { settings } = useSiteSettings();

  if (!pathname || hiddenRoutes.has(pathname)) {
    return null;
  }

  const whatsappHref = getWhatsAppBookingHref(
    "Hi, Can I get more information about the booking?",
    settings.whatsappNumber
  );

  return (
    <a
      className="fixed bottom-6 right-2 z-50 flex items-end gap-2 p-2 text-white md:right-4 hover:scale-110 transition duration-300 drop-shadow-2xl"
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <img src="/whatsapp.png" alt="WhatsApp" className="h-14 w-14" />
    </a>
  );
}