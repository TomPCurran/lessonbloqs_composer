// components/landingPage/ContactForm.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFormStore } from "@/lib/stores/formStore";

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Use Zustand form store
  const {
    contactForm,
    updateContactForm,
    setContactFormErrors,
    setContactFormSubmitting,
    setContactFormSuccess,
    validateContactForm,
  } = useFormStore();

  // Track visibility for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateContactForm();
    setContactFormErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setContactFormSubmitting(true);
      try {
        // Simulate API call - replace with actual API endpoint in production
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setContactFormSuccess(true);
        // Reset form after successful submission
        setTimeout(() => setContactFormSuccess(false), 3000);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
      setContactFormSubmitting(false);
    }
  };

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    updateContactForm(name, value);
  };

  // Contact information cards with semantic colors
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "hello@lessonbloqs.com",
      delay: 100,
      color: "primary" as const,
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+1 (555) 123-4567",
      delay: 200,
      color: "secondary" as const,
    },
    {
      icon: MapPin,
      title: "Office",
      details: "123 Education Street, Learning City",
      delay: 300,
      color: "accent" as const,
    },
  ];

  // Role options for radio buttons
  const roleOptions = [
    { value: "teacher", label: "Teacher" },
    { value: "administrator", label: "School Administrator" },
    { value: "district", label: "District Personnel" },
    { value: "other", label: "Other" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 md:py-32 bg-background relative overflow-hidden transition-colors duration-300"
    >
      {/* Background decoration with semantic colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full transition-colors duration-300" />
        <div className="absolute top-1/2 -right-12 w-24 h-24 bg-primary/5 rounded-full transition-colors duration-300" />
        <div className="absolute -bottom-12 left-1/3 w-32 h-32 bg-accent/5 rounded-full transition-colors duration-300" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div
            className={`text-center mb-16 transform transition-all duration-700 motion-decelerate ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <span className="inline-block px-4 py-1 mb-3 text-label-medium font-medium text-secondary bg-secondary-subtle rounded-full">
              Contact Us
            </span>
            <h2 className="text-display-large font-normal text-foreground mb-5">
              Get in Touch
            </h2>
            <p className="text-body-large text-muted-foreground max-w-3xl mx-auto text-pretty">
              Have questions about Lessonbloqs? Our team is here to help you
              transform your teaching experience.
            </p>
          </div>

          {/* Contact info cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`text-center google-card p-6 group cursor-pointer hover:elevation-3 
                  transform transition-all duration-700 motion-standard ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                style={{ transitionDelay: `${info.delay}ms` }}
              >
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 motion-standard
                      ${
                        info.color === "primary"
                          ? "bg-primary-subtle"
                          : info.color === "secondary"
                          ? "bg-secondary-subtle"
                          : "bg-accent-subtle"
                      }`}
                  >
                    <info.icon
                      className={`h-6 w-6
                        ${
                          info.color === "primary"
                            ? "text-primary"
                            : info.color === "secondary"
                            ? "text-secondary"
                            : "text-accent"
                        }`}
                    />
                  </div>
                </div>
                <h3 className="text-headline-medium font-medium mb-2 text-foreground">
                  {info.title}
                </h3>
                <p className="text-body-medium text-muted-foreground">
                  {info.details}
                </p>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div
            className={`google-card p-8 md:p-12 transform transition-all duration-700 motion-decelerate ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-label-large font-medium text-foreground mb-2"
                    htmlFor="name"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Jane Doe"
                    value={contactForm.name}
                    onChange={handleChange}
                    className={`google-input ${
                      contactForm.errors.name
                        ? "border-destructive focus-visible:border-destructive"
                        : ""
                    }`}
                  />
                  {contactForm.errors.name && (
                    <p className="mt-1 text-label-medium text-destructive">
                      {contactForm.errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-label-large font-medium text-foreground mb-2"
                    htmlFor="email"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="jane@school.edu"
                    value={contactForm.email}
                    onChange={handleChange}
                    className={`google-input ${
                      contactForm.errors.email
                        ? "border-destructive focus-visible:border-destructive"
                        : ""
                    }`}
                  />
                  {contactForm.errors.email && (
                    <p className="mt-1 text-label-medium text-destructive">
                      {contactForm.errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-label-large font-medium text-foreground mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roleOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        id={option.value}
                        name="role"
                        value={option.value}
                        checked={contactForm.role === option.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-secondary focus:ring-secondary focus:ring-2 border-border transition-colors duration-200"
                      />
                      <label
                        htmlFor={option.value}
                        className="ml-2 text-body-medium text-foreground cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  className="block text-label-large font-medium text-foreground mb-2"
                  htmlFor="subject"
                >
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="How can we help you?"
                  value={contactForm.subject}
                  onChange={handleChange}
                  className="google-input"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-label-large font-medium text-foreground mb-2"
                  htmlFor="message"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help..."
                  value={contactForm.message}
                  onChange={handleChange}
                  rows={6}
                  className={`google-input resize-none ${
                    contactForm.errors.message
                      ? "border-destructive focus-visible:border-destructive"
                      : ""
                  }`}
                />
                {contactForm.errors.message && (
                  <p className="mt-1 text-label-medium text-destructive">
                    {contactForm.errors.message}
                  </p>
                )}
              </div>

              {/* Submit button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className={`google-button-primary px-8 py-3 elevation-2 hover:elevation-3 
                    transform hover:scale-105 motion-standard ${
                      contactForm.isSubmitting
                        ? "opacity-75 cursor-not-allowed"
                        : ""
                    }`}
                  disabled={contactForm.isSubmitting}
                >
                  {contactForm.isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-secondary-foreground border-t-transparent mr-2" />
                      Sending...
                    </div>
                  ) : contactForm.submitSuccess ? (
                    <div className="flex items-center">
                      <div className="mr-2">✓</div>
                      Sent!
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Privacy note */}
          <div
            className={`mt-6 text-center text-body-small text-muted-foreground transition-all duration-1000 delay-500 motion-decelerate ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            Your information is protected by our{" "}
            <a
              href="/privacy"
              className="text-secondary hover:text-secondary/80 transition-colors duration-200 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            . We&apos;ll never share your details without your permission.
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
