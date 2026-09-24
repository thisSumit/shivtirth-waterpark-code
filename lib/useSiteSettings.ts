"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  whatsappNumber: string;
  contactPhone: string;
  contactPhone2: string;
  contactEmail: string;
  googleAnalyticsId: string;
  googleSearchConsoleCode: string;
};

export const defaultSettings: SiteSettings = {
  whatsappNumber: "+91 82757 37579",
  contactPhone: "+91 86053 62212",
  contactPhone2: "+91 82757 37579",
  contactEmail: "shivtirthtourism@gmail.com",
  googleAnalyticsId: "",
  googleSearchConsoleCode: "",
};

let cachedSettings: SiteSettings | null = null;
let settingsFetchPromise: Promise<SiteSettings> | null = null;

async function fetchSiteSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings;
  if (settingsFetchPromise) return settingsFetchPromise;

  settingsFetchPromise = (async () => {
    try {
      const { data, error } = await supabase.from("settings").select("key, value");
      if (!error && data) {
        const map: Record<string, string> = {};
        data.forEach((s) => {
          if (s.key && s.value) {
            map[s.key] = s.value.replace(/^"|"$/g, "").trim();
          }
        });

        cachedSettings = {
          whatsappNumber: map["whatsapp_number"] || defaultSettings.whatsappNumber,
          contactPhone: map["contact_phone"] || defaultSettings.contactPhone,
          contactPhone2: map["contact_phone_2"] || defaultSettings.contactPhone2,
          contactEmail: map["contact_email"] || defaultSettings.contactEmail,
          googleAnalyticsId: map["google_analytics_id"] || defaultSettings.googleAnalyticsId,
          googleSearchConsoleCode: map["google_search_console_code"] || defaultSettings.googleSearchConsoleCode,
        };
        return cachedSettings;
      }
    } catch (err) {
      console.error("Failed loading site settings:", err);
    } finally {
      settingsFetchPromise = null;
    }
    return defaultSettings;
  })();

  return settingsFetchPromise;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cachedSettings || defaultSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    let mounted = true;
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    fetchSiteSettings().then((res) => {
      if (mounted) {
        setSettings(res);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return { settings, loading };
}

