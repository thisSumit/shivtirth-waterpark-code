import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Logos from "@/components/Logos";
import { getWhatsAppBookingHref } from "@/lib/whatsapp";
import Testimonials from "@/components/Testimonials";
import { Sparkles } from "lucide-react";
import CommonRules from "@/components/CommonRules";
import CommonFacilitiesRules from "@/components/CommonFacilitiesRules";
import Speciallity from "@/components/Speciallity";

const FacilitiesRulesPage = () => {
  const whatsappHref = getWhatsAppBookingHref();

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">

      {/* =========================
          HERO
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#023047] via-[#005f73] to-[#004e64] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-300 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 pb-6 text-center md:px-8 pt-36">

          <h1
            className="text-2xl font-bold uppercase leading-tight tracking-wide text-white md:text-3xl"
            style={{
              fontFamily: "'Times New Roman', Times, Georgia, serif",
            }}
          >
            Facilities & Rules
          </h1>

          <p className="mx-auto max-w-4xl text-sm leading-relaxed text-cyan-50/90">
             At Shivtirth, we are committed to providing every visitor with a
            safe, comfortable and enjoyable experience.
          </p>
        </div>
      </section>

      <Speciallity />
      <CommonFacilitiesRules />
      <CommonRules/>

    </main>
  );
};

export default FacilitiesRulesPage;