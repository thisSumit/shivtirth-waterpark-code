"use client";

import Script from "next/script";
import { useSiteSettings } from "@/lib/useSiteSettings";

export default function GoogleAnalytics() {
  const { settings } = useSiteSettings();
  const gaId = settings.googleAnalyticsId?.trim();
  const gscCode = settings.googleSearchConsoleCode?.trim();

  return (
    <>
      {/* Google Search Console verification meta tag */}
      {gscCode && (
        <meta name="google-site-verification" content={gscCode} />
      )}

      {/* Google Tag / GA4 Script */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', {
                page_path: window.location.pathname,
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}
