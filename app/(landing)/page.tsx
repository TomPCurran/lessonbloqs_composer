// app/(landing)/page.tsx - Landing Page Full-Screen Fix
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AnimatedHero from "@/components/landingPage/hero";
import { LessonbloqsLogo } from "@/components/landingPage/LessonbloqsLogo";
import StatsSections from "@/components/landingPage/StatsSection";
import FeaturesSection from "@/components/landingPage/FeatureSection";
import Footer from "@/components/landingPage/Footer";
import PricingSection from "@/components/landingPage/PricingSection";
import ContactForm from "@/components/landingPage/ContactForm";
import ValuesAgencySection from "@/components/landingPage/ValuesAgencySection";
import ValuesCollaborationSection from "@/components/landingPage/ValuesCollaborationSection";
import ValuesEngagementSection from "@/components/landingPage/ValuesEngagementSection";
import MissionStatement from "@/components/landingPage/MissionStatement";
// import { ZustandTest } from "@/components/ui/zustand-test";
// import { ZustandEnterpriseTest } from "@/components/ui/zustand-enterprise-test";

const LandingPage = () => {
  const [showNav, setShowNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNav(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    // Override layout container constraints for full-screen experience
    <div className="fixed inset-0 overflow-auto bg-background">
      {/* Zustand Test Components - Remove these after testing */}
      <div className="absolute top-4 left-4 z-50">{/* <ZustandTest /> */}</div>
      <div className="absolute top-4 right-4 z-50">
        {/* <ZustandEnterpriseTest /> */}
      </div>
      <nav
        className={`${
          showNav ? "fixed" : "absolute"
        } top-0 z-50 w-full transition-all duration-300 motion-standard ${
          showNav
            ? "bg-background/90 backdrop-blur-md border-b border-border elevation-1"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LessonbloqsLogo />
            <span className="text-xl font-semibold text-foreground">
              Lessonbloqs
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors motion-standard"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors motion-standard"
            >
              Pricing
            </a>
            <a
              href="/aboutus"
              className="text-muted-foreground hover:text-foreground transition-colors motion-standard"
            >
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="google-button hover:bg-muted">
              <Link href="/sign-in">Log In</Link>
            </Button>
            <Button className="google-button-primary elevation-1 hover:elevation-2">
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors motion-standard"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border py-4 px-4 space-y-4 elevation-2">
            <a
              href="#features"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors motion-standard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors motion-standard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="/aboutus"
              className="block py-2 text-muted-foreground hover:text-foreground transition-colors motion-standard"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <div className="flex flex-col space-y-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                className="google-button justify-center hover:bg-muted"
              >
                <Link href="/sign-in">Log In</Link>
              </Button>
              <Button className="google-button-primary justify-center">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>

      <div ref={heroRef}>
        <AnimatedHero />
      </div>

      <main>
        <MissionStatement />
        <ValuesAgencySection />
        <ValuesCollaborationSection />
        <ValuesEngagementSection />
        <FeaturesSection />
        <StatsSections />
        <PricingSection />
        <ContactForm />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
