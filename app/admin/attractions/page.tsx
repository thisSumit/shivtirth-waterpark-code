"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase, uploadAsset, deleteAsset } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Map, Eye, EyeOff } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

type Attraction = {
  id: string;
  park_type: "water-park" | "amusement-park" | "adventure-park" | "boating-park";
  title: string;
  description: string;
  image: string;
  display_order: number;
  is_hidden?: boolean;
};

const PARK_TYPES = [
  { id: "water-park", label: "Water Park" },
  { id: "amusement-park", label: "Amusement Park" },
  { id: "adventure-park", label: "Adventure Park" },
  { id: "boating-park", label: "Boating Park" },
];

export default function AdminAttractionsPage() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("water-park");
  const [isEditing, setIsEditing] = useState(false);
  const [currentAttraction, setCurrentAttraction] = useState<Partial<Attraction>>({
    park_type: "water-park",
    title: "",
    description: "",
    image: "",
    display_order: 1,
  });

  const fetchAttractions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("attractions")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setAttractions(data || []);
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
    return attractions.filter((a) => a.park_type === activeTab);
  }, [attractions, activeTab]);

  const handleEdit = (a: Attraction) => {
    setCurrentAttraction(a);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentAttraction({
      park_type: activeTab as any,
      title: "",
      description: "",
      image: "",
      display_order: filteredAttractions.length + 1,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentAttraction.id) {
        const { error } = await supabase
          .from("attractions")
          .update({
            park_type: currentAttraction.park_type,
            title: currentAttraction.title,
            description: currentAttraction.description,
            image: currentAttraction.image,
            display_order: currentAttraction.display_order,
          })
          .eq("id", currentAttraction.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("attractions").insert([
          {
            park_type: currentAttraction.park_type,
            title: currentAttraction.title,
            description: currentAttraction.description,
            image: currentAttraction.image,
            display_order: currentAttraction.display_order,
          },
        ]);

        if (error) throw error;
      }

      setIsEditing(false);
      fetchAttractions();
    } catch (err) {
      console.error("Error saving attraction:", err);
      alert("Failed to save attraction details.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (id: string, currentHiddenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("attractions")
        .update({ is_hidden: !currentHiddenStatus })
        .eq("id", id);
      if (error) throw error;
      fetchAttractions();
    } catch (err) {
      console.error("Error toggling attraction visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this attraction?")) return;
    setLoading(true);

    try {
      const attractionToDelete = attractions.find(a => a.id === id);
      const { error } = await supabase.from("attractions").delete().eq("id", id);
      if (error) throw error;

      if (attractionToDelete?.image) {
        await deleteAsset(attractionToDelete.image);
      }

      fetchAttractions();
    } catch (err) {
      console.error("Error deleting attraction:", err);
      alert("Failed to delete attraction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Attractions CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure featured slides, rides, and activities across the four park sectors
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
          >
            <Plus size={16} />
            Create Attraction
          </button>
        )}
      </div>

      {/* Tabs Menu */}
      {!isEditing && (
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-sm font-semibold w-max">
          {PARK_TYPES.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-accent text-black font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-2xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentAttraction.id ? "Edit Attraction Details" : "New Park Attraction"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Target Park Sector
              </label>
              <select
                value={currentAttraction.park_type}
                onChange={(e) => setCurrentAttraction({ ...currentAttraction, park_type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              >
                {PARK_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
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
                placeholder="Adishakti Waterfall"
              />
            </div>

            <div className="space-y-2">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Attraction Image
              </label>
              <MediaUploader
                value={currentAttraction.image || ""}
                onChange={(url) => setCurrentAttraction({ ...currentAttraction, image: url })}
                accept="image/*"
              />
            </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Display order index
              </label>
              <input
                type="number"
                required
                value={currentAttraction.display_order}
                onChange={(e) => setCurrentAttraction({ ...currentAttraction, display_order: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Attraction description copy
              </label>
              <textarea
                required
                value={currentAttraction.description}
                onChange={(e) => setCurrentAttraction({ ...currentAttraction, description: e.target.value })}
                className="w-full h-28 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm resize-none"
                placeholder="Enter detailed description of the ride or activity..."
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
              Save Attraction
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
            </div>
          ) : filteredAttractions.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm">
              No attractions configured for this sector. Click "Create Attraction" to configure one.
            </div>
          ) : (
            filteredAttractions.map((a) => (
              <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
                <div className="relative aspect-[1.2] w-full bg-slate-950 flex items-center justify-center text-slate-700 overflow-hidden">
                  {a.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.image.startsWith("http") || a.image.startsWith("/") ? a.image : `/${a.image}`}
                      alt={a.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Map size={48} />
                  )}
                  <span className="absolute top-3 left-3 bg-black/70 border border-slate-800 text-[10px] font-bold text-accent px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Order: {a.display_order}
                  </span>
                  <span className={`absolute top-3 right-3 border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    a.is_hidden
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "bg-green-500/20 border-green-500/50 text-green-400"
                  }`}>
                    {a.is_hidden ? "Hidden" : "Visible"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {a.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {a.description}
                    </p>
                  </div>

                  <div className="border-t border-slate-850 pt-4 flex gap-2 justify-end flex-wrap">
                    <button
                      onClick={() => handleToggleHide(a.id, !!a.is_hidden)}
                      className={`flex items-center gap-1 px-3 py-2 font-bold text-xs uppercase rounded-lg transition ${
                        a.is_hidden
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      {a.is_hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                      {a.is_hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => handleEdit(a)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-lg transition"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
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
