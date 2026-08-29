"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, ShieldAlert, Phone, HelpCircle, Mail, Clock } from "lucide-react";

type SettingRow = {
  key: string;
  value: string;
  description: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Settings values states
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [fullMealPrice, setFullMealPrice] = useState("300");
  const [lunchMealPrice, setLunchMealPrice] = useState("200");
  const [cutoffHours, setCutoffHours] = useState("0");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("settings").select("*");
      if (error) throw error;

      if (data) {
        setSettings(data);
        
        // Map WhatsApp
        const wa = data.find(s => s.key === "whatsapp_number");
        if (wa) setWhatsappNumber(wa.value);

        // Map Phone
        const ph = data.find(s => s.key === "contact_phone");
        if (ph) setContactPhone(ph.value);

        // Map Email
        const em = data.find(s => s.key === "contact_email");
        if (em) setContactEmail(em.value);

        const fullMeal = data.find(s => s.key === "meal_full_price");
        if (fullMeal) setFullMealPrice(fullMeal.value);

        const lunchMeal = data.find(s => s.key === "meal_lunch_price");
        if (lunchMeal) setLunchMealPrice(lunchMeal.value);

        // Map Cutoff
        const cut = data.find(s => s.key === "booking_cutoff_hours");
        if (cut) setCutoffHours(cut.value);
      }
    } catch (err) {
      console.error("Error loading settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSetting = async (key: string, value: string) => {
    setSavingKey(key);
    try {
      const { error } = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });

      if (error) throw error;
      alert(`Setting "${key.toUpperCase().replace("_", " ")}" saved successfully!`);
    } catch (err) {
      console.error("Error saving setting:", err);
      alert(`Failed to save setting: ${key}`);
    } finally {
      setSavingKey(null);
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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wide">
          Global System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Adjust contact channels, support emails, GST margins, and cutoff parameters
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-8 divide-y divide-slate-850">
        {/* WhatsApp Line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 first:pt-0">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Phone size={14} className="text-green-500" />
              WhatsApp Help Line
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Active WhatsApp number used to receive booking assistance requests directly from checkout pages.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-48 font-bold"
              placeholder="+919876543210"
            />
            <button
              onClick={() => handleSaveSetting("whatsapp_number", whatsappNumber)}
              disabled={savingKey === "whatsapp_number"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>

        {/* Support Phone Lines */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Phone size={14} className="text-blue-400" />
              Support Call Lines
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              General voice support telephone numbers shown on the website navbar and footers.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-48 font-bold"
              placeholder="+91 99999 88888"
            />
            <button
              onClick={() => handleSaveSetting("contact_phone", contactPhone)}
              disabled={savingKey === "contact_phone"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>

        {/* Support Email */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Mail size={14} className="text-red-400" />
              Support Email Address
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Official email address displayed in contact options for refunds or billing inquiries.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-48 font-semibold"
              placeholder="support@shivtirth.com"
            />
            <button
              onClick={() => handleSaveSetting("contact_email", contactEmail)}
              disabled={savingKey === "contact_email"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>



        {/* Meal Pricing */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Clock size={14} className="text-amber-400" />
              Billing Meal Prices
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              These values control the meal add-on pricing shown on the billing page for full meal and lunch options.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-stretch w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Meal</span>
              <input
                type="number"
                value={fullMealPrice}
                onChange={(e) => setFullMealPrice(e.target.value)}
                className="bg-transparent text-sm focus:outline-none text-white w-20 font-bold"
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lunch</span>
              <input
                type="number"
                value={lunchMealPrice}
                onChange={(e) => setLunchMealPrice(e.target.value)}
                className="bg-transparent text-sm focus:outline-none text-white w-20 font-bold"
              />
            </div>
            <button
              onClick={() => {
                handleSaveSetting("meal_full_price", fullMealPrice);
                handleSaveSetting("meal_lunch_price", lunchMealPrice);
              }}
              disabled={savingKey === "meal_full_price" || savingKey === "meal_lunch_price"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>

        {/* Cutoff Hours */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Clock size={14} className="text-purple-400" />
              Booking Cut-off Window (Hours)
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Number of hours before a visit date when new online ticket purchases for that date are disabled.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="number"
              value={cutoffHours}
              onChange={(e) => setCutoffHours(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-48 font-bold"
              placeholder="12"
            />
            <button
              onClick={() => handleSaveSetting("booking_cutoff_hours", cutoffHours)}
              disabled={savingKey === "booking_cutoff_hours"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Add-ons & Pricing CMS */}
      <CheckoutAddonsManager
        handleSaveSetting={handleSaveSetting}
        savingKey={savingKey}
        settings={settings}
      />

      <div className="bg-amber-950/20 border border-amber-500/20 rounded-3xl p-5 flex items-start gap-4">
        <ShieldAlert size={24} className="text-accent shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-black text-white uppercase tracking-wider">
            Important Administration Notice
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Settings saved here directly modify transaction rules, add-on options, and helpline references across the consumer storefront dynamically. Please verify number prefixes (+91) and pricing values before clicking save.
          </p>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_ADDONS = [
  { id: 'boatingpark', name: 'Boating Park Access', price: 690 },
  { id: 'breakfast', name: 'Breakfast', price: 50 },
  { id: 'lunch', name: 'Lunch', price: 250 },
  { id: 'dinner', name: 'Dinner', price: 250 },
  { id: 'combo', name: 'Combined Coupon (All 3 Meals)', price: 550 },
];

function CheckoutAddonsManager({
  handleSaveSetting,
  savingKey,
  settings,
}: {
  handleSaveSetting: (key: string, value: string) => Promise<void>;
  savingKey: string | null;
  settings: SettingRow[];
}) {
  const [addonsList, setAddonsList] = useState<Array<{ id: string; name: string; price: number }>>(DEFAULT_ADDONS);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const addonSetting = settings.find((s) => s.key === "checkout_addons");
    if (addonSetting && addonSetting.value) {
      try {
        const parsed = JSON.parse(addonSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddonsList(parsed);
        }
      } catch (err) {
        console.error("Error parsing checkout_addons setting:", err);
      }
    }
  }, [settings]);

  const handlePriceChange = (id: string, price: number) => {
    setAddonsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: isNaN(price) ? 0 : price } : item))
    );
  };

  const handleNameChange = (id: string, name: string) => {
    setAddonsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name } : item))
    );
  };

  const handleDeleteAddon = (id: string) => {
    if (confirm("Are you sure you want to delete this add-on option?")) {
      setAddonsList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const priceNum = parseFloat(newPrice) || 0;
    const newId = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    setAddonsList((prev) => [...prev, { id: newId, name: newName.trim(), price: priceNum }]);
    setNewName("");
    setNewPrice("");
  };

  const handleSaveAddons = () => {
    handleSaveSetting("checkout_addons", JSON.stringify(addonsList));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <span className="text-accent">🛒</span> Checkout Add-ons & Pricing CMS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage additional ticket options (meals, boating access, rentals) and their prices shown during checkout.
          </p>
        </div>
        <button
          onClick={handleSaveAddons}
          disabled={savingKey === "checkout_addons"}
          className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-5 rounded-xl transition tracking-wider flex items-center gap-2 shrink-0 self-start md:self-auto"
        >
          <Save size={14} />
          Save All Add-ons
        </button>
      </div>

      {/* Add new add-on form */}
      <form onSubmit={handleAddAddon} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1 space-y-1 w-full">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add-on Title</label>
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Costume / Swimwear Rental"
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-accent"
          />
        </div>
        <div className="w-full md:w-36 space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price (₹)</label>
          <input
            type="number"
            required
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="150"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-accent font-bold"
          />
        </div>
        <button
          type="submit"
          className="w-full md:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shrink-0"
        >
          + Add Option
        </button>
      </form>

      {/* Existing Add-ons List */}
      <div className="space-y-3">
        {addonsList.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 border border-slate-800/80 p-3.5 rounded-2xl">
            <div className="flex-1">
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleNameChange(item.id, e.target.value)}
                className="w-full bg-transparent border-b border-transparent focus:border-slate-700 text-sm font-bold text-white focus:outline-none py-1"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-xs font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => handlePriceChange(item.id, parseFloat(e.target.value))}
                  className="w-20 bg-transparent text-sm font-black text-accent focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteAddon(item.id)}
                className="text-xs text-red-400 hover:text-red-300 font-bold uppercase tracking-wider px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
