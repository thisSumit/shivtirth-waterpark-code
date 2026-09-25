'use client';
import FAQ from "@/components/FAQ";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <h1 className="hidden">Best Water Park in Nagpur Shivtirth Water Park</h1>
      <p className="hidden">Looking for the best water park in Nagpur? Shivtirth Water Park near Umari Dam offers thrilling rides, boating, dining and camping for families and groups.</p>
      <Hero />
      <Attractions />
      <Testimonials />
      <Gallery />
      <FAQ />
    </main>
  );
}
