"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, deleteAsset } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, Home, Image as ImageIcon, Eye, EyeOff, Layers } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

type AccommodationStayItem = {
  id: string;
  park_type: string;
  title: string;
  description: string;
  image: string;
  features: string[];
  display_order: number;
  is_hidden?: boolean;
};

export default function AdminAccommodationPage() {
  const [stayItems, setStayItems] = useState<AccommodationStayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStayItem, setCurrentStayItem] = useState<Partial<AccommodationStayItem>>({
    park_type: "stay-facilities",
    title: "",
    description: "",
    image: "",
    features: [],
    display_order: 1,
  });

  const [featuresText, setFeaturesText] = useState("");

  const fetchStayItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      // Filter activities related to stay facilities/accommodation
      const stayKeywords = ["stay", "farmhouse", "tent", "camping", "cottage", "room", "accommodation"];
      const stayFiltered = (data || []).filter((item) => {
        const titleLower = (item.title || "").toLowerCase();
        const typeLower = (item.park_type || "").toLowerCase();
        return stayKeywords.some((kw) => titleLower.includes(kw) || typeLower.includes(kw));
      });

      setStayItems(stayFiltered);
    } catch (err) {
      console.error("Error fetching accommodation stay items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStayItems();
  }, []);

  const handleEdit = (item: AccommodationStayItem) => {
    setCurrentStayItem(item);
    setFeaturesText((item.features || []).join("\n"));
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentStayItem({
      park_type: "stay-facilities",
      title: "",
      description: "",
      image: "",
      features: [],
      display_order: stayItems.length + 1,
    });
    setFeaturesText("");
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedFeatures = featuresText.split("\n").map((t) => t.trim()).filter(Boolean);

    try {
      const payload = {
        park_type: "stay-facilities",
        title: currentStayItem.title || "",
        description: currentStayItem.description || "",
        image: currentStayItem.image || "",
        features: parsedFeatures,
        display_order: currentStayItem.display_order || 1,
      };

      if (currentStayItem.id) {
        const { error } = await supabase
          .from("activities")
          .update(payload)
          .eq("id", currentStayItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("activities").insert([payload]);
        if (error) throw error;
      }

      setIsEditing(false);
      fetchStayItems();
    } catch (err: any) {
      console.error("Error saving accommodation stay item:", err);
      alert(`Failed to save stay details: ${err?.message || "Unknown error"}`);
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
      fetchStayItems();
    } catch (err) {
      console.error("Error toggling stay item visibility:", err);
      alert("Failed to update visibility.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this accommodation stay option?")) return;
    setLoading(true);

    try {
      const itemToDelete = stayItems.find((a) => a.id === id);
      const { error } = await supabase.from("activities").delete().eq("id", id);
      if (error) throw error;

      if (itemToDelete?.image) {
        await deleteAsset(itemToDelete.image);
      }

      fetchStayItems();
    } catch (err) {
      console.error("Error deleting stay option:", err);
      alert("Failed to delete stay option.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide flex items-center gap-2">
            <Home className="text-accent" /> Accommodation CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage stay facilities, farmhouse bungalows, camping tents, dormitory cottages, and AC rooms displayed on the website
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/packages"
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold uppercase text-xs py-3 px-4 rounded-xl border border-slate-700 transition tracking-wider"
          >
            <Layers size={15} />
            Create Checkout Package
          </Link>

          {!isEditing && (
            <button
              onClick={handleCreateNew}
              className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
            >
              <Plus size={16} />
              Add Stay Facility
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-2xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentStayItem.id ? "Edit Accommodation Details" : "New Accommodation Option"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Accommodation Title / Name
              </label>
              <input
                type="text"
                required
                value={currentStayItem.title || ""}
                onChange={(e) => setCurrentStayItem({ ...currentStayItem, title: e.target.value })}
                placeholder="e.g. Farmhouse Bungalows"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Featured Image
              </label>
              <MediaUploader
                value={currentStayItem.image || ""}
                onChange={(url) => setCurrentStayItem({ ...currentStayItem, image: url })}
                accept="image/*"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={4}
                required
                value={currentStayItem.description || ""}
                onChange={(e) => setCurrentStayItem({ ...currentStayItem, description: e.target.value })}
                placeholder="Write detailed stay description..."
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Key Features / Highlights (One per line)
              </label>
              <textarea
                rows={5}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder={"AC Bedrooms with Attached Bath\nPrivate Lawn & Garden Sit-out\nSpacious Living Hall\n24/7 Hot Water"}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                required
                value={currentStayItem.display_order || 1}
                onChange={(e) => setCurrentStayItem({ ...currentStayItem, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
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
              Save Accommodation
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
            </div>
          ) : stayItems.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm">
              No accommodation stay options configured yet. Click "Add Stay Facility" to create one.
            </div>
          ) : (
            stayItems.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
                <div className="relative aspect-[1.3] w-full bg-slate-950 flex items-center justify-center text-slate-700 overflow-hidden">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `/${item.image}`}
                      alt={item.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon size={48} />
                  )}
                  <span className="absolute top-3 left-3 bg-black/70 border border-slate-800 text-[10px] font-bold text-accent px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Order: {item.display_order}
                  </span>
                  <span className={`absolute top-3 right-3 border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.is_hidden
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "bg-green-500/20 border-green-500/50 text-green-400"
                  }`}>
                    {item.is_hidden ? "Hidden" : "Visible"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {item.features && item.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {item.features.slice(0, 3).map((f, index) => (
                          <span key={index} className="text-[9px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-slate-700/50">
                            • {f}
                          </span>
                        ))}
                        {item.features.length > 3 && (
                          <span className="text-[9px] text-slate-500 font-bold px-1 py-0.5">
                            +{item.features.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-850 pt-4 flex gap-2 justify-end flex-wrap">
                    <button
                      onClick={() => handleToggleHide(item.id, !!item.is_hidden)}
                      className={`flex items-center gap-1 px-3 py-2 font-bold text-xs uppercase rounded-lg transition ${
                        item.is_hidden
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      {item.is_hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                      {item.is_hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-lg transition"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
