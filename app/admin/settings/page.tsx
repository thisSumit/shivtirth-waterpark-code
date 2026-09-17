"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, ShieldAlert, Phone, Mail, Clock, Utensils, Globe, Search, BarChart } from "lucide-react";

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
  const [contactPhone2, setContactPhone2] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [fullMealPrice, setFullMealPrice] = useState("300");
  const [lunchMealPrice, setLunchMealPrice] = useState("200");
  const [cutoffHours, setCutoffHours] = useState("0");
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState("");
  const [googleSearchConsoleCode, setGoogleSearchConsoleCode] = useState("");

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

        // Map Support Phone 1 & 2
        const ph = data.find(s => s.key === "contact_phone");
        if (ph) setContactPhone(ph.value);

        const ph2 = data.find(s => s.key === "contact_phone_2");
        if (ph2) setContactPhone2(ph2.value);

        // Map Email
        const em = data.find(s => s.key === "contact_email");
        if (em) setContactEmail(em.value);

        // Map Meal Prices
        const fullMeal = data.find(s => s.key === "meal_full_price");
        if (fullMeal) setFullMealPrice(fullMeal.value);

        const lunchMeal = data.find(s => s.key === "meal_lunch_price");
        if (lunchMeal) setLunchMealPrice(lunchMeal.value);

        // Map Cutoff
        const cut = data.find(s => s.key === "booking_cutoff_hours");
        if (cut) setCutoffHours(cut.value);

        // Map Google Analytics & Search Console
        const ga = data.find(s => s.key === "google_analytics_id");
        if (ga) setGoogleAnalyticsId(ga.value);

        const gsc = data.find(s => s.key === "google_search_console_code");
        if (gsc) setGoogleSearchConsoleCode(gsc.value);
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
      alert(`Setting "${key.toUpperCase().replace(/_/g, " ")}" saved successfully!`);
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
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-black text-white uppercase tracking-wide">
          Global System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Adjust contact lines, support emails, meal add-on pricing, and booking parameters
        </p>
      </div>

      {/* Support & Contact Channels */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-8 divide-y divide-slate-850">
        <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 pb-2 border-b border-slate-800">
          <Phone size={18} className="text-accent" /> Contact & Helpline Settings
        </h2>

        {/* Support Call Line 1 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 first:pt-4">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Phone size={14} className="text-blue-400" />
              Support Call Line 1
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Primary voice support telephone number shown on website navbar and footer.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-52 font-bold"
              placeholder="+91 86053 62212"
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

        {/* Support Call Line 2 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Phone size={14} className="text-cyan-400" />
              Support Call Line 2
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Secondary voice support helpline number shown across contact pages and footer.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={contactPhone2}
              onChange={(e) => setContactPhone2(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-52 font-bold"
              placeholder="+91 82757 37579"
            />
            <button
              onClick={() => handleSaveSetting("contact_phone_2", contactPhone2)}
              disabled={savingKey === "contact_phone_2"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>

        {/* WhatsApp Help Line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6">
          <div className="space-y-1 md:max-w-md">
            <span className="flex items-center gap-2 font-bold text-white uppercase text-xs tracking-wider">
              <Phone size={14} className="text-green-500" />
              WhatsApp Help Line
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Active WhatsApp number for instant chat assistance and WhatsApp floating widget.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-52 font-bold"
              placeholder="+91 82757 37579"
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
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-52 font-semibold"
              placeholder="shivtirthtourism@gmail.com"
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
      </div>

      {/* Meal Add-on Pricing CMS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Utensils size={18} className="text-accent" /> Meal Add-on Pricing CMS
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Customize prices for meal options (Full Meal & Only Lunch) selected by guests on the booking page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Full Meal Price */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Full Meal Add-on Price (₹)
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Breakfast + Lunch + Dinner combined meal package per person.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={fullMealPrice}
                onChange={(e) => setFullMealPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-accent font-black focus:outline-none focus:border-accent"
                placeholder="300"
              />
              <button
                onClick={() => handleSaveSetting("meal_full_price", fullMealPrice)}
                disabled={savingKey === "meal_full_price"}
                className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-2.5 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
              >
                Save
              </button>
            </div>
          </div>

          {/* Lunch Price */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Only Lunch Add-on Price (₹)
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Standalone buffet lunch package per person during visit.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm font-bold text-slate-400">₹</span>
              <input
                type="number"
                value={lunchMealPrice}
                onChange={(e) => setLunchMealPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-accent font-black focus:outline-none focus:border-accent"
                placeholder="200"
              />
              <button
                onClick={() => handleSaveSetting("meal_lunch_price", lunchMealPrice)}
                disabled={savingKey === "meal_lunch_price"}
                className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-2.5 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-3">
          <Clock size={18} className="text-purple-400" /> Booking Parameters
        </h2>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1 md:max-w-md">
            <span className="font-bold text-white uppercase text-xs tracking-wider block">
              Booking Cut-off Window (Hours)
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Number of hours before visit time when online booking closes for the date.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="number"
              value={cutoffHours}
              onChange={(e) => setCutoffHours(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-48 font-bold"
              placeholder="0"
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

      {/* SEO & Analytics Settings */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg space-y-6">
        <h2 className="text-lg font-bold text-white uppercase tracking-wide flex items-center gap-2 border-b border-slate-800 pb-3">
          <Globe size={18} className="text-emerald-400" /> SEO, Google Tag & Search Console
        </h2>

        {/* Google Analytics / Tag ID */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-slate-850">
          <div className="space-y-1 md:max-w-md">
            <span className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
              <BarChart size={14} className="text-emerald-400" />
              Google Tag / Analytics Measurement ID
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your Google Analytics 4 ID (e.g. <code>G-XXXXXXXXXX</code>) or Google Tag Manager ID (e.g. <code>GTM-XXXXXXX</code>) to enable tracking.
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={googleAnalyticsId}
              onChange={(e) => setGoogleAnalyticsId(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-56 font-mono"
              placeholder="G-XXXXXXXXXX or GTM-XXXXXXX"
            />
            <button
              onClick={() => handleSaveSetting("google_analytics_id", googleAnalyticsId)}
              disabled={savingKey === "google_analytics_id"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>

        {/* Google Search Console Verification Token */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          <div className="space-y-1 md:max-w-md">
            <span className="font-bold text-white uppercase text-xs tracking-wider flex items-center gap-2">
              <Search size={14} className="text-blue-400" />
              Google Search Console Verification Code
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your Google Search Console verification meta token (the <code>content=&quot;...&quot;</code> attribute).
            </p>
          </div>
          <div className="flex gap-2 items-center w-full md:w-auto">
            <input
              type="text"
              value={googleSearchConsoleCode}
              onChange={(e) => setGoogleSearchConsoleCode(e.target.value)}
              className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-accent text-white w-full md:w-56 font-mono"
              placeholder="e.g. 1a2b3c4d5e6f7g8h"
            />
            <button
              onClick={() => handleSaveSetting("google_search_console_code", googleSearchConsoleCode)}
              disabled={savingKey === "google_search_console_code"}
              className="bg-accent hover:bg-accent/90 text-black font-black uppercase text-xs py-3 px-4 rounded-xl transition tracking-wider disabled:opacity-60 shrink-0"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-950/20 border border-amber-500/20 rounded-3xl p-5 flex items-start gap-4">
        <ShieldAlert size={24} className="text-accent shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-black text-white uppercase tracking-wider">
            Important Administration Notice
          </h4>
          <p className="text-slate-400 leading-relaxed">
            Settings saved here directly modify meal pricing, support call lines, and booking parameters across the customer storefront dynamically.
          </p>
        </div>
      </div>
    </div>
  );
}
