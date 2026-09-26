import FAQ from "@/components/FAQ";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Attractions from "@/components/Attractions";
import Testimonials from "@/components/Testimonials";
import { getHeroData, getCuratedDestinationsVideos, getGalleryMedia } from "@/lib/data-fetchers";

export const revalidate = 300; // Revalidate static content cache every 5 minutes

export default async function Home() {
  const [heroData, curatedVideos, galleryMedia] = await Promise.all([
    getHeroData(),
    getCuratedDestinationsVideos(),
    getGalleryMedia(),
  ]);

  return (
    <main className="overflow-x-hidden bg-gradient-to-b from-cyan-300 via-sky-200 via-teal-100 to-sky-50 text-slate-900">
      <h1 className="hidden">Best Water Park in Nagpur Shivtirth Water Park</h1>
      <p className="hidden">Looking for the best water park in Nagpur? Shivtirth Water Park near Umari Dam offers thrilling rides, boating, dining and camping for families and groups.</p>
      <Hero initialData={heroData} />
      <Attractions initialVideos={curatedVideos} />
      <Testimonials />
      <Gallery initialMedia={galleryMedia} />
      <FAQ />
    </main>
  );
}
