"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
};

export const defaultSettings: SiteSettings = {
  whatsappNumber: "+91 82757 37579",
  contactPhone: "+91 8605362212",
  contactEmail: "shivtirthtourism@gmail.com",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase.from("settings").select("key, value");
        if (!error && data) {
          const map: Record<string, string> = {};
          data.forEach((s) => {
            if (s.key && s.value) {
              // Clean outer double quotes if stringified
              map[s.key] = s.value.replace(/^"|"$/g, "").trim();
            }
          });

          setSettings({
            whatsappNumber: map["whatsapp_number"] || defaultSettings.whatsappNumber,
            contactPhone: map["contact_phone"] || defaultSettings.contactPhone,
            contactEmail: map["contact_email"] || defaultSettings.contactEmail,
          });
        }
      } catch (err) {
        console.error("Failed loading site settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  return { settings, loading };
}
