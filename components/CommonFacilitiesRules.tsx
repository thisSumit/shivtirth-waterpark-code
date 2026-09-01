"use client";

import React from "react";
import AnimatedHeading from "./ui/AnimatedHeading";
import { BadgeCheck } from "lucide-react";

const facilities = [
  "Free Parking",
  "Drinking Water Facility",
  "Free Savari",
  "Life Jackets & Tubes",
  "Trained Lifeguards",
  "Selfie Points",
  "Washrooms & First Aid",
  "CCTV Surveillance",
  "Wheelchair Assistance",
  "Baby Care Facility",
  "Costume & Locker Rental",
  "Online Booking",
  "Highway Touch Location",
];

const CommonFR = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <AnimatedHeading
        title="Common Facilities"
        subtitle="Everything you need for a comfortable, safe, and enjoyable visit."
      />

      <div className="mt-6 rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-cyan-100">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {facilities.map((facility) => (
            <li
              key={facility}
              className="flex items-start gap-2.5 text-sm text-slate-700"
            >
              <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-cyan-700 shrink-0">
                <BadgeCheck className="h-3.5 w-3.5" />
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