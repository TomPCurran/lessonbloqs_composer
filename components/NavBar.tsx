"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Menu, X, User, LogOut, BookOpen } from "lucide-react";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUIStore } from "@/lib/stores/uiStore";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Zustand store for UI state
  const {
    isMobileMenuOpen,
    isSignInModalOpen,
    isSignUpModalOpen,
    setMobileMenuOpen,
    setSignInModalOpen,
    setSignUpModalOpen,
  } = useUIStore();

  // Prevent hydration mismatch by only rendering auth-dependent content after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 border-b bg-background/95 backdrop-blur",
          "border-border/50"
        )}
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/logo.svg"
              alt="Lessonbloqs Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="hidden text-lg font-semibold text-foreground sm:inline">
              Lessonbloqs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            {isMounted && isLoaded && isSignedIn ? (
              <>
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </Button>
                <Link href="/lessonplans">
                  <Button
                    size="sm"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Lesson Plans</span>
                  </Button>
                </Link>
              </>
            ) : isMounted && isLoaded && !isSignedIn ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSignInModalOpen(true)}
                  className="text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSignUpModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              // Loading state - render skeleton to prevent hydration mismatch
              <div className="flex items-center gap-2">
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                <div className="h-8 w-20 bg-muted animate-pulse rounded" />
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full border-t bg-background/95 backdrop-blur border-border/50 md:hidden">
              <div className="space-y-1 p-2">
                {isMounted && isLoaded && isSignedIn ? (
                  <>
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center gap-2 justify-start text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Profile</span>
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </Button>
                    <Link href="/lessonplans">
                      <Button
                        size="sm"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex w-full items-center gap-2 justify-start bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Lesson Plans</span>
                      </Button>
                    </Link>
                  </>
                ) : isMounted && isLoaded && !isSignedIn ? (
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSignInModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 justify-start text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSignUpModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 justify-start bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  // Loading state for mobile
                  <div className="space-y-1">
                    <div className="h-8 w-full bg-muted animate-pulse rounded" />
                    <div className="h-8 w-full bg-muted animate-pulse rounded" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Sign In Modal */}
      <Dialog open={isSignInModalOpen} onOpenChange={setSignInModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <SignIn />
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpModalOpen} onOpenChange={setSignUpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            <SignUp />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
