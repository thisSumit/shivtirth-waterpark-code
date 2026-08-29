"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import MediaUploader from "@/components/MediaUploader";
import { Save, AlertCircle, Sparkles, Megaphone, FileText } from "lucide-react";

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
          setHeroVideoUrl(c.videoUrl || "");
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

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wide">
          General Website Content CMS
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Edit global hero copy, background assets, and promotional marketing popup details
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
