// components/landingPage/ValuesCollaborationSection.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";

const ValuesCollaborationSection = () => {
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
      <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full translate-x-1/2 -translate-y-1/4 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full -translate-x-1/3 translate-y-1/3 transition-colors duration-300" />

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
                    /* Speech bubble animation */
                    @keyframes appear {
                      0% { 
                        opacity: 0; 
                        transform: scale(0.5); 
                      }
                      100% { 
                        opacity: 1; 
                        transform: scale(1); 
                      }
                    }
                    
                    /* Dots moving side to side together */
                    @keyframes moveDots {
                      0% { transform: translateX(0); }
                      50% { transform: translateX(10px); }
                      100% { transform: translateX(0); }
                    }
                    
                    .speech-bubble {
                      opacity: 0;
                      transform-origin: center;
                    }
                    
                    .container.in-view .speech-bubble {
                      animation: appear 0.8s forwards cubic-bezier(0.2, 0, 0, 1);
                      animation-delay: 0.6s;
                    }
                    
                    .container.in-view .dots-group {
                      animation: moveDots 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
                      animation-delay: 1.4s;
                    }
                  `}
                </style>

                {/* Main Container */}
                <g className={`container ${isInView ? "in-view" : ""}`}>
                  {/* Background Square - Using semantic secondary */}
                  <rect
                    x="20"
                    y="20"
                    width="160"
                    height="160"
                    rx="30"
                    fill="hsl(var(--secondary))"
                    opacity="0.9"
                  />

                  {/* Teacher Body (Shoulders) - Using semantic accent */}
                  <rect
                    x="50"
                    y="140"
                    width="100"
                    height="30"
                    rx="15"
                    fill="hsl(var(--accent))"
                    opacity="0.9"
                  />

                  {/* Teacher Head - Using semantic primary */}
                  <circle
                    cx="100"
                    cy="100"
                    r="35"
                    fill="hsl(var(--primary))"
                    opacity="0.9"
                  />

                  {/* Speech Bubble (appears on scroll) */}
                  <g className="speech-bubble">
                    {/* Rectangle part of speech bubble - Using semantic accent */}
                    <rect
                      x="130"
                      y="40"
                      width="60"
                      height="40"
                      rx="10"
                      fill="hsl(var(--accent))"
                      opacity="0.9"
                    />

                    {/* Simple triangle pointer at bottom */}
                    <polygon
                      points="145,80 155,95 165,80"
                      fill="hsl(var(--accent))"
                      opacity="0.9"
                    />

                    {/* Three dots to show communication - grouped for animation */}
                    <g className="dots-group">
                      <circle
                        cx="145"
                        cy="60"
                        r="4"
                        fill="hsl(var(--primary))"
                        opacity="0.9"
                      />
                      <circle
                        cx="155"
                        cy="60"
                        r="4"
                        fill="hsl(var(--primary))"
                        opacity="0.9"
                      />
                      <circle
                        cx="165"
                        cy="60"
                        r="4"
                        fill="hsl(var(--primary))"
                        opacity="0.9"
                      />
                    </g>
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
              <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-secondary bg-secondary-subtle rounded-full">
                Collaborate
              </span>

              <h2 className="text-display-large font-normal text-foreground mb-6">
                Collaborate and Share Knowledge
              </h2>

              <p className="text-body-large text-muted-foreground mb-8 leading-relaxed text-pretty">
                Join a community of educators who share your passion for
                teaching. Create, share, and collaborate on lesson plans that
                make a difference in students' lives.
              </p>

              <div className="space-y-4">
                {[
                  "Connect with fellow educators",
                  "Share and discover teaching resources",
                  "Get feedback and suggestions",
                  "Build on others' success",
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
                      className="h-6 w-5 flex-none text-secondary"
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

export default ValuesCollaborationSection;
