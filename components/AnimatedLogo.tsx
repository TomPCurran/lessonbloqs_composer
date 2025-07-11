import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export const LessonbloqsLogoAnimated = () => {
  const square1Y = useMotionValue(0);
  const square2Y = useMotionValue(0);
  const square3Y = useMotionValue(0);

  const rectVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.9,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const pathVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.3,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  // You can adjust these values to change the floating range
  const floatingRanges = {
    square1: [-0.5, 0.5], // Bottom square
    square2: [-1, 1], // Middle square
    square3: [-1.5, 1.5], // Top square
  };

  // You can adjust these values to change the floating speed
  const durations = {
    square1: 3, // Slower
    square2: 2.7, // Medium
    square3: 2.4, // Faster
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className="w-96 h-96"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      initial="hidden"
      animate="visible"
    >
      {/* Bottom Square */}
      <motion.rect
        x="4"
        y="20"
        width="12"
        height="12"
        rx="2"
        fill="#4A90E2"
        variants={rectVariants}
        animate={{
          y: floatingRanges.square1,
          transition: {
            duration: durations.square1,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        style={{ y: square1Y }}
      />

      {/* Middle Square */}
      <motion.rect
        x="14"
        y="13"
        width="12"
        height="12"
        rx="2"
        fill="#6B4CE6"
        variants={rectVariants}
        animate={{
          y: floatingRanges.square2,
          transition: {
            duration: durations.square2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        style={{ y: square2Y }}
      />

      {/* Top Square */}
      <motion.rect
        x="24"
        y="6"
        width="12"
        height="12"
        rx="2"
        fill="#34D399"
        variants={rectVariants}
        animate={{
          y: floatingRanges.square3,
          transition: {
            duration: durations.square3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          },
        }}
        style={{ y: square3Y }}
      />

      {/* Dynamic connecting lines */}
      <motion.path
        d={`M16 ${26} L24 ${19}`}
        stroke="#1A1D2A"
        strokeWidth="1.5"
        variants={pathVariants}
        style={{
          d: useTransform(
            [square1Y, square2Y],
            ([y1, y2]) => `M16 ${26 + y1} L24 ${19 + y2}`
          ),
        }}
      />
      <motion.path
        d={`M26 ${19} L32 ${12}`}
        stroke="#1A1D2A"
        strokeWidth="1.5"
        variants={pathVariants}
        style={{
          d: useTransform(
            [square2Y, square3Y],
            ([y2, y3]) => `M26 ${19 + y2} L32 ${12 + y3}`
          ),
        }}
      />
    </motion.svg>
  );
};

export default LessonbloqsLogoAnimated;
