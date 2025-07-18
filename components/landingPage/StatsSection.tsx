// components/landingPage/StatsSection.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
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

  // Process steps data with semantic color mapping
  const steps = [
    {
      step: "1",
      title: "Choose Your Blocks",
      description:
        "Select from our library of pre-made educational blocks or create your own custom content. Each block can be tailored to specific learning standards.",
      icon: "📚",
      color: "primary" as const,
    },
    {
      step: "2",
      title: "Customize & Arrange",
      description:
        "Drag and drop blocks to build your perfect lesson flow. Customize content to match your teaching style and student needs.",
      icon: "🔄",
      color: "secondary" as const,
    },
    {
      step: "3",
      title: "Share & Collaborate",
      description:
        "Share lessons with students or collaborate with other teachers to create the best content. Track performance and gather feedback.",
      icon: "👥",
      color: "accent" as const,
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 md:py-32 bg-muted relative overflow-hidden transition-colors duration-300"
    >
      {/* Decorative Background Element - Using semantic colors */}
      <div
        className={`absolute w-[600px] h-[600px] bg-secondary/10 rounded-[100px] transition-all duration-1000 motion-decelerate`}
        style={{
          right: "-300px",
          top: "50%",
          transform: isInView
            ? "translate(-20%, -50%)"
            : "translate(20%, -50%)",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div
          className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-700 motion-decelerate ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-secondary bg-secondary-subtle rounded-full">
            How It Works
          </span>
          <h2 className="text-display-large font-normal text-foreground mb-5">
            Create Engaging Lessons in Three Simple Steps
          </h2>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our intuitive platform makes lesson planning effortless, allowing
            you to focus on what matters most - teaching.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {steps.map((item, index) => (
            <div
              key={index}
              className={`relative google-card p-8 group cursor-pointer hover:elevation-3
                transform transition-all duration-700 motion-standard ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Step number with theme-aware styling */}
              <div
                className={`absolute -top-4 left-8 w-8 h-8 rounded-full flex items-center justify-center 
                  font-bold text-sm transition-all duration-300 motion-standard
                  ${
                    item.color === "primary"
                      ? "bg-primary text-primary-foreground"
                      : item.color === "secondary"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
              >
                {item.step}
              </div>

              {/* Step content */}
              <div className="pt-6">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 motion-standard">
                  {item.icon}
                </div>
                <h3 className="text-headline-large font-medium mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-body-medium text-muted-foreground mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Subtle step indicator */}
                <div
                  className={`w-0 h-0.5 transition-all duration-300 motion-standard
                    group-hover:w-16
                    ${
                      item.color === "primary"
                        ? "bg-primary"
                        : item.color === "secondary"
                        ? "bg-secondary"
                        : "bg-accent"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-700 motion-decelerate ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Link href="/register">
            <Button
              size="lg"
              className="google-button-primary px-8 py-6 text-lg font-medium elevation-2 hover:elevation-3 
                transform hover:scale-105 motion-standard"
            >
              Start Creating Your Lessons
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-body-medium text-muted-foreground">
            No credit card required to get started
          </p>
        </div>

        {/* Additional stats or metrics section */}
        <div
          className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1000 motion-decelerate ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {[
            {
              number: "10K+",
              label: "Active Educators",
              color: "primary" as const,
            },
            {
              number: "50K+",
              label: "Lessons Created",
              color: "secondary" as const,
            },
            {
              number: "95%",
              label: "Teacher Satisfaction",
              color: "accent" as const,
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center group"
              style={{ transitionDelay: `${index * 100 + 1200}ms` }}
            >
              <div
                className={`text-4xl md:text-5xl font-bold mb-2 transition-colors duration-300
                  ${
                    stat.color === "primary"
                      ? "text-primary"
                      : stat.color === "secondary"
                      ? "text-secondary"
                      : "text-accent"
                  }`}
              >
                {stat.number}
              </div>
              <div className="text-body-large text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
