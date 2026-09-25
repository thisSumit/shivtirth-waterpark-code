"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Waves, Sparkles } from "lucide-react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if initial load already done in this session to make repeat navigation fast
    const hasLoadedBefore = sessionStorage.getItem("hasLoadedWebsiteBefore");
    if (hasLoadedBefore) {
      setIsLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            sessionStorage.setItem("hasLoadedWebsiteBefore", "true");
          }, 400);
          return 100;
        }
        // Smooth random increment
        const increment = Math.floor(Math.random() * 12) + 8;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100000] bg-slate-950 flex flex-col items-center justify-center px-4 overflow-hidden"
        >
          {/* Subtle Ambient Background Water Blur Glow */}
          <div className="absolute w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

          <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
            {/* Logo Container with Scale Animation */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-6 p-4 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-md"
            >
              <Image
                src="/logo.png"
                alt="Shivtirth Water Park Logo"
                width={180}
                height={60}
                className="h-14 w-auto object-contain drop-shadow-md"
                priority
              />
            </motion.div>

            {/* Tagline / Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-2 mb-8 text-slate-300 text-xs font-semibold tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-accent animate-spin" style={{ animationDuration: '3s' }} />
              <span>मौज मस्ती चाहिये, शिवतीर्थ आइए</span>
              <Waves className="w-3.5 h-3.5 text-accent animate-bounce" />
            </motion.div>

            {/* Loading Bar Container */}
            <div className="w-full bg-slate-900/80 rounded-full h-3 border border-slate-800 overflow-hidden shadow-inner p-0.5 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 via-amber-400 to-amber-500 rounded-full relative transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              >
                {/* Glow Edge */}
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/60 blur-[2px] rounded-full" />
              </motion.div>
            </div>

            {/* Percentage Indicator */}
            <div className="flex items-center justify-between w-full mt-3 px-1 text-slate-400 text-xs font-medium">
              <span className="text-slate-400">Loading your adventure...</span>
              <span className="text-accent font-bold text-sm tracking-wider">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
