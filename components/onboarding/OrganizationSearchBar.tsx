"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Search,
  Building2,
  MapPin,
  Users,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useFormStore, ONBOARDING_FORM_ID } from "@/lib/stores";
import type { FormState } from "@/lib/stores";

// Types for organization data
interface Organization {
  id: string;
  name: string;
  type: "school" | "district";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  studentCount?: number;
  schoolCount?: number;
  description?: string;
}

// Mock data for schools and districts
const MOCK_ORGANIZATIONS: Organization[] = [
  {
    id: "1",
    name: "Lincoln High School",
    type: "school",
    address: "1234 Education Ave",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    studentCount: 1250,
    description: "Public high school serving grades 9-12",
  },
  {
    id: "2",
    name: "Springfield School District 186",
    type: "district",
    address: "1900 W Monroe St",
    city: "Springfield",
    state: "IL",
    zipCode: "62704",
    schoolCount: 24,
    studentCount: 15000,
    description:
      "Public school district serving Springfield and surrounding areas",
  },
  {
    id: "3",
    name: "Washington Elementary School",
    type: "school",
    address: "2300 S 5th St",
    city: "Springfield",
    state: "IL",
    zipCode: "62703",
    studentCount: 450,
    description: "Elementary school serving grades K-5",
  },
  {
    id: "4",
    name: "Jefferson Middle School",
    type: "school",
    address: "1800 S 6th St",
    city: "Springfield",
    state: "IL",
    zipCode: "62703",
    studentCount: 650,
    description: "Middle school serving grades 6-8",
  },
  {
    id: "5",
    name: "Champaign Unit 4 School District",
    type: "district",
    address: "703 S New St",
    city: "Champaign",
    state: "IL",
    zipCode: "61820",
    schoolCount: 18,
    studentCount: 12000,
    description: "Public school district serving Champaign and Urbana",
  },
  {
    id: "6",
    name: "Centennial High School",
    type: "school",
    address: "913 S Crescent Dr",
    city: "Champaign",
    state: "IL",
    zipCode: "61821",
    studentCount: 1100,
    description: "Public high school serving grades 9-12",
  },
  {
    id: "7",
    name: "Chicago Public Schools",
    type: "district",
    address: "42 W Madison St",
    city: "Chicago",
    state: "IL",
    zipCode: "60602",
    schoolCount: 638,
    studentCount: 322000,
    description: "Third-largest school district in the United States",
  },
  {
    id: "8",
    name: "Lane Tech College Prep",
    type: "school",
    address: "2501 W Addison St",
    city: "Chicago",
    state: "IL",
    zipCode: "60618",
    studentCount: 4500,
    description: "Selective enrollment high school with focus on STEM",
  },
];

interface OrganizationSearchBarProps {
  onOrganizationSelect?: (organization: Organization) => void;
  onAddCustomOrganization?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
}

export default function OrganizationSearchBar({
  onOrganizationSelect,
  onAddCustomOrganization,
  placeholder = "Search for your school or district...",
  className,
  disabled = false,
  defaultValue = "",
}: OrganizationSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredOrganizations, setFilteredOrganizations] = useState<
    Organization[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const updateGenericForm = useFormStore((s: FormState) => s.updateGenericForm);

  // Handle add custom organization
  const handleAddCustomOrganization = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
    // Clear org in onboarding form (set to empty string)
    updateGenericForm(ONBOARDING_FORM_ID, "organization", "");
    onAddCustomOrganization?.();
  }, [onAddCustomOrganization, updateGenericForm]);

  // Search function with proper filtering
  const searchOrganizations = useCallback((term: string): Organization[] => {
    if (!term.trim()) return [];

    const normalizedTerm = term.toLowerCase().trim();

    return MOCK_ORGANIZATIONS.filter((org) => {
      const searchableText = [
        org.name.toLowerCase(),
        org.city.toLowerCase(),
        org.state.toLowerCase(),
        org.description?.toLowerCase() || "",
      ].join(" ");

      return searchableText.includes(normalizedTerm);
    })
      .sort((a, b) => {
        // Prioritize exact name matches
        const aNameMatch = a.name.toLowerCase().startsWith(normalizedTerm);
        const bNameMatch = b.name.toLowerCase().startsWith(normalizedTerm);

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        // Then sort by type (districts first, then schools)
        if (a.type !== b.type) {
          return a.type === "district" ? -1 : 1;
        }

        // Finally sort alphabetically
        return a.name.localeCompare(b.name);
      })
      .slice(0, 5); // Limit to top 5 results
  }, []);

  // Handle search term changes
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      // Simulate API call delay
      const timer = setTimeout(() => {
        const results = searchOrganizations(debouncedSearchTerm);
        setFilteredOrganizations(results);
        setIsLoading(false);
        setIsOpen(true);
        setSelectedIndex(-1);
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setFilteredOrganizations([]);
      setIsOpen(false);
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, searchOrganizations]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filteredOrganizations.length === 0) return;

      const totalOptions = filteredOrganizations.length + 1; // +1 for custom organization option

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev < totalOptions - 1 ? prev + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalOptions - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (
            selectedIndex >= 0 &&
            selectedIndex < filteredOrganizations.length
          ) {
            handleOrganizationSelect(filteredOrganizations[selectedIndex]);
          } else if (selectedIndex === filteredOrganizations.length) {
            handleAddCustomOrganization();
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, filteredOrganizations, selectedIndex, handleAddCustomOrganization]
  );

  // Handle organization selection
  const handleOrganizationSelect = useCallback(
    (organization: Organization) => {
      setSearchTerm(organization.name);
      setIsOpen(false);
      setSelectedIndex(-1);
      // Update onboarding form in Zustand (as JSON string)
      updateGenericForm(
        ONBOARDING_FORM_ID,
        "organization",
        JSON.stringify(organization)
      );
      onOrganizationSelect?.(organization);
    },
    [onOrganizationSelect, updateGenericForm]
  );

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    if (searchTerm && filteredOrganizations.length > 0) {
      setIsOpen(true);
    }
  }, [searchTerm, filteredOrganizations.length]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format organization display
  const formatOrganizationDisplay = (org: Organization) => {
    const location = `${org.city}, ${org.state}`;
    const count =
      org.type === "district"
        ? `${
            org.schoolCount
          } schools, ${org.studentCount?.toLocaleString()} students`
        : `${org.studentCount?.toLocaleString()} students`;

    return { location, count };
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      {/* Search Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "google-input pl-4 pr-12 h-14 text-body-large",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isOpen && "rounded-b-none border-b-0"
          )}
          aria-label="Search for school or district"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
        />

        {/* Search icon on the right */}
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Dropdown arrow */}
        {isOpen && !isLoading && (
          <ChevronDown className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <Card
          ref={dropdownRef}
          className={cn(
            "absolute top-full left-0 right-0 z-50 mt-0 rounded-t-none border-t-0",
            "max-h-96 overflow-hidden elevation-3"
          )}
        >
          <CardContent className="p-0">
            <div
              className="max-h-96 overflow-y-auto"
              role="listbox"
              aria-label="Search results"
            >
              {filteredOrganizations.length > 0 ? (
                <>
                  {filteredOrganizations.map((org, index) => {
                    const { location, count } = formatOrganizationDisplay(org);
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={org.id}
                        onClick={() => handleOrganizationSelect(org)}
                        className={cn(
                          "w-full text-left p-4 hover:bg-muted/50 transition-colors duration-200",
                          "focus:outline-none focus:bg-muted/50",
                          isSelected && "bg-primary-subtle text-primary"
                        )}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-start gap-3">
                          {/* Organization Icon */}
                          <div
                            className={cn(
                              "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                              "bg-primary-subtle text-primary"
                            )}
                          >
                            {org.type === "district" ? (
                              <Building2 className="h-5 w-5" />
                            ) : (
                              <Users className="h-5 w-5" />
                            )}
                          </div>

                          {/* Organization Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-body-large font-medium text-foreground truncate">
                                {org.name}
                              </h3>
                              <Badge
                                variant={
                                  org.type === "district"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-label-small"
                              >
                                {org.type === "district"
                                  ? "District"
                                  : "School"}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-body-small text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{count}</span>
                              </div>
                            </div>

                            {org.description && (
                              <p className="text-body-small text-muted-foreground mt-1 line-clamp-2">
                                {org.description}
                              </p>
                            )}
                          </div>

                          {/* Selection indicator */}
                          {isSelected && (
                            <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-muted-foreground">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        <span>Searching...</span>
                      </div>
                    ) : debouncedSearchTerm ? (
                      <div>
                        <p className="text-body-medium mb-2">
                          No organizations found
                        </p>
                        <p className="text-body-small text-muted-foreground">
                          Try searching with different keywords or check the
                          spelling
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-body-medium mb-2">
                          Start typing to search
                        </p>
                        <p className="text-body-small text-muted-foreground">
                          Search for your school or district by name, city, or
                          state
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add Custom Organization Option - Always shown when there's a search term */}
              {debouncedSearchTerm && (
                <div
                  className={cn(
                    "border-t border-border",
                    filteredOrganizations.length === 0 && "border-t-0"
                  )}
                >
                  <button
                    onClick={handleAddCustomOrganization}
                    className={cn(
                      "w-full text-left p-3 hover:bg-muted/50 transition-colors duration-200",
                      "focus:outline-none focus:bg-muted/50",
                      selectedIndex === filteredOrganizations.length &&
                        "bg-primary-subtle text-primary"
                    )}
                    role="option"
                    aria-selected={
                      selectedIndex === filteredOrganizations.length
                    }
                  >
                    <div className="flex items-center gap-3">
                      {/* Plus Icon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-accent-subtle">
                        <Plus className="h-4 w-4 text-accent" />
                      </div>

                      {/* Add Custom Text */}
                      <div className="flex-1">
                        <p className="text-body-medium font-medium text-foreground">
                          Add &ldquo;{searchTerm}&rdquo; as a new organization
                        </p>
                        <p className="text-body-small text-muted-foreground">
                          Can&apos;t find your organization? Add it manually
                        </p>
                      </div>

                      {/* Selection indicator */}
                      {selectedIndex === filteredOrganizations.length && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
