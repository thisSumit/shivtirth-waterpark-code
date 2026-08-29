"use client";

import React, { useState, useEffect } from "react";
import { supabase, uploadAsset, deleteAsset } from "@/lib/supabase";
import MediaUploader from "@/components/MediaUploader";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Eye, EyeOff } from "lucide-react";

type Offer = {
  id: string;
  src: string;
  alt: string;
  aspect_ratio: string;
  display_order: number;
  is_hidden?: boolean;
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOffer, setCurrentOffer] = useState<Partial<Offer>>({
    src: "",
    alt: "",
    aspect_ratio: "1.5",
    display_order: 0,
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleEdit = (offer: Offer) => {
    setCurrentOffer(offer);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentOffer({
      src: "",
      alt: "",
      aspect_ratio: "1.5",
      display_order: offers.length + 1,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentOffer.id) {
        // Update
        const { error } = await supabase
          .from("offers")
          .update({
            src: currentOffer.src,
            alt: currentOffer.alt,
            aspect_ratio: currentOffer.aspect_ratio,
            display_order: currentOffer.display_order,
          })
          .eq("id", currentOffer.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase.from("offers").insert([
          {
            src: currentOffer.src,
            alt: currentOffer.alt,
            aspect_ratio: currentOffer.aspect_ratio,
            display_order: currentOffer.display_order,
          },
        ]);

        if (error) throw error;
      }

      setIsEditing(false);
      fetchOffers();
    } catch (err) {
      console.error("Error saving offer:", err);
      alert("Failed to save offer details. Check console logs.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (id: string, currentHiddenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("offers")
        .update({ is_hidden: !currentHiddenStatus })
        .eq("id", id);
      if (error) throw error;
      fetchOffers();
    } catch (err) {
      console.error("Error toggling offer visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return;
    setLoading(true);

    try {
      const offerToDelete = offers.find(o => o.id === id);
      const { error } = await supabase.from("offers").delete().eq("id", id);
      if (error) throw error;

      if (offerToDelete?.src) {
        await deleteAsset(offerToDelete.src);
      }

      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err);
      alert("Failed to delete offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Carousel Offers CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage promotional banners displayed on the homepage
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
          >
            <Plus size={16} />
            Create Offer
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentOffer.id ? "Edit Offer" : "New Offer Banner"}
          </h3>

          <div className="grid grid-cols-1 gap-6 text-sm">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Banner Image
              </label>
              <MediaUploader
                value={currentOffer.src || ""}
                onChange={(url) => setCurrentOffer({ ...currentOffer, src: url })}
                accept="image/*"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Alt Description / Hover Text
              </label>
              <input
                type="text"
                required
                value={currentOffer.alt}
                onChange={(e) => setCurrentOffer({ ...currentOffer, alt: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                placeholder="Get 30% discount on combo entry passes"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Display Order
                </label>
                <input
                  type="number"
                  required
                  value={currentOffer.display_order}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, display_order: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Aspect Ratio
                </label>
                <input
                  type="text"
                  required
                  value={currentOffer.aspect_ratio}
                  onChange={(e) => setCurrentOffer({ ...currentOffer, aspect_ratio: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="1.5"
                />
              </div>
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
              Save Offer
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
            </div>
          ) : offers.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm">
              No promotional banners configured. Click "Create Offer" to get started.
            </div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
                <div className="relative aspect-[3/2] w-full bg-slate-950 flex items-center justify-center text-slate-700 overflow-hidden">
                  {offer.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={offer.src.startsWith("http") || offer.src.startsWith("/") ? offer.src : `/${offer.src}`}
                      alt={offer.alt}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon size={48} />
                  )}
                  <span className="absolute top-3 left-3 bg-black/70 border border-slate-800 text-[10px] font-bold text-accent px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Order: {offer.display_order}
                  </span>
                  <span className={`absolute top-3 right-3 border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    offer.is_hidden
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                      : "bg-green-500/20 border-green-500/50 text-green-400"
                  }`}>
                    {offer.is_hidden ? "Hidden" : "Visible"}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Alt Description
                    </h4>
                    <p className="text-sm font-semibold text-slate-200 mt-1 line-clamp-2">
                      {offer.alt || "No text set"}
                    </p>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-slate-850 pt-4 flex-wrap">
                    <button
                      onClick={() => handleToggleHide(offer.id, !!offer.is_hidden)}
                      className={`flex items-center gap-1 px-3 py-2 font-bold text-xs uppercase rounded-lg transition ${
                        offer.is_hidden
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                      }`}
                    >
                      {offer.is_hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                      {offer.is_hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => handleEdit(offer)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-lg transition"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
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
