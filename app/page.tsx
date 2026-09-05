'use client';
import Venue from "@/components/Celebration";
import CommonFacilitiesRules from '@/components/CommonFacilitiesRules';
import CommonRules from "@/components/CommonRules";
import Description from "@/components/Description";
import FAQ from "@/components/FAQ";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import Logos from "@/components/Logos";
import OfferSection from "@/components/OfferSection";
import Package from "@/components/Package";
import PopUp from "@/components/PopUp";
import Speciallity from "@/components/Speciallity";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <h1 className="hidden">Best Water Park in Nagpur Shivtirth Water Park</h1>
      <p className="hidden">Looking for the best water park in Nagpur? Shivtirth Water Park near Umari Dam offers thrilling rides, boating, dining and camping for families and groups.</p>
      <Hero />
      {/* <Logos/> */}
      {/* <Description/> */}
      {/* <OfferSection/> */}
      {/* <Speciallity /> */}
      <Attractions />
      {/* <CommonFacilitiesRules /> */}
      {/* <Package/> */}
      {/* <Venue/> */}
      {/* <Description/> */}
      <Gallery />
      <Testimonials />
      <FAQ />
      {/* <CommonRules/> */}
    </main>
  );
}
