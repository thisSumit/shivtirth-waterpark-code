"use client";

import React, { useState, useEffect, useMemo } from "react";
import { supabase, uploadAsset, deleteAsset } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Video, Youtube, Eye, EyeOff, Tag } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

type GalleryItem = {
  id: string;
  type: "image" | "video" | "youtube";
  src: string;
  category: string;
  title: string;
  display_order: number;
  is_hidden?: boolean;
};

const DEFAULT_CATEGORIES = [
  { id: "water-park", label: "Water Park" },
  { id: "boating-park", label: "Boating Park" },
  { id: "attractions", label: "Attractions & Rides" },
  { id: "stay", label: "Stay & Camping" },
  { id: "events", label: "Events & Festivals" },
  { id: "agro-park", label: "Agro Park" },
  { id: "videos", label: "Videos" },
];

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategorySelect, setSelectedCategorySelect] = useState<string>("water-park");
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");

  const [currentItem, setCurrentItem] = useState<Partial<GalleryItem>>({
    type: "image",
    src: "",
    category: "water-park",
    title: "",
    display_order: 1,
  });

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setGallery(data || []);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Compute all available category options (default + dynamic existing categories from database)
  const availableCategories = useMemo(() => {
    const defaultIds = DEFAULT_CATEGORIES.map(c => c.id);
    const customFromDb = Array.from(
      new Set(gallery.map(g => g.category).filter(Boolean))
    ).filter(cat => !defaultIds.includes(cat));

    const list = [...DEFAULT_CATEGORIES];
    customFromDb.forEach(cat => {
      list.push({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
      });
    });

    return list;
  }, [gallery]);

  const handleEdit = (item: GalleryItem) => {
    setCurrentItem(item);
    const existingCat = item.category || "water-park";
    setSelectedCategorySelect(existingCat);
    setCustomCategoryInput("");
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentItem({
      type: "image",
      src: "",
      category: "water-park",
      title: "",
      display_order: gallery.length + 1,
    });
    setSelectedCategorySelect("water-park");
    setCustomCategoryInput("");
    setIsEditing(true);
  };

  const handleToggleHide = async (id: string, currentHiddenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("gallery")
        .update({ is_hidden: !currentHiddenStatus })
        .eq("id", id);
      if (error) throw error;
      fetchGallery();
    } catch (err) {
      console.error("Error toggling visibility:", err);
      alert("Failed to update visibility.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalCategory = selectedCategorySelect === "__new__"
        ? customCategoryInput.trim().toLowerCase().replace(/\s+/g, '-') || "custom"
        : selectedCategorySelect;

      const payload = {
        type: currentItem.type || "image",
        src: currentItem.src || "",
        category: finalCategory,
        title: currentItem.title || "",
        display_order: currentItem.display_order || 1,
      };

      if (currentItem.id) {
        const { error } = await supabase
          .from("gallery")
          .update(payload)
          .eq("id", currentItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("gallery").insert([payload]);
        if (error) throw error;
      }

      setIsEditing(false);
      fetchGallery();
    } catch (err) {
      console.error("Error saving gallery item:", err);
      alert("Failed to save gallery item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    setLoading(true);

    try {
      const itemToDelete = gallery.find(g => g.id === id);
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;

      if (itemToDelete?.src) {
        await deleteAsset(itemToDelete.src);
      }

      fetchGallery();
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      alert("Failed to delete media item.");
    } finally {
      setLoading(false);
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video size={14} className="text-blue-400" />;
      case "youtube":
        return <Youtube size={14} className="text-red-500" />;
      default:
        return <ImageIcon size={14} className="text-green-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Gallery CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage photos, videos, and YouTube embeds with customizable category tags and visibility controls
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
          >
            <Plus size={16} />
            Add Media
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-2xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentItem.id ? "Edit Gallery Item" : "New Gallery Item"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Media Type
              </label>
              <select
                value={currentItem.type}
                onChange={(e) => setCurrentItem({ ...currentItem, type: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              >
                <option value="image">Static Image</option>
                <option value="video">Local Video Clip (.mp4)</option>
                <option value="youtube">YouTube Video URL</option>
              </select>
            </div>

            {/* Category Dropdown / Create New Category */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Tag size={13} className="text-accent" /> Select or Create Category
              </label>
              <select
                value={selectedCategorySelect}
                onChange={(e) => setSelectedCategorySelect(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              >
                {availableCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
                <option value="__new__">➕ Create New Category...</option>
              </select>

              {selectedCategorySelect === "__new__" && (
                <div className="pt-2">
                  <input
                    type="text"
                    required
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    placeholder="Enter new category name (e.g. Pool Parties)..."
                    className="w-full px-4 py-3 bg-slate-950 border border-accent rounded-xl text-white text-sm focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Title / Caption
              </label>
              <input
                type="text"
                value={currentItem.title || ""}
                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                placeholder="e.g. Wave Pool & Splash Fun"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {currentItem.type === "youtube" ? "YouTube Video URL" : "Media Asset File"}
              </label>
              {currentItem.type === "youtube" ? (
                <input
                  type="text"
                  required
                  value={currentItem.src || ""}
                  onChange={(e) => setCurrentItem({ ...currentItem, src: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              ) : (
                <MediaUploader
                  value={currentItem.src || ""}
                  onChange={(url) => setCurrentItem({ ...currentItem, src: url })}
                  accept={currentItem.type === "video" ? "video/*" : "image/*"}
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                required
                value={currentItem.display_order || 1}
                onChange={(e) => setCurrentItem({ ...currentItem, display_order: Number(e.target.value) })}
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
              Save Media
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
            </div>
          ) : gallery.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm">
              No gallery items configured. Click "Add Media" to build the gallery.
            </div>
          ) : (
            gallery.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
                <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center text-slate-700 overflow-hidden">
                  {item.type === "image" && item.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`}
                      alt={item.title || "Gallery static"}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : item.type === "video" && item.src ? (
                    <video
                      src={item.src.startsWith("http") || item.src.startsWith("/") ? item.src : `/${item.src}`}
                      className="object-cover w-full h-full"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 p-4 text-center">
                      <Youtube size={36} className="text-red-500" />
                      <span className="text-xs text-slate-400 font-semibold truncate max-w-[150px]">
                        {item.src}
                      </span>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 bg-black/70 border border-slate-800 text-[10px] font-bold text-accent px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                    {getMediaIcon(item.type)}
                    {item.type}
                  </span>

                  <span className={`absolute top-3 right-3 border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    item.is_hidden
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "bg-green-500/20 border-green-500/50 text-green-400"
                  }`}>
                    {item.is_hidden ? "Hidden" : "Visible"}
                  </span>
                </div>

                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {item.category || "water-park"}
                    </span>
                    <p className="text-sm font-bold text-white mt-1 line-clamp-1">
                      {item.title || "Untitled Media"}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-slate-850 pt-3 flex-wrap">
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
