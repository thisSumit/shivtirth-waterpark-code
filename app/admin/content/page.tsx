"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MediaUploader from "@/components/MediaUploader";
import { Save, AlertCircle, Sparkles, Megaphone, Video, Layers, Compass, Sun } from "lucide-react";

const CURATED_PARKS = [
  { id: "waterpark", name: "Water Park", defaultVideo: "/main.mp4" },
  { id: "boating-park", name: "Boating Park", defaultVideo: "/main.mp4" },
  { id: "adventure-park", name: "Adventure Park", defaultVideo: "/main.mp4" },
  { id: "amusement-park", name: "Amusement Park", defaultVideo: "/main.mp4" },
  { id: "bird-park", name: "Bird Park", defaultVideo: "/main.mp4" },
  { id: "accommodation", name: "Accommodation", defaultVideo: "/main.mp4" },
];

const PARK_PAGE_TYPES = [
  { id: "water-park", name: "Water Park Page", defaultTitle: "Water Park", defaultSub: "Various Water Pools | Waterfall | Family Slides | Body & Tube Slides | Multiplay Station | Various Rain Dances | Splash Buckets | Foam Dance | Glass Floor Dance | Fog & Bubble Dance", defaultDesc: "The waterpark has been created carefully keeping in mind the full enjoyment with new ideas for thrill seekers, families, kids and seniors.", defaultImage: "/Water-Park.jpg" },
  { id: "amusement-park", name: "Amusement Park Page", defaultTitle: "Amusement Park", defaultSub: "Tora Tora | Columbus Ride | High Swing | Round Swing | Jumper Ride | Kids Play Zone", defaultDesc: "Exciting amusement rides and family fun entertainment for visitors of all age groups.", defaultImage: "/amusement.jpg" },
  { id: "adventure-park", name: "Adventure Park Page", defaultTitle: "Adventure Park", defaultSub: "High Rope Bridge | Zip Line | Climbing Towers | Obstacle Courses | Thrill Challenges", defaultDesc: "Test your nerve and adrenaline with state-of-the-art obstacle challenges and outdoor adventures.", defaultImage: "/Adventure-Park.jpg" },
  { id: "boating-park", name: "Boating Park Page", defaultTitle: "Boating Park", defaultSub: "Pedal Boats | Family Shikara | Serene Waterways | Scenic Dam Views", defaultDesc: "Relax and enjoy peaceful water sports and scenic boating across Vidarbha's serene lake views.", defaultImage: "/Boating-Park.jpg" },
  { id: "bird-park", name: "Bird Park Page", defaultTitle: "Bird Park", defaultSub: "Exotic Aviary | Interactive Feeding | Rare Species | Satpuda Green Nature", defaultDesc: "Walk among beautiful exotic birds in an open, vibrant natural environment surrounded by nature.", defaultImage: "/Bird-Park.jpg" },
  { id: "accommodation", name: "Accommodation Page", defaultTitle: "Accommodation & Stay", defaultSub: "Farmhouse Bungalows | Dormitory Cottages | Camping Tents | AC Luxury Rooms", defaultDesc: "Relax in luxurious, tranquil resort rooms, family villas, and nature stays amidst stunning views.", defaultImage: "/Stay-Facilities.jpg" },
  { id: "school-picnic", name: "School Picnic Page", defaultTitle: "School Picnic", defaultSub: "Water Park | Adventure Park | Amusement Park | Agro Park | Bird Park | Boating | Team Activities | Educational Experiences", defaultDesc: "A complete school outing combining fun, adventure, education, teamwork and memorable experiences in one destination.", defaultImage: "/picnic.png" },
];

export default function AdminContentPage() {
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<string | null>(null);

  // Hero Section State
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("Book Tickets");
  const [heroVideoUrl, setHeroVideoUrl] = useState("");
  const [heroBgImage, setHeroBgImage] = useState("");

  // Popup Section State
  const [popupTitle, setPopupTitle] = useState("");
  const [popupDescription, setPopupDescription] = useState("");
  const [popupImage, setPopupImage] = useState("");

  // Curated Destinations Videos State (Key -> Video URL)
  const [curatedVideos, setCuratedVideos] = useState<Record<string, string>>({
    "waterpark": "/main.mp4",
    "boating-park": "/main.mp4",
    "adventure-park": "/main.mp4",
    "amusement-park": "/main.mp4",
    "bird-park": "/main.mp4",
    "accommodation": "/main.mp4",
  });

  // Other Activities Header State
  const [otherTitle, setOtherTitle] = useState("Other Activities");
  const [otherSubDescription, setOtherSubDescription] = useState(
    "Water Park | Adventure Park | Amusement Park | Agro Park | Bird Park | Boating | Air Tourism | Accommodation | Events"
  );
  const [otherMainDescription, setOtherMainDescription] = useState(
    "Beyond the main Park attractions, enjoy a wide range of engaging activities making it a complete learning and fun destination for all purposes and age groups. One Place, Unlimited Entertainment!"
  );

  // Park Pages Header State
  const [selectedParkPage, setSelectedParkPage] = useState("water-park");
  const [parkHeaderTitle, setParkHeaderTitle] = useState("");
  const [parkHeaderSub, setParkHeaderSub] = useState("");
  const [parkHeaderDesc, setParkHeaderDesc] = useState("");
  const [parkHeaderImage, setParkHeaderImage] = useState("");
  const [parkHeaderVideo, setParkHeaderVideo] = useState("");
  const [allParkHeaders, setAllParkHeaders] = useState<Record<string, any>>({});

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("website_content").select("*");
      if (error) throw error;

      if (data) {
        // Map Hero
        const heroRow = data.find((row) => row.section === "hero");
        if (heroRow && heroRow.content) {
          const c = heroRow.content;
          setHeroTitle(c.title || "");
          setHeroDescription(c.description || "");
          setHeroButtonText(c.buttonText || "Book Tickets");
          const v = c.videoUrl;
          setHeroVideoUrl(v !== undefined ? v : "/hero.mp4");
          setHeroBgImage(c.bgImageUrl || "");
        }

        // Map Popup
        const popupRow = data.find((row) => row.section === "popup");
        if (popupRow && popupRow.content) {
          const c = popupRow.content;
          setPopupTitle(c.title || "");
          setPopupDescription(c.description || "");
          setPopupImage(c.imageUrl || "");
        }

        // Map Curated Destinations
        const curatedRow = data.find((row) => row.section === "curated_destinations");
        if (curatedRow && curatedRow.content && curatedRow.content.videos) {
          setCuratedVideos((prev) => ({ ...prev, ...curatedRow.content.videos }));
        }

        // Map Other Activities
        const otherRow = data.find((row) => row.section === "other_activities");
        if (otherRow && otherRow.content) {
          const c = otherRow.content;
          if (c.title) setOtherTitle(c.title);
          if (c.subDescription) setOtherSubDescription(c.subDescription);
          if (c.mainDescription) setOtherMainDescription(c.mainDescription);
        }

        // Map Park Page Headers
        const parkHeaderRows = data.filter((row) => row.section.startsWith("park_header_"));
        const parkMap: Record<string, any> = {};
        parkHeaderRows.forEach((row) => {
          const parkKey = row.section.replace("park_header_", "");
          parkMap[parkKey] = row.content;
        });
        setAllParkHeaders(parkMap);
      }
    } catch (err) {
      console.error("Error fetching content details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // Update form inputs when selectedParkPage changes
  useEffect(() => {
    const defaultData = PARK_PAGE_TYPES.find((p) => p.id === selectedParkPage);
    const existing = allParkHeaders[selectedParkPage];

    if (existing) {
      setParkHeaderTitle(existing.title ?? defaultData?.defaultTitle ?? "");
      setParkHeaderSub(existing.subDescription ?? defaultData?.defaultSub ?? "");
      setParkHeaderDesc(existing.mainDescription ?? defaultData?.defaultDesc ?? "");
      setParkHeaderImage(existing.imageUrl !== undefined ? existing.imageUrl : defaultData?.defaultImage || "");
      setParkHeaderVideo(existing.videoUrl ?? "");
    } else if (defaultData) {
      setParkHeaderTitle(defaultData.defaultTitle);
      setParkHeaderSub(defaultData.defaultSub);
      setParkHeaderDesc(defaultData.defaultDesc);
      setParkHeaderImage(defaultData.defaultImage);
      setParkHeaderVideo("");
    }
  }, [selectedParkPage, allParkHeaders]);

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection("hero");
    try {
      const contentPayload = {
        title: heroTitle,
        description: heroDescription,
        buttonText: heroButtonText,
        videoUrl: heroVideoUrl,
        bgImageUrl: heroBgImage,
      };

      const { error } = await supabase
        .from("website_content")
        .upsert({ section: "hero", content: contentPayload }, { onConflict: "section" });

      if (error) throw error;
      alert("Hero section updated successfully!");
    } catch (err) {
      console.error("Error saving hero:", err);
      alert("Failed to save hero section content.");
    } finally {
      setSavingSection(null);
    }
  };

  const handleSavePopup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection("popup");
    try {
      const contentPayload = {
        title: popupTitle,
        description: popupDescription,
        imageUrl: popupImage,
      };

      const { error } = await supabase
        .from("website_content")
        .upsert({ section: "popup", content: contentPayload }, { onConflict: "section" });

      if (error) throw error;
      alert("Promotional popup details updated successfully!");
    } catch (err) {
      console.error("Error saving popup:", err);
      alert("Failed to save popup settings.");
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveCuratedVideos = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection("curated");
    try {
      const { error } = await supabase
        .from("website_content")
        .upsert(
          { section: "curated_destinations", content: { videos: curatedVideos } },
          { onConflict: "section" }
        );

      if (error) throw error;
      alert("Curated Destinations videos saved successfully!");
    } catch (err) {
      console.error("Error saving curated videos:", err);
      alert("Failed to save curated destinations videos.");
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveOtherActivities = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection("other_activities");
    try {
      const contentPayload = {
        title: otherTitle,
        subDescription: otherSubDescription,
        mainDescription: otherMainDescription,
      };

      const { error } = await supabase
        .from("website_content")
        .upsert({ section: "other_activities", content: contentPayload }, { onConflict: "section" });

      if (error) throw error;
      alert("Other Activities section details updated successfully!");
    } catch (err) {
      console.error("Error saving other activities content:", err);
      alert("Failed to save Other Activities content.");
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveParkHeader = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSection(`park_header_${selectedParkPage}`);
    try {
      const contentPayload = {
        title: parkHeaderTitle,
        subDescription: parkHeaderSub,
        mainDescription: parkHeaderDesc,
        imageUrl: parkHeaderImage,
        videoUrl: parkHeaderVideo,
      };

      const sectionKey = `park_header_${selectedParkPage}`;
      const { error } = await supabase
        .from("website_content")
        .upsert({ section: sectionKey, content: contentPayload }, { onConflict: "section" });

      if (error) throw error;

      setAllParkHeaders((prev) => ({
        ...prev,
        [selectedParkPage]: contentPayload,
      }));

      alert(`${selectedParkPage.toUpperCase().replace("-", " ")} header details saved successfully!`);
    } catch (err) {
      console.error("Error saving park page header:", err);
      alert("Failed to save park page header details.");
    } finally {
      setSavingSection(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wide">
          General Website Content CMS
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Edit global hero copy, curated destination videos, park page headers, and activities descriptions.
        </p>
      </div>

      {/* Hero Content Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
          <div className="p-2 bg-accent/10 rounded-xl text-accent">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Homepage Hero Section
            </h3>
            <p className="text-xs text-slate-500">
              Update main copy and video/image slides shown right at the top
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveHero} className="grid grid-cols-1 gap-6 text-sm">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Hero Headline
            </label>
            <input
              type="text"
              required
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent"
              placeholder="Nagpur’s Ultimate Fun Destination"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Sub-headline / Copy Text
            </label>
            <textarea
              required
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent resize-none"
              placeholder="Get ready for non-stop excitement..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Hero Video
              </label>
              <MediaUploader
                value={heroVideoUrl}
                onChange={setHeroVideoUrl}
                accept="video/*"
                type="video"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Fallback Image
              </label>
              <MediaUploader
                value={heroBgImage}
                onChange={setHeroBgImage}
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingSection === "hero"}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-black text-xs uppercase rounded-xl transition tracking-wider disabled:opacity-60"
            >
              <Save size={15} />
              {savingSection === "hero" ? "Updating..." : "Update Hero Details"}
            </button>
          </div>
        </form>
      </div>

      {/* CURATED DESTINATIONS MEDIA SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
            <Compass size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Curated Destinations Park Media (Image / GIF / Video)
            </h3>
            <p className="text-xs text-slate-500">
              Set images, GIFs, or background videos for each of the 6 destination parks displayed on the homepage
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveCuratedVideos} className="space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CURATED_PARKS.map((park) => (
              <div key={park.id} className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-accent uppercase tracking-wider flex items-center gap-2">
                    <Compass size={16} /> {park.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    ID: {park.id}
                  </span>
                </div>
                <MediaUploader
                  value={curatedVideos[park.id] || ""}
                  onChange={(val) =>
                    setCuratedVideos((prev) => ({ ...prev, [park.id]: val }))
                  }
                  accept="image/*,video/*"
                  type="all"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingSection === "curated"}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-black text-xs uppercase rounded-xl transition tracking-wider disabled:opacity-60"
            >
              <Save size={15} />
              {savingSection === "curated" ? "Saving Media..." : "Save Curated Destinations Media"}
            </button>
          </div>
        </form>
      </div>

      {/* INDIVIDUAL PARK PAGES HEADER & COPY CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
          <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Individual Park Page Headers & Copy
            </h3>
            <p className="text-xs text-slate-500">
              Customize title, sub-description highlights, main description, and hero banner media for each separate park page
            </p>
          </div>
        </div>

        {/* Park Select Tabs */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {PARK_PAGE_TYPES.map((park) => (
            <button
              key={park.id}
              type="button"
              onClick={() => setSelectedParkPage(park.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition tracking-wider border ${
                selectedParkPage === park.id
                  ? "bg-purple-600 text-white border-purple-500 shadow-lg"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {park.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSaveParkHeader} className="grid grid-cols-1 gap-6 text-sm">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Park Title (e.g. Water Park)
            </label>
            <input
              type="text"
              required
              value={parkHeaderTitle}
              onChange={(e) => setParkHeaderTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
              placeholder="e.g. Water Park"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Sub-description / Highlights (e.g. Various Water Pools | Waterfall | Family Slides | etc)
            </label>
            <textarea
              required
              value={parkHeaderSub}
              onChange={(e) => setParkHeaderSub(e.target.value)}
              className="w-full h-20 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none text-xs"
              placeholder="Various Water Pools | Waterfall | Family Slides | Body & Tube Slides | etc"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Main Description (e.g. The waterpark has been created carefully keeping in mind...)
            </label>
            <textarea
              required
              value={parkHeaderDesc}
              onChange={(e) => setParkHeaderDesc(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500 resize-none text-xs"
              placeholder="The waterpark has been created carefully keeping in mind..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Hero Banner Video (Optional)
              </label>
              <MediaUploader
                value={parkHeaderVideo}
                onChange={setParkHeaderVideo}
                accept="video/*"
                type="video"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Hero Banner Image
              </label>
              <MediaUploader
                value={parkHeaderImage}
                onChange={setParkHeaderImage}
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingSection === `park_header_${selectedParkPage}`}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase rounded-xl transition tracking-wider disabled:opacity-60"
            >
              <Save size={15} />
              {savingSection === `park_header_${selectedParkPage}`
                ? "Saving..."
                : `Save ${selectedParkPage.toUpperCase().replace("-", " ")} Header`}
            </button>
          </div>
        </form>
      </div>

      {/* OTHER ACTIVITIES SECTION CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Sun size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Other Activities Section Copy
            </h3>
            <p className="text-xs text-slate-500">
              Customize title, tag/sub-description, and main description for the Other Activities page/section
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveOtherActivities} className="grid grid-cols-1 gap-6 text-sm">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Title (e.g. Other Activities)
            </label>
            <input
              type="text"
              required
              value={otherTitle}
              onChange={(e) => setOtherTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
              placeholder="Other Activities"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Tag / Sub-description (e.g. Water Park | Adventure Park | Amusement Park | Agro Park | Bird Park | Boating | Air Tourism | Accommodation | Events)
            </label>
            <textarea
              required
              value={otherSubDescription}
              onChange={(e) => setOtherSubDescription(e.target.value)}
              className="w-full h-20 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Main Description
            </label>
            <textarea
              required
              value={otherMainDescription}
              onChange={(e) => setOtherMainDescription(e.target.value)}
              className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500 resize-none text-xs"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingSection === "other_activities"}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded-xl transition tracking-wider disabled:opacity-60"
            >
              <Save size={15} />
              {savingSection === "other_activities"
                ? "Saving..."
                : "Save Other Activities Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Promo Marketing Popup Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-850 pb-3">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
            <Megaphone size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              Homepage Marketing PopUp
            </h3>
            <p className="text-xs text-slate-500">
              Configure copy and banner details displayed to visitors on session startup
            </p>
          </div>
        </div>

        <form onSubmit={handleSavePopup} className="grid grid-cols-1 gap-6 text-sm">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Popup Title
            </label>
            <input
              type="text"
              required
              value={popupTitle}
              onChange={(e) => setPopupTitle(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent"
              placeholder="Grab Your Tickets Now & Dive Into the Fun!"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Highlight Copy / Offer Text
            </label>
            <input
              type="text"
              required
              value={popupDescription}
              onChange={(e) => setPopupDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent"
              placeholder="Exclusive packages with up to 30% discount!"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Marketing Banner Image
            </label>
            <MediaUploader
              value={popupImage}
              onChange={setPopupImage}
              accept="image/*"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={savingSection === "popup"}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-black text-xs uppercase rounded-xl transition tracking-wider disabled:opacity-60"
            >
              <Save size={15} />
              {savingSection === "popup" ? "Updating..." : "Update PopUp Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
