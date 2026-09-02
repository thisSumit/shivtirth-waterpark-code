"use client";

import React from "react";
import { motion, Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  align?: "center" | "left" | "right";
  underline?: boolean;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  align = "center",
  underline = true,
}) => {
  const alignClass =
    align === "left"
      ? "text-left items-start"
      : align === "right"
        ? "text-right items-end"
        : "text-center items-center";

  const words = title.split(" ");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className={cn("flex flex-col mb-6 md:mb-8", alignClass, className)}>
      <motion.h2
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className={cn(
          "text-2xl md:text-3xl font-bold uppercase tracking-tight text-slate-900 font-times",
          titleClassName
        )}
        style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
      >
        {words.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            variants={wordVariants}
            className="inline-block mr-1.5 md:mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={cn(
            "max-w-2xl text-lg leading-relaxed text-orange-500 font-medium",
            subtitleClassName
          )}
        >
          {subtitle}
        </motion.p>
      )}

      {underline && (
        <motion.div
          variants={lineVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="h-1 w-12 md:w-16 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full mt-3 origin-center"
        />
      )}
    </div>
  );
};

export default AnimatedHeading;
