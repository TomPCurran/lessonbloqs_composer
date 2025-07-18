// components/landingPage/ValuesAgencySection.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";

const ValuesAgencySection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 } // Increase threshold to ensure more of section is visible
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
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* SVG Illustration - Left side on desktop, top on mobile */}
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
                    .lightbulb {
                      opacity: 0;
                      transform-origin: center;
                      transition: opacity 0.8s cubic-bezier(0.2, 0, 0, 1);
                      transition-delay: 0.5s;
                    }
                    
                    .ray {
                      opacity: 0;
                      transform-origin: center;
                      transition: opacity 0.8s cubic-bezier(0.2, 0, 0, 1);
                      transition-delay: 0.8s;
                    }
                    
                    .idea-group {
                      transform-origin: center;
                    }
                    
                    .container.in-view .lightbulb,
                    .container.in-view .ray {
                      opacity: 1;
                    }
                    
                    .container.in-view .idea-group {
                      animation: floatUpDown 3s infinite cubic-bezier(0.4, 0, 0.6, 1);
                    }
                    
                    .container.in-view .teacher-head {
                      animation: headBounce 1.5s cubic-bezier(0.2, 0, 0, 1);
                    }
                    
                    @keyframes floatUpDown {
                      0% { transform: translateY(0); }
                      50% { transform: translateY(-8px); }
                      100% { transform: translateY(0); }
                    }
                    
                    @keyframes headBounce {
                      0% { transform: translateY(0); }
                      25% { transform: translateY(-10px); }
                      50% { transform: translateY(0); }
                      75% { transform: translateY(-5px); }
                      100% { transform: translateY(0); }
                    }
                  `}
                </style>

                {/* Main Container */}
                <g className={`container ${isInView ? "in-view" : ""}`}>
                  {/* Background Square with rounded corners - Using semantic primary */}
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    rx="30"
                    fill="hsl(var(--primary))"
                    opacity="0.9"
                  />

                  {/* Teacher Body (Shoulders) - Using semantic secondary */}
                  <rect
                    x="50"
                    y="140"
                    width="100"
                    height="30"
                    rx="15"
                    fill="hsl(var(--secondary))"
                    opacity="0.9"
                    className="teacher-body"
                  />

                  {/* Teacher Head - Using semantic accent */}
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    fill="hsl(var(--accent))"
                    opacity="0.9"
                    className="teacher-head"
                  />

                  {/* Group for lightbulb and rays that move together */}
                  <g className="idea-group">
                    {/* Idea Elements - Using theme-aware warning color */}
                    <g className="lightbulb">
                      <path
                        d="M92 40 C92 33 108 33 108 40 C108 47 103 50 103 54 L97 54 C97 50 92 47 92 40Z"
                        fill="hsl(var(--warning))"
                      />
                      <rect
                        x="97"
                        y="54"
                        width="6"
                        height="2"
                        fill="hsl(var(--warning))"
                      />
                      <rect
                        x="97.5"
                        y="56"
                        width="5"
                        height="1.5"
                        fill="hsl(var(--muted-foreground))"
                      />
                      <rect
                        x="98"
                        y="57.5"
                        width="4"
                        height="1.5"
                        fill="hsl(var(--muted-foreground))"
                      />
                    </g>

                    {/* Rays around the lightbulb - Using theme-aware warning color */}
                    <g className="ray">
                      <line
                        x1="77"
                        y1="43"
                        x2="67"
                        y2="38"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="85"
                        y1="32"
                        x2="77"
                        y2="23"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="100"
                        y1="28"
                        x2="100"
                        y2="18"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="115"
                        y1="32"
                        x2="123"
                        y2="23"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="123"
                        y1="43"
                        x2="133"
                        y2="38"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="92"
                        y1="30"
                        x2="87"
                        y2="20"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <line
                        x1="108"
                        y1="30"
                        x2="113"
                        y2="20"
                        stroke="hsl(var(--warning))"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Content - Right side on desktop, bottom on mobile */}
          <div className="w-full lg:w-1/2">
            <div
              className={`transition-all duration-1000 delay-300 motion-decelerate ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-primary bg-primary-subtle rounded-full">
                Empower
              </span>

              <h2 className="text-display-large font-normal text-foreground mb-6">
                Empower Your Teaching Journey
              </h2>

              <p className="text-body-large text-muted-foreground mb-8 leading-relaxed text-pretty">
                Transform your teaching experience with our innovative lesson
                planning platform. Create engaging, standards-aligned lessons
                that inspire both you and your students.
              </p>

              <div className="space-y-4">
                {[
                  "Streamlined lesson planning process",
                  "Standards-aligned content creation",
                  "Collaborative teaching resources",
                  "Time-saving templates and tools",
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
                      className="h-6 w-5 flex-none text-primary"
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

      {/* Decorative background elements - Using semantic colors */}
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/5 rounded-full transition-colors duration-300" />
    </section>
  );
};

export default ValuesAgencySection;
