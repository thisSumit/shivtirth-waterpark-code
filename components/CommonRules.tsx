"use client";

import React from 'react';
import { ScrollReveal, ScrollStaggerItem } from './ui/ScrollReveal';
import AnimatedHeading from './ui/AnimatedHeading';
import { CheckCircle2, Award, Trees, MapPin, ShieldCheck, Mountain, Compass, Star, Bus, Flame } from 'lucide-react';

const specialties = [
  { text: 'All enjoyment under one roof', icon: Flame },
  { text: 'ISO & Icons of Central India Awarded', icon: Award },
  { text: '1st preference of people with highest rating & reviews', icon: Star },
  { text: 'Natural Hill Station on Satpuda Mountain surrounded by Dam, Forest, Valley', icon: Mountain },
  { text: 'Separate Zones for Fun Food & Relaxation', icon: Flame },
  { text: 'Large area spread across 150 Acres', icon: Trees },
  { text: 'Free Savari from every activity point', icon: Bus },
  { text: 'Easily accessible on National Highway touch', icon: MapPin },
  { text: '47 km from Nagpur City', icon: Compass },
  { text: 'Government authorized tourism center', icon: ShieldCheck },
  { text: 'Surrounded by dam valley and forest', icon: CheckCircle2 },
];

const CommonRules = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <AnimatedHeading
        title="Common Rules & Regulations"
        subtitle="Follow the Rules & Regulations for a Safe and Enjoyable Experience at Shivtirth Water Park"
      />

      <ScrollReveal direction="up" delay={0.2} duration={0.5}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 pt-2">
          {specialties.map((item, index) => {
            const Icon = item.icon;
            return (
              // <ScrollStaggerItem key={index}>
              //   <div className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-amber-400/50 hover:bg-amber-50/30 transition-all duration-300 transform hover:-translate-y-0.5">
              //     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
              //       <Icon className="h-4 w-4" />
              //     </div>
              //     <span className="text-xs md:text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
              //       {item.text}
              //     </span>
              //   </div>
              // </ScrollStaggerItem>
              <ScrollStaggerItem key={index}>
                <div className="group flex items-center gap-2">
                  <div className="flex h-3 w-3 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Icon className="h-2 w-2" />
                  </div>
                  <span className="flex items-start gap-2.5 text-sm text-slate-700">
                    {item.text}
                  </span>
                </div>
              </ScrollStaggerItem>
            );
          })}
        </div>
      </ScrollReveal>
      <p className="text-sm border border-black rounded-md p-2 text-slate-500">
       Rather than above Rules and Regulations of other parks/activities are mentioned separately in their respective sections. Please read them carefully before visiting the park or participating in any activities.
      </p>
    </section>
  );
};

export default CommonRules;
