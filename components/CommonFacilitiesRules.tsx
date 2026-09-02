"use client";

import React from "react";
import AnimatedHeading from "./ui/AnimatedHeading";
import { BadgeCheck } from "lucide-react";

const facilities = [
  "Free Parking",
  "Free Drinking Water Facility at Every Point",
  "Free Savari for Activity Points",
  "Free Life Jackets & Tubes",
  "Well Trained caring Staff & Lifeguards for Safty at Every Point",
  "Various Selfie Points",
  "Washrooms, First Aid, Resting Sheds & Seating Arrangement at Every Point",
  "CCTV Surveillance & Announcement System",
  "Wheelchair Assistance",
  "Baby Care Facility",
  "Generator Backup",
  "Strong DJ  system",
  "Costume & Locker Rental",
  "Online Booking",
];

const CommonFR = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <AnimatedHeading
        title="Special Facilities"
        subtitle="Everything you need for a comfortable, safe, and enjoyable visit."
      />

      <div className="mt-6 rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-cyan-100">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {facilities.map((facility) => (
            <li
              key={facility}
              className="flex items-start gap-2.5 text-sm text-slate-700"
            >
              <span className="mt-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-[#288382] text-cyan-700 shrink-0">
              </span>
              <span>{facility}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CommonFR;