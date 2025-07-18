// components/landingPage/FeaturesSection.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import { Zap, BookOpen, Users, BarChart3, Globe, Lock } from "lucide-react";

const FeaturesSection = () => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Features data array for easy management with semantic color mapping
  const features = [
    {
      icon: Zap,
      color: "primary" as const,
      title: "Quick and Intuitive",
      description:
        "Build engaging lessons in minutes with our drag-and-drop interface and pre-made educational blocks.",
    },
    {
      icon: BookOpen,
      color: "secondary" as const,
      title: "Content Standards Alignment",
      description:
        "Automatically align your lessons with federal, state, and grade-level educational standards.",
    },
    {
      icon: Users,
      color: "accent" as const,
      title: "Collaborative Teaching",
      description:
        "Share and collaborate on lessons with other educators in real-time to improve educational outcomes.",
    },
    {
      icon: BarChart3,
      color: "primary" as const,
      title: "Advanced Analytics",
      description:
        "Track student progress and gain insights with our powerful assessment monitoring and analytics tools.",
    },
    {
      icon: Globe,
      color: "secondary" as const,
      title: "Seamless Integration",
      description:
        "Integrate directly with Google Classroom and other platforms you already use in your teaching practice.",
    },
    {
      icon: Lock,
      color: "accent" as const,
      title: "Enterprise Security",
      description:
        "Rest easy knowing your data is protected by industry-leading security infrastructure and protocols.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 md:py-32 bg-muted relative overflow-hidden transition-colors duration-300"
      ref={sectionRef}
    >
      {/* Decorative background shapes - Using semantic colors */}
      <div
        className={`absolute w-[600px] h-[600px] bg-primary/10 rounded-[100px] transition-all duration-1000 motion-decelerate`}
        style={{
          left: "-300px",
          top: "50%",
          transform: isInView
            ? "translate(20%, -50%)"
            : "translate(-20%, -50%)",
        }}
      />

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <div
          className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-700 motion-decelerate ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-primary bg-primary-subtle rounded-full">
            Features
          </span>
          <h2 className="text-display-large font-normal text-foreground mb-5">
            Why Choose Lessonbloqs?
          </h2>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto text-pretty">
            Our platform combines powerful features with an intuitive interface
            to transform how you plan, create, and deliver lessons.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`google-card p-6 md:p-8 group cursor-pointer hover:elevation-3 
                transform transition-all duration-500 motion-standard
                ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-20"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-5 
                  group-hover:scale-110 transition-transform duration-300 motion-standard
                  ${
                    feature.color === "primary"
                      ? "bg-primary-subtle text-primary"
                      : feature.color === "secondary"
                      ? "bg-secondary-subtle text-secondary"
                      : "bg-accent-subtle text-accent"
                  }`}
              >
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="text-headline-large font-medium mb-3 text-foreground">
                {feature.title}
              </h3>

              <p className="text-body-medium text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Subtle hover indicator */}
              <div
                className={`mt-4 w-0 h-0.5 transition-all duration-300 motion-standard
                  group-hover:w-12
                  ${
                    feature.color === "primary"
                      ? "bg-primary"
                      : feature.color === "secondary"
                      ? "bg-secondary"
                      : "bg-accent"
                  }`}
              />
            </div>
          ))}
        </div>

        {/* Call-to-action section */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-700 motion-decelerate ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="text-body-large text-muted-foreground mb-6">
            Ready to transform your teaching experience?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="google-button-primary px-8 py-3 text-base font-medium elevation-2 hover:elevation-3">
              Start Free Trial
            </button>
            <button className="google-button-secondary px-8 py-3 text-base font-medium">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
