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

const Speciallity = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <AnimatedHeading
        title="Our Speciality"
        subtitle="A unique blend of adventure, nature, and trusted hospitality that makes every visit unforgettable."
      />

      <ScrollReveal direction="up" delay={0.2} duration={0.5}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 pt-2">
          {specialties.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollStaggerItem key={index}>
                <div className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-amber-400/50 hover:bg-amber-50/30 transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                    {item.text}
                  </span>
                </div>
              </ScrollStaggerItem>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Speciallity;
