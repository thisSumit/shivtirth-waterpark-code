"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  text1 = "Build Amazing",
  duration = 3000,
}: {
  text: string;
  text1: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <motion.span
        layoutId="subtext"
        className="text-4xl font-bold tracking-tight md:text-7xl z-10"
      >
        {text}
      </motion.span>

      <motion.span
        layout
        className="relative overflow-hidden mx-1 font-sans text-4xl font-bold tracking-tight text-accent md:text-7xl"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -40, filter: "blur(10px)", opacity:20 }}
            animate={{
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{ y: 50, filter: "blur(10px)", opacity: 0 }}
            transition={{
              duration: 0.5,
            }}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
      <motion.span
        layoutId="subtext1"
        className="text-4xl font-bold tracking-tight md:text-7xl"
      >
        {text1}
      </motion.span>
    </>
  );
};
