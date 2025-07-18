// components/landingPage/hero.tsx
"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AnimatedHero = () => {
  const [mounted, setMounted] = useState(false);
  const [currentSquare, setCurrentSquare] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Animation sequence with staggered timing
    const timeouts = [
      setTimeout(() => setCurrentSquare(1), 500),
      setTimeout(() => setCurrentSquare(2), 1000),
      setTimeout(() => setCurrentSquare(3), 1500),
      setTimeout(() => setTextVisible(true), 2000),
    ];

    // Clean up timeouts on unmount
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Utility function for square animation classes with semantic tokens
  const getSquareClasses = (index: number) => {
    return `
      absolute w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] rounded-[50px] md:rounded-[100px]
      transition-all duration-[3000ms] ease-out motion-standard
      ${
        mounted && currentSquare >= index
          ? "translate-y-0 opacity-20"
          : "-translate-y-full opacity-0"
      }
    `;
  };

  return (
    <section className="relative overflow-hidden min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-secondary/5 to-primary/5 transition-colors duration-300">
      {/* Animated Background Squares */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Blue Square */}
        <div
          className={`${getSquareClasses(1)} bg-primary`}
          style={{
            left: "calc(50% - 800px)",
            top: "calc(50% + 100px)",
            transform:
              mounted && currentSquare >= 1
                ? "translate(0, -50%)"
                : "translate(0, -100%)",
          }}
        />

        {/* Secondary Purple Square */}
        <div
          className={`${getSquareClasses(2)} bg-secondary`}
          style={{
            left: "50%",
            top: "50%",
            transform:
              mounted && currentSquare >= 2
                ? "translate(-50%, -50%)"
                : "translate(-50%, -100%)",
          }}
        />

        {/* Accent Green Square */}
        <div
          className={`${getSquareClasses(3)} bg-accent`}
          style={{
            left: "calc(50% + 200px)",
            top: "calc(50% - 150px)",
            transform:
              mounted && currentSquare >= 3
                ? "translate(0, -50%)"
                : "translate(0, -100%)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 px-4 mx-auto">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: textVisible ? 1 : 0,
            y: textVisible ? 0 : 20,
          }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 md:mb-8 leading-tight tracking-tight">
            Empower Your Teaching
            <br />
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              One Block at a Time
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto text-balance">
            Design, structure, and deliver interactive lessons effortlessly
            using our block-based learning platform built for modern educators.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#features" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="google-button w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl
                  elevation-2 hover:elevation-3 transform hover:scale-105 motion-standard"
              >
                Learn More
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/register" passHref>
              <Button
                size="lg"
                className="google-button-primary w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 text-lg sm:text-xl
                  elevation-2 hover:elevation-3 transform hover:scale-105 motion-standard"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator with semantic theming */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: textVisible ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <div className="text-muted-foreground text-sm mb-2">
            Scroll to explore
          </div>
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-muted-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AnimatedHero;
