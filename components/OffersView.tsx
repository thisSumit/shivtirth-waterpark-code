"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tag, Package as PackageIcon } from "lucide-react";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export type PackageItem = {
  name: string;
  image: string;
  originalPrice: string;
  discountedPrice: string;
  tag?: string;
  description: string;
  inclusions: string[];
  note?: string | null;
  cta: string;
  link: string;
  singlePrice?: number | null;
  groupPrice?: number | null;
};

export type OfferCardItem = {
  title: string;
  image: string;
  alt: string;
  highlight: string;
  description: string;
  oldPrice: string;
  newPrice: string;
  badge: string;
  cta: string;
  link: string;
  footer: string;
  note?: string | null;
  singlePrice: number | null;
  groupPrice: number | null;
};

interface OffersViewProps {
  offerCards: OfferCardItem[];
  packageCards: PackageItem[];
  accommodationCards: PackageItem[];
}

function NoteSection({ note }: { note?: string | null }) {
  if (!note || !note.trim()) return null;

  return (
    <div className="mt-2 mb-2 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5">
      <div className="flex items-start gap-2">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">
            Note
          </p>
          <p className="text-xs leading-relaxed text-amber-100 whitespace-pre-line">
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OffersView({
  offerCards,
  packageCards,
  accommodationCards,
}: OffersViewProps) {
  const [activeTab, setActiveTab] = useState<"packages" | "offers">("packages");

  useEffect(() => {
    // Sync with URL hash if loaded with #packages-list
    if (typeof window !== "undefined" && window.location.hash === "#packages-list") {
      setActiveTab("packages");
    }
  }, []);

  return (
    <div className="pt-4">
      {/* =====================================================
          TAB TOGGLE BUTTONS
      ===================================================== */}
      <div className="flex justify-center mb-4 px-4">
        <div className="inline-flex items-center p-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("packages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${activeTab === "packages"
              ? "bg-accent text-slate-950 shadow-lg shadow-accent/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
          >
            <PackageIcon className="w-4 h-4" />
            <span>Packages</span>
            <span
              className={`text-sm px-2 py-0.5 rounded-full font-semibold ${activeTab === "packages"
                ? "bg-slate-950/20 text-slate-950"
                : "bg-slate-800 text-slate-400"
                }`}
            >
              {packageCards.length + accommodationCards.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("offers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer ${activeTab === "offers"
              ? "bg-accent text-slate-950 shadow-lg shadow-accent/20"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
          >
            <Tag className="w-4 h-4" />
            <span>Offers</span>
            <span
              className={`text-sm px-2 py-0.5 rounded-full font-semibold ${activeTab === "offers"
                ? "bg-slate-950/20 text-slate-950"
                : "bg-slate-800 text-slate-400"
                }`}
            >
              {offerCards.length}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          TAB CONTENT: OFFERS
      ===================================================== */}
      {activeTab === "offers" && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12 animate-fadeIn">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Featured Deals
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-white font-times uppercase"
              style={{
                fontFamily: "'Times New Roman', Times, Georgia, serif",
              }}
            >
              Limited-Time Special Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerCards.map((offer) => (
              <Link
                key={offer.title}
                href={offer.link}
                aria-label={offer.cta}
                className="group flex h-full flex-col bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-950">
                  <Image
                    src={offer.image}
                    alt={offer.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  {offer.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                      {offer.badge}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-1 flex-col justify-between text-white">
                  <div>
                    <h3
                      className="text-xl md:text-2xl font-bold font-times mb-1 text-white"
                      style={{
                        fontFamily: "'Times New Roman', Times, Georgia, serif",
                      }}
                    >
                      {offer.title}
                    </h3>
                    <p className="font-bold text-amber-400 mb-1 text-xs md:text-sm">
                      {offer.highlight}
                    </p>
                    <p className="text-slate-300 mb-3 text-xs md:text-sm leading-relaxed">
                      {offer.description}
                    </p>

                    {/* Pricing */}
                    {offer.groupPrice ? (
                      <div className="space-y-1 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <div className="flex items-end gap-2.5">
                          <span className="text-2xl font-bold text-amber-400">
                            ₹{offer.groupPrice}
                          </span>
                          <span className="text-xs font-semibold text-amber-300/90 mb-1">
                            per person (Group)
                          </span>
                          {!!offer.oldPrice && (
                            <span className="text-slate-400 line-through text-base mb-0.5">
                              {offer.oldPrice}
                            </span>
                          )}
                        </div>
                        {offer.singlePrice && (
                          <p className="text-xs font-medium text-slate-300">
                            Single Entry Price: ₹{offer.singlePrice}
                          </p>
                        )}
                      </div>
                    ) : (
                      !!offer.newPrice && (
                        <div className="flex items-end gap-3 mb-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-2xl font-bold text-amber-400">
                            {offer.newPrice}
                          </span>
                          {!!offer.oldPrice && (
                            <span className="text-slate-400 line-through text-base mb-0.5">
                              {offer.oldPrice}
                            </span>
                          )}
                        </div>
                      )
                    )}

                    {/* Ladies Offer Special Information */}
                    {offer.title.includes("LADKI BAHIN") && (
                      <div className="rounded-xl bg-amber-400/10 border border-amber-400/30 p-3 mb-4 text-xs text-amber-200 space-y-1">
                        <p>• Waterpark + Amusement + Adventure (3 Parks = 1 Ticket)</p>
                        <p>• Complimentary Welcome Drink</p>
                        <p>• Group Offer: ₹550 per person</p>
                        <p>• Perfect for friends&apos; day out</p>
                      </div>
                    )}

                    {/* Note Section */}
                    <NoteSection note={offer.note} />
                  </div>

                  <div className="px-5 pb-5 pt-1 text-slate-900">
                    <InteractiveHoverButton>BUY TICKETS</InteractiveHoverButton>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* =====================================================
          TAB CONTENT: PACKAGES
      ===================================================== */}
      {activeTab === "packages" && (
        <div className="animate-fadeIn">
          {/* STANDARD PACKAGES */}
          <section className="py-12 bg-gradient-to-b from-slate-950/60 via-cyan-950/40 to-slate-950/60 border-y border-slate-800">
            <div className="text-center mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                All-Inclusive Packages
              </p>
              <h2
                className="text-2xl md:text-3xl font-bold text-white font-times uppercase"
                style={{
                  fontFamily: "'Times New Roman', Times, Georgia, serif",
                }}
              >
                Standard Entry Packages
              </h2>
              <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl mx-auto">
                Choose the perfect package to match your family plan and budget.
              </p>
            </div>

            <div id="packages-list" className="max-w-7xl mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packageCards.map((pkg) => {
                  const originalVal = pkg.originalPrice
                    ? parseInt(pkg.originalPrice.replace(/[^\d]/g, ""))
                    : 0;
                  const discountedVal = pkg.discountedPrice
                    ? parseInt(pkg.discountedPrice.replace(/[^\d]/g, ""))
                    : 0;
                  const hasSavings = originalVal > discountedVal;
                  const savingsPercent = hasSavings
                    ? Math.round(((originalVal - discountedVal) / originalVal) * 100)
                    : 0;

                  return (
                    <Link
                      key={pkg.name}
                      href={pkg.link || "#"}
                      className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                    >
                      <div>
                        {pkg.tag && (
                          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                            {pkg.tag}
                          </div>
                        )}

                        <div className="relative h-48 overflow-hidden bg-slate-950">
                          <Image
                            src={pkg.image}
                            alt={pkg.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        </div>

                        <div className="p-5 text-white">
                          <h3
                            className="text-xl font-bold font-times mb-1 text-white"
                            style={{
                              fontFamily: "'Times New Roman', Times, Georgia, serif",
                            }}
                          >
                            {pkg.name}
                          </h3>
                          <p className="text-slate-300 mb-3 text-xs leading-relaxed">
                            {pkg.description}
                          </p>

                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-4">
                            {pkg.groupPrice ? (
                              <div className="space-y-0.5">
                                <div className="flex items-end gap-2">
                                  <div className="text-2xl font-bold text-amber-400">
                                    ₹{pkg.groupPrice}
                                  </div>
                                  <span className="text-xs font-semibold text-amber-300/90 mb-0.5">
                                    per person (Group)
                                  </span>
                                  {pkg.originalPrice && (
                                    <div className="text-sm text-slate-400 line-through mb-0.5">
                                      {pkg.originalPrice}
                                    </div>
                                  )}
                                </div>
                                {pkg.singlePrice && (
                                  <p className="text-[11px] font-medium text-slate-300">
                                    Single Entry: ₹{pkg.singlePrice}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-end gap-2">
                                <div className="text-2xl font-bold text-amber-400">
                                  {pkg.discountedPrice}
                                </div>
                                {pkg.originalPrice && (
                                  <div className="text-sm text-slate-400 line-through mb-0.5">
                                    {pkg.originalPrice}
                                  </div>
                                )}
                                {hasSavings && (
                                  <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 mb-0.5">
                                    Save {savingsPercent}%
                                  </div>
                                )}
                              </div>
                            )}
                            <p className="text-[10px] text-slate-400 mt-1">
                              Per person pricing
                            </p>
                          </div>

                          <div className="mb-2">
                            <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                              Package Includes
                            </p>
                          </div>

                          <ul className="space-y-1.5">
                            {pkg.inclusions.map((item, index) => (
                              <li
                                key={`${item}-${index}`}
                                className="flex items-start gap-2 text-xs text-slate-200"
                              >
                                <span className="text-amber-400 font-bold">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          <NoteSection note={pkg.note} />
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-1 text-slate-900">
                        <InteractiveHoverButton>BUY TICKETS</InteractiveHoverButton>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* STAY & ACCOMMODATION PACKAGES */}
          {accommodationCards.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
              <div className="text-center mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Overnight Experience
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-white font-times uppercase"
                  style={{
                    fontFamily: "'Times New Roman', Times, Georgia, serif",
                  }}
                >
                  Stay & Accommodation Packages
                </h2>
                <p className="text-slate-300 text-xs md:text-sm mt-1">
                  Extend your stay with peaceful campfire nights and luxury camping accommodations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {accommodationCards.map((pkg) => {
                  const originalVal = pkg.originalPrice
                    ? parseInt(pkg.originalPrice.replace(/[^\d]/g, ""))
                    : 0;
                  const discountedVal = pkg.discountedPrice
                    ? parseInt(pkg.discountedPrice.replace(/[^\d]/g, ""))
                    : 0;
                  const hasSavings = originalVal > discountedVal;
                  const savingsPercent = hasSavings
                    ? Math.round(((originalVal - discountedVal) / originalVal) * 100)
                    : 0;

                  return (
                    <Link
                      key={pkg.name}
                      href={pkg.link || "#"}
                      className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-xl hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between mx-auto w-full"
                    >
                      <div>
                        {pkg.tag && (
                          <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-md">
                            {pkg.tag}
                          </div>
                        )}

                        <div className="relative h-48 overflow-hidden bg-slate-950">
                          <Image
                            src={pkg.image}
                            alt={pkg.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        </div>

                        <div className="p-5 text-white">
                          <h3
                            className="text-xl font-bold font-times mb-1 text-white"
                            style={{
                              fontFamily: "'Times New Roman', Times, Georgia, serif",
                            }}
                          >
                            {pkg.name}
                          </h3>
                          <p className="text-slate-300 mb-3 text-xs leading-relaxed">
                            {pkg.description}
                          </p>

                          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-4">
                            <div className="flex items-end gap-2">
                              <div className="text-2xl font-bold text-amber-400">
                                {pkg.discountedPrice}
                              </div>
                              {pkg.originalPrice && (
                                <div className="text-sm text-slate-400 line-through mb-0.5">
                                  {pkg.originalPrice}
                                </div>
                              )}
                              {hasSavings && (
                                <div className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 mb-0.5">
                                  Save {savingsPercent}%
                                </div>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Per person / night pricing
                            </p>
                          </div>

                          <div className="mb-2">
                            <p className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                              Package Includes
                            </p>
                          </div>

                          <ul className="space-y-1.5">
                            {pkg.inclusions.map((item, index) => (
                              <li
                                key={`${item}-${index}`}
                                className="flex items-start gap-2 text-xs text-slate-200"
                              >
                                <span className="text-amber-400 font-bold">✓</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>

                          <NoteSection note={pkg.note} />
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-1 text-slate-900">
                        <InteractiveHoverButton>BUY TICKETS</InteractiveHoverButton>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
