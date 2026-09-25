import { supabase } from './supabase';
import { cache } from 'react';

export const getHeroData = cache(async () => {
  try {
    const { data } = await supabase
      .from('website_content')
      .select('content')
      .eq('section', 'hero')
      .single();

    if (data?.content) {
      const rawVideo = data.content.videoUrl;
      return {
        title1: data.content.title1 || data.content.title || "Shivtirth",
        title2: data.content.title2 || "Best Water Park & Resorts",
        description: data.content.description || "Waterpark | Boating Park | Adventure Park | Amusement Park | Safari | Bird Park | Agro Park | Helicopter Ride | Wedding | Accommodation | Corporate Events | Festival Celebrations | Birthday Events | Special School Picnic",
        videoUrl: (rawVideo && rawVideo.trim()) ? rawVideo.trim() : '/hero.mp4',
        posterUrl: data.content.bgImageUrl || data.content.posterUrl || "/p6.jpg",
        subTitle: data.content.subTitle || "मौज मस्ती चाहिये, शिवतीर्थ आइए",
      };
    }
  } catch (err) {
    console.error("Error fetching hero data on server:", err);
  }

  return {
    title1: "Shivtirth",
    title2: "Best Water Park & Resorts",
    description: "Waterpark | Boating Park | Adventure Park | Amusement Park | Safari | Bird Park | Agro Park | Helicopter Ride | Wedding | Accommodation | Corporate Events | Festival Celebrations | Birthday Events | Special School Picnic",
    videoUrl: "/hero.mp4",
    posterUrl: "/p6.jpg",
    subTitle: "मौज मस्ती चाहिये, शिवतीर्थ आइए"
  };
});

export const getNavbarActivities = cache(async () => {
  const defaultParks = [
    { name: "Agro Park", id: "agro-park" },
    { name: "Air Tourism", id: "air-tourism" },
    { name: "Wedding Celebrations", id: "wedding-celebrations" },
    { name: "Dining", id: "dining" },
    { name: "Corporate Events", id: "corporate-events" },
    { name: "Birthday Parties", id: "birthday-parties" },
    { name: "Festive Celebrations", id: "festive-celebrations" },
    { name: "Event Planning", id: "event-planning" },
  ];

  try {
    const { data, error } = await supabase
      .from("activities")
      .select("id, title")
      .eq("is_hidden", false)
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data
        .filter((act) => {
          const title = act.title?.toLowerCase() || "";
          return !title.includes("accommodation") && !title.includes("stay");
        })
        .map((act) => ({
          name: act.title,
          id: (act.title || "")
            .toLowerCase()
            .replace(/&/g, "and")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-"),
        }));
    }
  } catch (err) {
    console.error("Error loading navbar activities on server:", err);
  }

  return defaultParks;
});

export const getCuratedDestinationsVideos = cache(async () => {
  try {
    const { data, error } = await supabase
      .from("website_content")
      .select("content")
      .eq("section", "curated_destinations")
      .single();

    if (!error && data?.content?.videos) {
      return data.content.videos as Record<string, string>;
    }
  } catch (err) {
    console.error("Error loading curated destination videos on server:", err);
  }
  return {};
});

export const getGalleryMedia = cache(async () => {
  const defaultMedia = [
    { type: "image" as const, src: "/o11.jpg" },
    { type: "image" as const, src: "/air-tourism.jpg" },
    { type: "image" as const, src: "/a4.jpg" },
    { type: "youtube" as const, url: "https://youtube.com/shorts/Ew8q8UF3p_s?si=avdT_x7Ah2ZWGYda" },
    { type: "image" as const, src: "/foam-dance.jpg" },
    { type: "image" as const, src: "/Adventure-Park.jpg" },
    { type: "youtube" as const, url: "https://www.youtube.com/shorts/ciOg6AOlTzE" },
    { type: "image" as const, src: "/birdspark-1.jpg" },
    { type: "image" as const, src: "/p1.jpeg" },
    { type: "image" as const, src: "/adventure.jpg" },
    { type: "image" as const, src: "/ag4.jpg" },
  ];

  try {
    const { data } = await supabase
      .from('gallery')
      .select('type, src, is_hidden')
      .order('display_order', { ascending: true });

    if (data && data.length > 0) {
      const visibleData = data.filter((item: any) => item.is_hidden !== true);
      if (visibleData.length > 0) {
        return visibleData.map((item) => {
          if (item.type === 'youtube') {
            return { type: 'youtube' as const, url: item.src };
          } else {
            return { type: item.type as "image" | "video", src: item.src };
          }
        });
      }
    }
  } catch (err) {
    console.error("Error loading gallery media on server:", err);
  }

  return defaultMedia;
});
