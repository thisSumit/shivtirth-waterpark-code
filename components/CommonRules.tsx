"use client";

import React from "react";
import AnimatedHeading from "./ui/AnimatedHeading";

const rules = [
  "Follow all safety instructions given by Shivtirth staff.",
  "Children must be supervised by parents or guardians.",
  "Follow all age, height and safety restrictions for rides.",
  "Do not run, push or engage in unsafe behaviour.",
  "Keep the premises clean and use designated dustbins.",
  "Do not damage park property, rides, plants or facilities.",
  "Do not enter restricted or closed areas.",
  "Follow all water, boating and adventure activity guidelines.",
  "Outside food and beverages may be restricted in designated areas.",
  "Shivtirth may temporarily close some attractions due to weather, maintenance or safety requirements.",
];

const CommonRules = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <AnimatedHeading
        title="Common Rules"
        subtitle="Please follow these guidelines to ensure a safe and enjoyable experience for everyone."
      />

      <div className="rounded-2xl bg-white/95 text-slate-900 p-5 shadow-lg border border-cyan-100">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {rules.map((rule) => (
            <li
              key={rule}
              className="flex items-start gap-2.5 text-sm text-slate-700"
            >
              <span className="mt-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-[#288382] shrink-0" />
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default CommonRules;