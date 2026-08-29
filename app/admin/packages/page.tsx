"use client";

import React, { useState, useEffect } from "react";
import { supabase, uploadAsset, deleteAsset } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Save, X, Layers, AlertCircle, Eye, EyeOff } from "lucide-react";
import MediaUploader from "@/components/MediaUploader";

type PackageItem = {
  id: string;
  plan_id: string;
  category: "package" | "offer" | "accommodation";
  name: string;
  image: string;
  original_price: number | null;
  discounted_price: number;
  tag: string | null;
  description: string;
  inclusions: string[];
  display_order: number;
  hide_after?: string | null;
  highlight: string | null;
  covers: string[];
  rules: string[];
  consent_text: string | null;
  ticket_options: Array<{ id: string; label: string; price: number }>;
  cta: string;
  footer: string | null;
  is_hidden?: boolean;
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<PackageItem>>({
    plan_id: "",
    category: "package",
    name: "",
    image: "",
    original_price: null,
    discounted_price: 590,
    tag: "",
    description: "",
    inclusions: [],
    display_order: 1,
    hide_after: "",
    highlight: "",
    covers: [],
    rules: [],
    consent_text: "",
    ticket_options: [{ id: "regular", label: "Entry Ticket", price: 590 }],
    cta: "Book Now",
    footer: "",
  });

  // Array text fields inputs
  const [inclusionsText, setInclusionsText] = useState("");
  const [coversText, setCoversText] = useState("");
  const [rulesText, setRulesText] = useState("");

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (err) {
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const toDateTimeLocalValue = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleEdit = (pkg: PackageItem) => {
    setCurrentPackage(pkg);
    setInclusionsText((pkg.inclusions || []).join("\n"));
    setCoversText((pkg.covers || []).join("\n"));
    setRulesText((pkg.rules || []).join("\n"));
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setCurrentPackage({
      plan_id: "",
      category: "package",
      name: "",
      image: "",
      original_price: null,
      discounted_price: 590,
      tag: "",
      description: "",
      inclusions: [],
      display_order: packages.length + 1,
      hide_after: "",
      highlight: "",
      covers: [],
      rules: [],
      consent_text: "",
      ticket_options: [{ id: "regular", label: "Entry Ticket", price: 590 }],
      cta: "Book Now",
      footer: "",
    });
    setInclusionsText("");
    setCoversText("");
    setRulesText("");
    setIsEditing(true);
  };

  const handleTicketOptionChange = (index: number, field: "label" | "price", value: string | number) => {
    const opts = [...(currentPackage.ticket_options || [])];
    opts[index] = {
      ...opts[index],
      [field]: field === "price" ? Number(value) : value,
      id: field === "label" ? String(value).toLowerCase().replace(/[^a-z0-9]/g, "") : opts[index].id,
    };
    setCurrentPackage({ ...currentPackage, ticket_options: opts });
  };

  const addTicketOption = () => {
    const opts = [...(currentPackage.ticket_options || [])];
    if (opts.length === 1 && (opts[0].label === "Entry Ticket" || opts[0].label === "New Ticket Option" || !opts[0].label)) {
      opts[0].label = "Single Entry";
      opts[0].id = "single";
      opts[0].price = 690;
    }
    const isSecondOption = opts.length === 1;
    opts.push({
      id: isSecondOption ? "group" : `ticket_${Date.now()}`,
      label: isSecondOption ? "Group Entry" : "New Ticket Option",
      price: isSecondOption ? 550 : 500
    });
    setCurrentPackage({ ...currentPackage, ticket_options: opts });
  };

  const removeTicketOption = (index: number) => {
    const opts = [...(currentPackage.ticket_options || [])];
    if (opts.length <= 1) {
      alert("At least one ticket option is required.");
      return;
    }
    opts.splice(index, 1);
    setCurrentPackage({ ...currentPackage, ticket_options: opts });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedInclusions = inclusionsText.split("\n").map(t => t.trim()).filter(Boolean);
    const parsedCovers = coversText.split("\n").map(t => t.trim()).filter(Boolean);
    const parsedRules = rulesText.split("\n").map(t => t.trim()).filter(Boolean);

    const payload = {
      plan_id: currentPackage.plan_id || String(currentPackage.name).toLowerCase().replace(/[^a-z0-9]/g, ""),
      category: currentPackage.category,
      name: currentPackage.name,
      image: currentPackage.image,
      original_price: currentPackage.original_price || null,
      discounted_price: Number(currentPackage.discounted_price),
      tag: currentPackage.tag || null,
      description: currentPackage.description,
      inclusions: parsedInclusions,
      display_order: Number(currentPackage.display_order),
      hide_after: currentPackage.hide_after ? new Date(currentPackage.hide_after).toISOString() : null,
      highlight: currentPackage.highlight || "",
      covers: parsedCovers,
      rules: parsedRules,
      consent_text: currentPackage.consent_text || null,
      ticket_options: currentPackage.ticket_options || [],
      cta: currentPackage.cta || "Book Now",
      footer: currentPackage.footer || null,
    };

    try {
      if (currentPackage.id) {
        const { error } = await supabase
          .from("packages")
          .update(payload)
          .eq("id", currentPackage.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("packages").insert([payload]);
        if (error) throw error;
      }

      setIsEditing(false);
      fetchPackages();
    } catch (err: any) {
      console.error("Error saving package:", err);
      alert("Failed to save package: " + (err?.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (id: string, currentHiddenStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("packages")
        .update({ is_hidden: !currentHiddenStatus })
        .eq("id", id);
      if (error) throw error;
      fetchPackages();
    } catch (err) {
      console.error("Error toggling package visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package/combo pass?")) return;
    setLoading(true);

    try {
      const packageToDelete = packages.find(p => p.id === id);
      const { error } = await supabase.from("packages").delete().eq("id", id);
      if (error) throw error;

      if (packageToDelete?.image) {
        await deleteAsset(packageToDelete.image);
      }

      fetchPackages();
    } catch (err) {
      console.error("Error deleting package:", err);
      alert("Failed to delete package.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-wide">
            Packages & Special Offers CMS
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure rates, Special Offers/Promotions, inclusions, rules, and checkout consent checkmarks.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl shadow-lg transition tracking-wider"
          >
            <Plus size={16} />
            Create Package
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6 max-w-4xl">
          <h3 className="text-lg font-bold text-white uppercase tracking-wide border-b border-slate-800 pb-3">
            {currentPackage.id ? "Edit Package Details" : "New Package"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Unique Plan ID
              </label>
              <input
                type="text"
                required
                value={currentPackage.plan_id}
                onChange={(e) => setCurrentPackage({ ...currentPackage, plan_id: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                placeholder="waterpark-standard"
                disabled={!!currentPackage.id}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <select
                value={currentPackage.category}
                onChange={(e) => setCurrentPackage({ ...currentPackage, category: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
              >
                <option value="package">Standard Package</option>
                <option value="offer">Special Offer / Promotion</option>
                <option value="accommodation">Accommodation Stay Package</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Package Name
              </label>
              <input
                type="text"
                required
                value={currentPackage.name}
                onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                placeholder="Silver Combo Pass"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Featured Cover Image
              </label>
              <MediaUploader
                value={currentPackage.image || ""}
                onChange={(url) => setCurrentPackage({ ...currentPackage, image: url })}
                accept="image/*"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Original Price (Strikethrough)
                </label>
                <input
                  type="number"
                  value={currentPackage.original_price || ""}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, original_price: e.target.value ? Number(e.target.value) : null })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="₹1280"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Discounted Base Price
                </label>
                <input
                  type="number"
                  required
                  value={currentPackage.discounted_price || ""}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, discounted_price: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="₹890"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Display Order Tag
                </label>
                <input
                  type="text"
                  value={currentPackage.tag || ""}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, tag: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="Best Value"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Sorting Order
                </label>
                <input
                  type="number"
                  required
                  value={currentPackage.display_order}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, display_order: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Expire / Hide After
              </label>
              <input
                type="datetime-local"
                value={toDateTimeLocalValue(currentPackage.hide_after)}
                onChange={(e) => setCurrentPackage({ ...currentPackage, hide_after: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
              />
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">
                Offer/package automatically hides after this date and time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Button Call-to-Action (CTA) Text
                </label>
                <input
                  type="text"
                  value={currentPackage.cta || ""}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, cta: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="e.g. Book Now, Book Student Offer"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Card Footer Subtext
                </label>
                <input
                  type="text"
                  value={currentPackage.footer || ""}
                  onChange={(e) => setCurrentPackage({ ...currentPackage, footer: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm"
                  placeholder="e.g. Limited Period Special, Group Offer available"
                />
              </div>
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Plan Description
              </label>
              <textarea
                value={currentPackage.description}
                onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
                className="w-full h-20 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm resize-none"
                placeholder="Waterpark Package + Boating Park activities combined..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Inclusions (One per line)
              </label>
              <textarea
                value={inclusionsText}
                onChange={(e) => setInclusionsText(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
                placeholder="Full day waterpark access&#10;7 Boating activities&#10;Complimentary Snacks"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Covers / Features (One per line)
              </label>
              <textarea
                value={coversText}
                onChange={(e) => setCoversText(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
                placeholder="Adishakti Waterfall&#10;Foam Dance Pool&#10; Columbus Ride"
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Rules & Guidelines (One per line)
              </label>
              <textarea
                value={rulesText}
                onChange={(e) => setRulesText(e.target.value)}
                className="w-full h-24 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
                placeholder="Nylon swimwear mandatory for pool access&#10;No food from outside allowed"
              />
            </div>

            <div className="space-y-2 col-span-full">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Consent / Agreement Checkbox Text (Leave blank if not needed)
              </label>
              <input
                type="text"
                value={currentPackage.consent_text || ""}
                onChange={(e) => setCurrentPackage({ ...currentPackage, consent_text: e.target.value })}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-accent text-sm font-semibold"
                placeholder="e.g. I confirm this booking is for ladies only entry."
              />
            </div>

            {/* Ticket Options Editor */}
            <div className="col-span-full border-t border-slate-800 pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ticket Types & Pricing Options
                </h4>
                <button
                  type="button"
                  onClick={addTicketOption}
                  className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-accent border border-slate-800 font-bold text-xs uppercase rounded-lg transition"
                >
                  + Add Option
                </button>
              </div>

              <div className="space-y-3">
                {(currentPackage.ticket_options || []).map((opt, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      required
                      value={opt.label}
                      onChange={(e) => handleTicketOptionChange(idx, "label", e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-accent"
                      placeholder="e.g. Single Entry, Group Entry"
                    />
                    <input
                      type="number"
                      required
                      value={opt.price}
                      onChange={(e) => handleTicketOptionChange(idx, "price", e.target.value)}
                      className="w-32 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-accent"
                      placeholder="Price (e.g. 690, 550)"
                    />
                    <button
                      type="button"
                      onClick={() => removeTicketOption(idx)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
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
              Save Package
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent border-r-2"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-500 text-sm">
              No packages found. Click "Create Package" to add.
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg flex flex-col justify-between group">
                <div className="relative aspect-[16/9] w-full bg-slate-950 flex items-center justify-center text-slate-700 overflow-hidden">
                  {pkg.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pkg.image.startsWith("http") || pkg.image.startsWith("/") ? pkg.image : `/${pkg.image}`}
                      alt={pkg.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Layers size={48} />
                  )}
                  <span className="absolute top-3 left-3 bg-black/70 border border-slate-800 text-[10px] font-bold text-accent px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {pkg.category}
                  </span>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {pkg.tag && (
                      <span className="bg-accent text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {pkg.tag}
                      </span>
                    )}
                    <span className={`border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${pkg.is_hidden
                        ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                        : "bg-green-500/20 border-green-500/50 text-green-400"
                      }`}>
                      {pkg.is_hidden ? "Hidden" : "Visible"}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {pkg.description}
                    </p>
                    <div className="flex gap-2 items-baseline pt-1">
                      <span className="text-lg font-black text-white">
                        ₹{pkg.discounted_price}
                      </span>
                      {pkg.original_price && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{pkg.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-850 pt-4 flex gap-2 justify-end flex-wrap">
                    <button
                      onClick={() => handleToggleHide(pkg.id, !!pkg.is_hidden)}
                      className={`flex items-center gap-1 px-3 py-2 font-bold text-xs uppercase rounded-lg transition ${pkg.is_hidden
                          ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                    >
                      {pkg.is_hidden ? <Eye size={13} /> : <EyeOff size={13} />}
                      {pkg.is_hidden ? "Unhide" : "Hide"}
                    </button>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase rounded-lg transition"
                    >
                      <Edit2 size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pkg.id)}
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
