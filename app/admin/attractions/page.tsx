"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, Map, Eye, EyeOff, Video, Sparkles } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

type AttractionItem = {
  id: string;
  park_type: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  video_url?: string;
  features?: string[];
  display_order: number;
  is_hidden?: boolean;
  sourceTable: "attractions" | "activities";
};

const PARK_TYPES = [
  { id: "water-park", label: "Water Park" },
  { id: "amusement-park", label: "Amusement Park" },
  { id: "adventure-park", label: "Adventure Park" },
  { id: "boating-park", label: "Boating Park" },
  { id: "bird-park", label: "Bird Park" },
  { id: "accommodation", label: "Accommodation & Stay" },
  { id: "school-picnic", label: "School Picnic" },
  { id: "other-activities", label: "Other Activities" },
];

function AdminAttractionsContent() {
  const searchParams = useSearchParams();
  const [attractions, setAttractions] = useState<AttractionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("water-park");
  const [isEditing, setIsEditing] = useState(false);
  const [featuresText, setFeaturesText] = useState("");
  const [currentAttraction, setCurrentAttraction] = useState<Partial<AttractionItem>>({
    park_type: "water-park",
    title: "",
    description: "",
    image: "",
    video: "",
    video_url: "",
    features: [],
    display_order: 1,
    sourceTable: "attractions",
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && PARK_TYPES.some((t) => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const checkIsVideoUrl = (url?: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return (
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".ogg") ||
      lower.endsWith(".mov") ||
      lower.endsWith(".m4v") ||
      lower.includes(".mp4?") ||
      lower.includes("/video/") ||
      lower.includes("/uploads/")
    );
  };

  const fetchAttractions = async () => {
    setLoading(true);
    try {
      const [attractionsRes, activitiesRes] = await Promise.all([
        supabase.from("attractions").select("*").order("display_order", { ascending: true }),
        supabase.from("activities").select("*").order("display_order", { ascending: true }),
      ]);

      const attractionsData: AttractionItem[] = (attractionsRes.data || []).map((item) => ({
        ...item,
        sourceTable: "attractions",
      }));

      const activitiesData: AttractionItem[] = (activitiesRes.data || []).map((item) => {
        const vid = item.video || item.video_url || (checkIsVideoUrl(item.image) ? item.image : "");
        const img = checkIsVideoUrl(item.image) ? "" : item.image;
        return {
          ...item,
          image: img,
          video: vid,
          video_url: vid,
          park_type: item.park_type === "bird-park" ? "bird-park" : "other-activities",
          features: Array.isArray(item.features) ? item.features : [],
          sourceTable: "activities",
        };
      });

      setAttractions([...attractionsData, ...activitiesData]);
    } catch (err) {
      console.error("Error fetching attractions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  const filteredAttractions = useMemo(() => {
    return attractions.filter((a) => {
      if (activeTab === "other-activities") {
        return a.park_type === "other-activities" || a.sourceTable === "activities";
      }
      return a.park_type === activeTab && a.sourceTable !== "activities";
    });
  }, [attractions, activeTab]);

  const handleEdit = (a: AttractionItem) => {
    const vid = a.video || a.video_url || (checkIsVideoUrl(a.image) ? a.image : "");
    const img = checkIsVideoUrl(a.image) ? "" : a.image;
    setCurrentAttraction({
      ...a,
      image: img,
      video: vid,
      video_url: vid,
    });
    setFeaturesText((a.features || []).join("\n"));
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentAttraction({
      park_type: activeTab,
      title: "",
      description: "",
      image: "",
      video: "",
      video_url: "",
      features: [],
      display_order: filteredAttractions.length + 1,
      sourceTable: activeTab === "other-activities" ? "activities" : "attractions",
    });
    setFeaturesText("");
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isActivityTable =
      currentAttraction.sourceTable === "activities" ||
      activeTab === "other-activities" ||
      currentAttraction.park_type === "other-activities";
    const parsedFeatures = featuresText.split("\n").map((t) => t.trim()).filter(Boolean);
    const videoVal = currentAttraction.video || currentAttraction.video_url || null;

    try {
      const isVideoColumnError = (err: any) => {
        if (!err || !err.message) return false;
        const msg = err.message.toLowerCase();
        return (
          msg.includes("video") ||
          msg.includes("column") ||
          msg.includes("schema cache") ||
          msg.includes("could not find")
        );
      };

      if (isActivityTable) {
        // If a video is uploaded, make sure the video URL is preserved in the image field as fallback
        const effectiveImage = videoVal || currentAttraction.image || "/Water-Park.jpg";
        const payload: Record<string, any> = {
          park_type: currentAttraction.park_type || "other-activities",
          title: currentAttraction.title || "",
          description: currentAttraction.description || "",
          image: effectiveImage,
          features: parsedFeatures,
          display_order: currentAttraction.display_order || 1,
        };
        if (videoVal) {
          payload.video = videoVal;
          payload.video_url = videoVal;
        }

        if (currentAttraction.id) {
          let { error } = await supabase.from("activities").update(payload).eq("id", currentAttraction.id);
          if (error && isVideoColumnError(error)) {
            delete payload.video_url;
            delete payload.video;
            const retry = await supabase.from("activities").update(payload).eq("id", currentAttraction.id);
            error = retry.error;
          }
          if (error) throw error;
        } else {
          let { error } = await supabase.from("activities").insert([payload]);
          if (error && isVideoColumnError(error)) {
            delete payload.video_url;
            delete payload.video;
            const retry = await supabase.from("activities").insert([payload]);
            error = retry.error;
          }
          if (error) throw error;
        }
      } else {
        const payload: Record<string, any> = {
          park_type: currentAttraction.park_type,
          title: currentAttraction.title,
          description: currentAttraction.description,
          image: currentAttraction.image || "/Water-Park.jpg",
          display_order: currentAttraction.display_order,
        };

        if (videoVal) {
          payload.video = videoVal;
          payload.video_url = videoVal;
        } else {
          payload.video = null;
          payload.video_url = null;
        }

        if (currentAttraction.id) {
          let { error } = await supabase.from("attractions").update(payload).eq("id", currentAttraction.id);
          if (error && isVideoColumnError(error)) {
            delete payload.video_url;
            delete payload.video;
            const retry = await supabase.from("attractions").update(payload).eq("id", currentAttraction.id);
            error = retry.error;
          }
          if (error) throw error;
        } else {
          let { error } = await supabase.from("attractions").insert([payload]);
          if (error && isVideoColumnError(error)) {
            delete payload.video_url;
            delete payload.video;
            const retry = await supabase.from("attractions").insert([payload]);
            error = retry.error;
          }
          if (error) throw error;
        }
      }

      setIsEditing(false);
      fetchAttractions();
    } catch (err: any) {
      console.error("Error saving attraction/activity:", err);
      const msg = err?.message || err?.details || String(err);
      alert(`Failed to save details: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (item: AttractionItem) => {
    const table = item.sourceTable === "activities" ? "activities" : "attractions";
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_hidden: !item.is_hidden })
        .eq("id", item.id);
      if (error) throw error;
      fetchAttractions();
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (item: AttractionItem) => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    setLoading(true);

    const table = item.sourceTable === "activities" ? "activities" : "attractions";
    try {
      const { error } = await supabase.from(table).delete().eq("id", item.id);
      if (error) throw error;

      fetchAttractions();
    } catch (err) {
      console.error("Error deleting card:", err);
      alert("Failed to delete card.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Park Attractions & Activities CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure featured slides, rides, cards, photos, videos, and other activities across park pages
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
          >
            <Plus size={16} />
            Create {activeTab === "other-activities" ? "Activity" : "Attraction"} Card
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      {!isEditing && (
        <div className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 text-sm font-semibold">
          {PARK_TYPES.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "bg-accent text-black font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.id === "other-activities" && <Sparkles size={14} />}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-2xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentAttraction.id ? "Edit Card" : "New Card"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Park Sector
              </label>
              <select
                value={currentAttraction.park_type}
                onChange={(e) => {
                  const val = e.target.value;
                  setCurrentAttraction({
                    ...currentAttraction,
                    park_type: val,
                    sourceTable: val === "other-activities" ? "activities" : "attractions",
                  });
                }}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              >
                {PARK_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Display Title
              </label>
              <input
                type="text"
                required
                value={currentAttraction.title}
                onChange={(e) => setCurrentAttraction({ ...currentAttraction, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                placeholder="e.g. Agro Park / Helicopter Ride"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Image
              </label>
              <MediaUploader
                value={currentAttraction.image || ""}
                onChange={(url) => setCurrentAttraction({ ...currentAttraction, image: url })}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Video (Optional)
              </label>
              <MediaUploader
                value={currentAttraction.video || currentAttraction.video_url || ""}
                onChange={(url) => setCurrentAttraction({ ...currentAttraction, video: url })}
                accept="video/*"
                type="video"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Display Order Index
              </label>
              <input
                type="number"
                required
                value={currentAttraction.display_order}
                onChange={(e) => setCurrentAttraction({ ...currentAttraction, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
              />
            </div>

            {(activeTab === "other-activities" ||
              currentAttraction.sourceTable === "activities" ||
              currentAttraction.park_type === "other-activities") && (
              <div className="space-y-2 col-span-full">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Key Features / Highlights (One per line)
                </label>
                <textarea
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm resize-none font-mono"
                  placeholder={"Kitchen Garden\nFruit Orchards\nRural Games"}
                />
              </div>
            )}

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Description
              </label>
              <textarea
                required
                value={currentAttraction.description}
                onChange={(e) => setCurrentAttraction({ ...currentAttraction, description: e.target.value })}
                className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm resize-none"
                placeholder="Brief details about this attraction or activity..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-black font-black text-xs uppercase rounded-xl transition"
            >
              <Save size={15} />
              Save Card
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
        </div>
      ) : filteredAttractions.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <Map size={48} className="mx-auto mb-3 text-slate-600" />
          <p className="text-base font-semibold">No cards created yet for this category.</p>
          <button
            onClick={handleCreateNew}
            className="mt-4 px-4 py-2 bg-accent/10 border border-accent/30 text-accent font-bold text-xs uppercase rounded-xl"
          >
            Add First Card
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((a) => (
            <div
              key={a.id}
              className={`bg-slate-900 border ${
                a.is_hidden ? "border-amber-500/30 bg-slate-900/60" : "border-slate-800"
              } rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between`}
            >
              <div>
                <div className="relative h-48 bg-slate-950 w-full">
                  {a.video || a.video_url ? (
                    <video
                      src={a.video || a.video_url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      autoPlay
                      playsInline
                    />
                  ) : (
                    <img
                      src={a.image || "/Water-Park.jpg"}
                      alt={a.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {a.video || a.video_url ? (
                      <span className="bg-blue-500/90 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Video size={10} /> Video
                      </span>
                    ) : null}
                    {a.is_hidden && (
                      <span className="bg-amber-500 text-black font-bold text-[10px] uppercase px-2 py-0.5 rounded-md">
                        Hidden
                      </span>
                    )}
                    <span className="bg-slate-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-700">
                      Order: #{a.display_order}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-white uppercase">{a.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {a.description}
                  </p>
                  {a.features && a.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {a.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-800 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-slate-700"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-800/50 mt-4">
                <button
                  onClick={() => handleToggleHide(a)}
                  className={`p-2 rounded-xl transition ${
                    a.is_hidden
                      ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                  title={a.is_hidden ? "Show on website" : "Hide from website"}
                >
                  {a.is_hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition"
                    title="Edit Card"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(a)}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition"
                    title="Delete Card"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminAttractionsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex items-center justify-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2 mr-3"></div>
          Loading Attractions & Activities CMS...
        </div>
      }
    >
      <AdminAttractionsContent />
    </Suspense>
  );
}
