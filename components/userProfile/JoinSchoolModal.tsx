"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School, XCircle, PlusCircle } from "lucide-react";

const JoinSchoolModal = () => {
  const router = useRouter(); // Initialize the router
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Only trigger API calls for non-empty input
    if (value.trim()) {
      fetchSchools(value);
    } else {
      setFilteredSchools([]);
    }
  };

  const fetchSchools = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/schools?school_name=${encodeURIComponent(query)}`
      );

      if (response.status === 404) {
        // If no schools are found (404), clear the filteredSchools array
        setFilteredSchools([]);
        console.warn(`No schools found for query: "${query}"`);
        return;
      }

      if (!response.ok) {
        // Handle other types of errors
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setFilteredSchools(data);
    } catch (error) {
      console.error("Error fetching schools:", error);
      setFilteredSchools([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  };

  // Handle school selection
  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
    setSearchTerm(""); // Clear input
    setFilteredSchools([]); // Clear results
  };

  // Handle removing selected school
  const handleRemoveSelectedSchool = () => {
    setSelectedSchool(null);
  };

  // Handle creating a new school
  const handleCreateNewSchool = () => {
    router.push(`/new-school?name=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full justify-start border-primary-grey-200 bg-transparent text-primary-purple hover:border-primary-purple/30 hover:bg-gradient-to-r hover:from-primary-purple/5 hover:to-primary-blue/5 transition-colors"
          size="sm"
        >
          <School className="h-4 w-4 mr-2" />
          Join a School
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-primary-purple to-primary-blue rounded-lg">
              <School className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-2xl font-semibold text-primary-black">
              Join a School
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-primary-grey-300">
              Search for a School
            </Label>
            <div className="relative">
              <Input
                placeholder="Enter your school name"
                value={searchTerm}
                onChange={handleInputChange}
                className="bg-white border-primary-grey-200 hover:border-primary-purple/30 focus:border-primary-purple focus:ring-primary-purple/20"
              />
              {loading && (
                <div className="absolute right-4 top-2">
                  <span className="text-primary-grey-300">Loading...</span>
                </div>
              )}
              {/* Display filtered results */}
              <div
                className={`absolute z-10 bg-white border border-primary-grey-200 rounded-lg shadow-lg mt-2 w-full max-h-60 overflow-y-auto transition-all duration-300 transform ${
                  filteredSchools.length > 0 || searchTerm.trim()
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                }`}
              >
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => handleSchoolSelect(school)}
                      className="p-3 hover:bg-primary-purple/5 transition cursor-pointer"
                    >
                      <h3 className="font-medium text-primary-black">
                        {school.name}
                      </h3>
                      <p className="text-sm text-primary-grey-300">
                        {school.district_id}
                      </p>
                    </div>
                  ))
                ) : (
                  <div
                    onClick={handleCreateNewSchool}
                    className="p-3 hover:bg-primary-purple/5 transition cursor-pointer flex items-center gap-2"
                  >
                    <PlusCircle className="h-5 w-5 text-primary-purple" />
                    <span className="text-primary-black font-medium">
                      Create New School "{searchTerm}"
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Selected School */}
          {selectedSchool && (
            <div className="mt-4 p-4 border border-primary-grey-200 rounded-lg bg-primary-purple/5 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-primary-black">
                  {selectedSchool.name}
                </h3>
                <p className="text-sm text-primary-grey-300">
                  {selectedSchool.district_id}
                </p>
              </div>
              <button
                onClick={handleRemoveSelectedSchool}
                className="text-primary-purple hover:text-primary-purple/80"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        <div className="p-6 bg-gradient-to-r from-primary-purple/10 to-primary-blue/10 border-t border-primary-grey-200 flex justify-end gap-3">
          <Button
            variant="outline"
            className="border-primary-grey-200 hover:border-primary-purple/30 bg-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-primary-purple text-white hover:bg-primary-purple/90"
          >
            Join School
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinSchoolModal;
