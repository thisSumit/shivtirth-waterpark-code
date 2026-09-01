"use client";

import React, { ReactNode } from "react";
import { motion, Variants } from "motion/react";

export type AnimationDirection = "up" | "down" | "left" | "right" | "zoom" | "fade";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: AnimationDirection;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  className?: string;
  staggerChildren?: number;
  amount?: number | "some" | "all";
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 30,
  once = true,
  className = "",
  staggerChildren = 0.1,
  amount = 0.2,
}) => {
  const getVariants = (): Variants => {
    let initialX = 0;
    let initialY = 0;
    let initialScale = 1;

    switch (direction) {
      case "up":
        initialY = distance;
        break;
      case "down":
        initialY = -distance;
        break;
      case "left":
        initialX = distance;
        break;
      case "right":
        initialX = -distance;
        break;
      case "zoom":
        initialScale = 0.85;
        break;
      case "fade":
      default:
        break;
    }

    return {
      hidden: {
        opacity: 0,
        x: initialX,
        y: initialY,
        scale: initialScale,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.215, 0.61, 0.355, 1], // Smooth cubic-bezier
          staggerChildren,
        },
      },
    };
  };

  return (
    <motion.div
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScrollStaggerItem: React.FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
