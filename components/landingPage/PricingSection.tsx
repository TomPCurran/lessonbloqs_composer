// components/landingPage/PricingSection.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { Check, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
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

  // Pricing plans data with semantic color mapping
  const plans = [
    {
      name: "Free",
      price: annualBilling ? "$0" : "$0",
      period: "/forever",
      description: "Perfect for trying out Lessonbloqs",
      features: [
        "Up to 5 lessons",
        "Basic educational blocks",
        "Limited sharing options",
        "Community forum support",
        "Google Classroom integration",
      ],
      icon: Zap,
      iconColor: "muted-foreground" as const,
      buttonText: "Get Started Free",
      buttonVariant: "secondary" as const,
      popular: false,
    },
    {
      name: "Teacher Pro",
      price: annualBilling ? "$99" : "$12",
      period: annualBilling ? "/year" : "/month",
      discount: annualBilling ? "Save $45" : null,
      popular: true,
      description: "Everything you need for full-time teaching",
      features: [
        "Unlimited lessons",
        "All premium blocks",
        "Unlimited sharing",
        "Priority email support",
        "Advanced analytics dashboard",
        "Custom branding options",
        "Standards alignment tools",
        "Advanced assessment features",
      ],
      icon: Shield,
      iconColor: "secondary" as const,
      buttonText: "Get Teacher Pro",
      buttonVariant: "default" as const,
    },
    {
      name: "School & District",
      price: "Custom",
      description: "Perfect for entire departments or schools",
      features: [
        "All Teacher Pro features",
        "Team collaboration tools",
        "Admin control panel",
        "API access and integrations",
        "Dedicated account manager",
        "Custom implementation support",
        "Professional development",
        "Data security compliance",
      ],
      icon: Users,
      iconColor: "primary" as const,
      buttonText: "Contact Sales",
      buttonVariant: "secondary" as const,
      popular: false,
    },
  ];

  return (
    <section
      className="py-20 md:py-32 bg-background overflow-hidden transition-colors duration-300"
      id="pricing"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`text-center mb-16 transform transition-all duration-700 motion-decelerate ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-primary bg-primary-subtle rounded-full">
            Pricing
          </span>
          <h2 className="text-display-large font-normal text-foreground mb-5">
            Simple, Transparent Pricing
          </h2>
          <p className="text-body-large text-muted-foreground max-w-3xl mx-auto mb-10 text-pretty">
            Start for free, upgrade when you're ready. No hidden fees or
            complicated pricing structures.
          </p>

          {/* Billing toggle with semantic theming */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <span
              className={`text-body-medium transition-colors duration-200 ${
                !annualBilling
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 motion-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              style={{
                backgroundColor: annualBilling
                  ? "hsl(var(--secondary))"
                  : "hsl(var(--muted))",
              }}
              role="switch"
              aria-checked={annualBilling}
            >
              <span
                className={`${
                  annualBilling
                    ? "translate-x-6 bg-secondary-foreground"
                    : "translate-x-1 bg-background"
                } inline-block h-4 w-4 transform rounded-full transition-transform duration-200 motion-standard elevation-1`}
              />
            </button>
            <span
              className={`text-body-medium transition-colors duration-200 ${
                annualBilling
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              Annual{" "}
              <span className="text-secondary font-medium">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`google-card relative group cursor-pointer hover:elevation-4
                transform transition-all duration-700 motion-standard ${
                  plan.popular
                    ? "ring-2 ring-secondary/20 elevation-3"
                    : "elevation-2"
                } ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-20 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-label-medium font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-headline-large font-medium text-foreground mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-1">
                      <span className="text-4xl font-bold text-foreground">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground ml-1">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    {plan.discount && (
                      <span className="inline-block bg-success/10 text-success text-label-small px-2 py-1 rounded font-medium">
                        {plan.discount}
                      </span>
                    )}
                  </div>

                  <div
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      plan.iconColor === "primary"
                        ? "bg-primary-subtle"
                        : plan.iconColor === "secondary"
                        ? "bg-secondary-subtle"
                        : "bg-muted"
                    }`}
                  >
                    <plan.icon
                      className={`h-5 w-5 ${
                        plan.iconColor === "primary"
                          ? "text-primary"
                          : plan.iconColor === "secondary"
                          ? "text-secondary"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                </div>

                <p className="text-body-medium text-muted-foreground mb-6">
                  {plan.description}
                </p>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full mb-6 py-6 text-base font-medium transition-all duration-200 motion-standard ${
                    plan.buttonVariant === "default"
                      ? "google-button-primary elevation-2 hover:elevation-3"
                      : "google-button-secondary"
                  }`}
                >
                  <Link
                    href={
                      plan.name === "School & District"
                        ? "/contact"
                        : "/register"
                    }
                  >
                    {plan.buttonText}
                  </Link>
                </Button>

                <div>
                  <p className="font-medium text-label-large text-foreground mb-4">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3 transform transition-all motion-standard"
                        style={{
                          transitionDelay: `${
                            index * 100 + featureIndex * 50 + 400
                          }ms`,
                          opacity: isVisible ? 1 : 0,
                          transform: isVisible
                            ? "translateX(0)"
                            : "translateX(-10px)",
                        }}
                      >
                        <Check className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-body-small text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div
          className={`mt-16 text-center max-w-3xl mx-auto bg-muted p-8 rounded-2xl transition-all duration-1000 motion-decelerate ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <h3 className="text-headline-large font-medium mb-3 text-foreground">
            Need a custom solution?
          </h3>
          <p className="text-body-medium text-muted-foreground mb-6">
            We offer tailored packages for educational institutions with
            specific requirements. Contact our team to discuss your needs.
          </p>
          <Button
            variant="secondary"
            className="google-button-secondary border-primary text-primary hover:bg-primary/5"
          >
            <Link href="/contact">Contact Sales Team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
