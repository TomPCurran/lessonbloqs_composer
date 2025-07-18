// components/landingPage/MissionStatement.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const MissionStatement = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Set up intersection observer to detect when component enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 } // Trigger when 30% of the element is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Values data with semantic color mapping
  const values = [
    {
      title: "Innovation",
      description:
        "We continuously evolve our platform to meet the changing needs of modern education.",
      color: "secondary" as const,
      delay: 0.1,
    },
    {
      title: "Collaboration",
      description:
        "We foster a community where educators can share, learn, and grow together.",
      color: "primary" as const,
      delay: 0.2,
    },
    {
      title: "Impact",
      description:
        "We measure our success by the positive change we bring to classrooms worldwide.",
      color: "accent" as const,
      delay: 0.3,
    },
  ];

  return (
    <section
      id="mission"
      className="py-20 md:py-28 bg-background relative overflow-hidden transition-colors duration-300"
      ref={sectionRef}
    >
      {/* Background decoration with semantic colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full transform translate-x-1/3 translate-y-1/3 transition-colors duration-300" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-secondary bg-secondary-subtle rounded-full">
              Our Mission
            </span>

            <h2 className="text-display-large font-normal tracking-tight text-foreground mb-8">
              Transforming Education Through Innovation
            </h2>

            <div className="max-w-3xl mx-auto">
              <blockquote className="text-lg md:text-xl italic font-medium mb-8 text-muted-foreground relative">
                <span className="text-4xl text-secondary/40 absolute -top-4 -left-4 font-serif">
                  "
                </span>
                To empower educators with innovative tools that transform the
                way they create, share, and deliver exceptional learning
                experiences.
                <span className="text-4xl text-secondary/40 absolute -bottom-4 -right-4 font-serif">
                  "
                </span>
              </blockquote>

              <p className="text-base md:text-lg text-muted-foreground mb-12 leading-relaxed text-pretty">
                At Lessonbloqs, we believe that every educator deserves
                powerful, intuitive tools that enhance their teaching practice.
                Our platform bridges the gap between traditional lesson planning
                and modern educational technology, enabling teachers to focus on
                what matters most - inspiring their students.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`google-card p-6 md:p-8 group cursor-pointer hover:elevation-3
                  transform transition-all duration-700 motion-standard
                  ${
                    value.color === "primary"
                      ? "bg-primary/5 border-primary/20"
                      : value.color === "secondary"
                      ? "bg-secondary/5 border-secondary/20"
                      : "bg-accent/5 border-accent/20"
                  }`}
                style={{ transitionDelay: `${index * 150 + 400}ms` }}
              >
                <div className="mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 motion-standard
                      ${
                        value.color === "primary"
                          ? "bg-primary-subtle"
                          : value.color === "secondary"
                          ? "bg-secondary-subtle"
                          : "bg-accent-subtle"
                      }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full
                        ${
                          value.color === "primary"
                            ? "bg-primary"
                            : value.color === "secondary"
                            ? "bg-secondary"
                            : "bg-accent"
                        }`}
                    />
                  </div>
                </div>

                <h3
                  className={`text-headline-large font-medium mb-3
                    ${
                      value.color === "primary"
                        ? "text-primary"
                        : value.color === "secondary"
                        ? "text-secondary"
                        : "text-accent"
                    }`}
                >
                  {value.title}
                </h3>
                <p className="text-body-medium text-muted-foreground leading-relaxed">
                  {value.description}
                </p>

                {/* Subtle hover indicator */}
                <div
                  className={`mt-4 w-0 h-0.5 transition-all duration-300 motion-standard
                    group-hover:w-16
                    ${
                      value.color === "primary"
                        ? "bg-primary"
                        : value.color === "secondary"
                        ? "bg-secondary"
                        : "bg-accent"
                    }`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Additional CTA section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: isInView ? 1 : 0,
              y: isInView ? 0 : 20,
            }}
            transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
          >
            <p className="text-body-large text-muted-foreground mb-6">
              Join thousands of educators who are already transforming their
              teaching
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="google-button-primary px-8 py-3 text-base font-medium elevation-2 hover:elevation-3">
                Start Your Journey
              </button>
              <button className="google-button-secondary px-8 py-3 text-base font-medium">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MissionStatement;
