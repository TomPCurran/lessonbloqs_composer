// components/landingPage/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Footer navigation structure with semantic color assignments
  const footerSections = [
    {
      title: "Product",
      color: "primary" as const,
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Use Cases", href: "/use-cases" },
        { name: "Roadmap", href: "/roadmap" },
        { name: "What's New", href: "/updates" },
      ],
    },
    {
      title: "Resources",
      color: "secondary" as const,
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Documentation", href: "/docs" },
        { name: "Webinars", href: "/webinars" },
        { name: "Community", href: "/community" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Company",
      color: "accent" as const,
      links: [
        { name: "About", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "#contact" },
        { name: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Legal",
      color: "muted-foreground" as const,
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Security", href: "/security" },
        { name: "GDPR Compliance", href: "/gdpr" },
      ],
    },
  ];

  // Social media links with semantic color mapping
  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/lessonbloqs",
      icon: TwitterIcon,
      color: "primary" as const,
    },
    {
      name: "Facebook",
      href: "https://facebook.com/lessonbloqs",
      icon: FacebookIcon,
      color: "secondary" as const,
    },
    {
      name: "Instagram",
      href: "https://instagram.com/lessonbloqs",
      icon: InstagramIcon,
      color: "accent" as const,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/lessonbloqs",
      icon: LinkedinIcon,
      color: "primary" as const,
    },
  ];

  return (
    <footer className="bg-muted border-t border-border transition-colors duration-300">
      {/* Main footer content */}
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-10">
          {/* Brand section with logo */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300 motion-standard"
              >
                <rect
                  x="4"
                  y="16"
                  width="10"
                  height="10"
                  rx="2"
                  fill="hsl(var(--primary))"
                  opacity="0.9"
                />
                <rect
                  x="11"
                  y="11"
                  width="10"
                  height="10"
                  rx="2"
                  fill="hsl(var(--secondary))"
                  opacity="0.9"
                />
                <rect
                  x="18"
                  y="6"
                  width="10"
                  height="10"
                  rx="2"
                  fill="hsl(var(--accent))"
                  opacity="0.9"
                />
                <path
                  d="M14 21 L18 16"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
                <path
                  d="M21 16 L25 11"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="1.5"
                  opacity="0.3"
                />
              </svg>
              <span className="text-headline-large font-semibold text-foreground">
                Lessonbloqs
              </span>
            </div>
            <p className="text-body-medium text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Transforming education through innovative block-based lesson
              planning tools for modern educators.
            </p>

            {/* Social media links */}
            <div className="flex space-x-4 mb-6 md:mb-0">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 flex items-center justify-center rounded-full google-card
                    hover:elevation-2 transition-all duration-300 motion-standard
                    hover:scale-110 group
                    ${
                      social.color === "primary"
                        ? "hover:bg-primary-subtle hover:text-primary"
                        : social.color === "secondary"
                        ? "hover:bg-secondary-subtle hover:text-secondary"
                        : "hover:bg-accent-subtle hover:text-accent"
                    }`}
                  aria-label={social.name}
                >
                  <social.icon
                    size={18}
                    className="transition-colors duration-300"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation link columns */}
          {footerSections.map((section, index) => (
            <div key={index} className="md:col-span-1">
              <h3
                className={`text-headline-medium font-semibold mb-4 
                  ${
                    section.color === "primary"
                      ? "text-primary"
                      : section.color === "secondary"
                      ? "text-secondary"
                      : section.color === "accent"
                      ? "text-accent"
                      : "text-foreground"
                  }`}
              >
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-all duration-200 motion-standard 
                        flex items-center group text-body-medium"
                    >
                      <ChevronRight
                        size={14}
                        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 
                          transition-all duration-200 motion-standard text-muted-foreground"
                      />
                      <span className="group-hover:translate-x-1 transition-transform duration-200 motion-standard">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-footer with copyright and additional links */}
      <div className="border-t border-border py-6 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-body-small text-muted-foreground mb-4 md:mb-0">
            © {currentYear} Lessonbloqs, Inc. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { name: "Accessibility", href: "/accessibility" },
              { name: "Sitemap", href: "/sitemap" },
              { name: "Cookie Settings", href: "/cookies" },
            ].map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-body-small text-muted-foreground hover:text-secondary 
                  transition-colors duration-200 motion-standard underline-offset-2 hover:underline"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center">
              <span className="text-body-small text-muted-foreground mr-2">
                Made with
              </span>
              <span className="text-destructive animate-pulse mr-2">❤️</span>
              <span className="text-body-small text-muted-foreground">
                for educators
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground 
            elevation-3 hover:elevation-4 transition-all duration-300 motion-standard
            hover:scale-110 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ChevronRight
            size={20}
            className="rotate-[-90deg] group-hover:rotate-[-90deg] group-hover:scale-110 
              transition-transform duration-300 motion-standard"
          />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
