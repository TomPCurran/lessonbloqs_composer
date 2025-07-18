// components/landingPage/ValuesEngagementSection.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";

const ValuesEngagementSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 }
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

  return (
    <section
      className="py-20 md:py-32 bg-background relative overflow-hidden transition-colors duration-300"
      ref={sectionRef}
    >
      {/* Decorative background elements - Using semantic colors */}
      <div className="absolute top-1/3 left-0 w-32 h-32 bg-accent/5 rounded-full -translate-x-1/2 transition-colors duration-300" />
      <div className="absolute -bottom-16 right-1/4 w-56 h-56 bg-primary/5 rounded-full transition-colors duration-300" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* SVG Illustration - Left side */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div
              className={`w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] transition-all duration-1000 motion-decelerate ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="w-full h-full"
              >
                <style>
                  {`
                    /* Animation keyframes */
                    @keyframes raiseShoulderWithHead {
                      0% { transform: translateY(0) rotate(0deg); }
                      50% { transform: translateY(-4px) rotate(3deg); }
                      100% { transform: translateY(0) rotate(0deg); }
                    }
                    
                    @keyframes subtleHandWave {
                      0% { transform: rotate(0deg); }
                      50% { transform: rotate(-5deg); }
                      100% { transform: rotate(0deg); }
                    }
                    
                    /* Hand is invisible by default */
                    .hand {
                      opacity: 0;
                      transition: opacity 0.8s cubic-bezier(0.2, 0, 0, 1);
                      transition-delay: 1s;
                    }
                    
                    /* Group animation for head and shoulder to move together */
                    .container.in-view .animated-group {
                      animation: raiseShoulderWithHead 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                      animation-delay: 0.5s;
                      transform-origin: bottom left;
                    }
                    
                    /* Make hand visible and animate it on scroll into view */
                    .container.in-view .hand {
                      opacity: 1;
                      animation: subtleHandWave 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                      animation-delay: 0.5s;
                      transform-origin: bottom center;
                    }
                  `}
                </style>

                {/* Main Container */}
                <g className={`container ${isInView ? "in-view" : ""}`}>
                  {/* Background Square - Using semantic accent (green) */}
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    rx="30"
                    fill="hsl(var(--accent))"
                    opacity="0.9"
                  />

                  {/* Grouped elements that move together */}
                  <g className="animated-group">
                    {/* Teacher Body (Shoulders) - Using semantic primary */}
                    <rect
                      x="50"
                      y="140"
                      width="100"
                      height="30"
                      rx="15"
                      fill="hsl(var(--primary))"
                      opacity="0.9"
                    />

                    {/* Teacher Head - Using semantic secondary */}
                    <circle
                      cx="100"
                      cy="100"
                      r="35"
                      fill="hsl(var(--secondary))"
                      opacity="0.9"
                    />

                    {/* Hand - only appears on scroll into view, using semantic secondary */}
                    <circle
                      cx="160"
                      cy="100"
                      r="10"
                      fill="hsl(var(--secondary))"
                      opacity="0.9"
                      className="hand"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Content - Right side */}
          <div className="w-full lg:w-1/2">
            <div
              className={`transition-all duration-1000 delay-300 motion-decelerate ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-accent bg-accent-subtle rounded-full">
                Engage
              </span>

              <h2 className="text-display-large font-normal text-foreground mb-6">
                Engage Your Students
              </h2>

              <p className="text-body-large text-muted-foreground mb-8 leading-relaxed text-pretty">
                Create interactive and engaging lessons that capture your
                students' attention. Our platform helps you design experiences
                that make learning both fun and effective.
              </p>

              <div className="space-y-4">
                {[
                  "Interactive lesson components",
                  "Student-centered activities",
                  "Engaging multimedia integration",
                  "Real-world application focus",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`flex gap-x-3 items-center transition-all duration-700 motion-standard ${
                      isInView
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 translate-x-10"
                    }`}
                    style={{ transitionDelay: `${index * 150 + 500}ms` }}
                  >
                    <svg
                      className="h-6 w-5 flex-none text-accent"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesEngagementSection;
