"use client";

import React, { useState, useEffect } from "react";
import { supabase, uploadAsset, deleteAsset } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, Sparkles, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

type Activity = {
  id: string;
  park_type: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  display_order: number;
  is_hidden?: boolean;
};

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({
    park_type: "bird-park",
    title: "",
    description: "",
    image: "",
    features: [],
    display_order: 1,
  });

  const [featuresText, setFeaturesText] = useState("");

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleEdit = (act: Activity) => {
    setCurrentActivity(act);
    setFeaturesText((act.features || []).join("\n"));
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentActivity({
      park_type: "bird-park",
      title: "",
      description: "",
      image: "",
      features: [],
      display_order: activities.length + 1,
    });
    setFeaturesText("");
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedFeatures = featuresText.split("\n").map(t => t.trim()).filter(Boolean);
    const parkTypeToSave = currentActivity.park_type || (currentActivity.title ? currentActivity.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "general-activity");

    try {
      if (currentActivity.id) {
        const { error } = await supabase
          .from("activities")
          .update({
            park_type: parkTypeToSave,
            title: currentActivity.title || "",
            description: currentActivity.description || "",
            image: currentActivity.image || "",
            features: parsedFeatures,
            display_order: currentActivity.display_order || 1,
          })
          .eq("id", currentActivity.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("activities").insert([
          {
            park_type: parkTypeToSave,
            title: currentActivity.title || "",
            description: currentActivity.description || "",
            image: currentActivity.image || "",
            features: parsedFeatures,
            display_order: currentActivity.display_order || 1,
          },
        ]);

        if (error) throw error;
      }

      setIsEditing(false);
      fetchActivities();
    } catch (err: any) {
      console.error("Error saving activity:", err);
      alert(`Failed to save activity details: ${err?.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (id: string, currentHiddenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("activities")
        .update({ is_hidden: !currentHiddenStatus })
        .eq("id", id);
      if (error) throw error;
      fetchActivities();
    } catch (err) {
      console.error("Error toggling activity visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience/activity?")) return;
    setLoading(true);

    try {
      const activityToDelete = activities.find(a => a.id === id);
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;

      if (activityToDelete?.image) {
        await deleteAsset(activityToDelete.image);
      }

      fetchActivities();
    } catch (err) {
      console.error("Error deleting activity:", err);
      alert("Failed to delete activity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Secondary Parks & Stays CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure Bird Park details, Stays (Camping/Farmhouse), celebrations and custom events
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
          >
            <Plus size={16} />
            Create Experience
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-2xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentActivity.id ? "Edit Experience Details" : "New Custom Experience"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2 col-span-full md:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Experience Title
              </label>
              <input
                type="text"
                required
                value={currentActivity.title}
                onChange={(e) => setCurrentActivity({ ...currentActivity, title: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                placeholder="Camping Stay, Bird Aviary, Agro Park..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Featured Cover Image
              </label>
              <MediaUploader
                value={currentActivity.image || ""}
                onChange={(url) => setCurrentActivity({ ...currentActivity, image: url })}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Display Order index
              </label>
              <input
                type="number"
                required
                value={currentActivity.display_order}
                onChange={(e) => setCurrentActivity({ ...currentActivity, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Experience Description
              </label>
              <textarea
                required
                value={currentActivity.description}
                onChange={(e) => setCurrentActivity({ ...currentActivity, description: e.target.value })}
                className="w-full h-28 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm resize-none"
                placeholder="Enter detailed description of the stays or custom events..."
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Key Features / Inclusions (One per line)
              </label>
              <textarea
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
                placeholder="Tents with mattress&#10;Complimentary campfire&#10;Unlimited slides access"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-xl transition tracking-wider"
            >
              <X size={15} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-black text-xs uppercase rounded-xl transition tracking-wider"
            >
              <Save size={15} />
              Save Experience
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
            </div>
          ) : activities.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm">
              No experiences configured. Click "Create Experience" to add.
            </div>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
                <div className="relative aspect-[1.3] w-full bg-slate-950 flex items-center justify-center text-slate-700 overflow-hidden">
                  {act.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={act.image.startsWith("http") || act.image.startsWith("/") ? act.image : `/${act.image}`}
                      alt={act.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Sparkles size={48} />
                  )}
                  <span className="absolute top-3 left-3 bg-black/70 border border-slate-800 text-[10px] font-bold text-accent px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Order: {act.display_order}
                  </span>
                  <span className={`absolute top-3 right-3 border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    act.is_hidden
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "bg-green-500/20 border-green-500/50 text-green-400"
                  }`}>
                    {act.is_hidden ? "Hidden" : "Visible"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {act.description}
                    </p>

                    {/* Features preview */}
                    {act.features && act.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {act.features.slice(0, 3).map((f, index) => (
                          <span key={index} className="text-[9px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-slate-700/50">
                            • {f}
                          </span>
                        ))}
                        {act.features.length > 3 && (
                          <span className="text-[9px] text-slate-500 font-bold px-1 py-0.5">
                            +{act.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-850 pt-4 flex gap-2 justify-end flex-wrap">
                    <button
                      onClick={() => handleToggleHide(act.id, !!act.is_hidden)}
                      className={`flex items-center gap-1 px-3 py-2 font-bold text-xs uppercase rounded-lg transition ${
                        act.is_hidden
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      {act.is_hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                      {act.is_hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => handleEdit(act)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-lg transition"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(act.id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase rounded-lg transition"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
