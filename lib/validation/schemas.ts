// lib/validation/schemas.ts
import { z } from "zod";

// Constants for form options
export const USER_ROLES = [
  "Teacher",
  "Special Education Teacher",
  "School Principal",
  "Vice Principal",
  "Guidance Counselor",
  "Para-professional",
  "District Admin",
  "Support Services",
  "Administrator",
  "Librarian",
  "Instructional Coach",
  "Specialist (e.g. Reading, Math)",
  "Other",
] as const;

export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
  "Foreign Language",
  "Special Education",
  "Other",
] as const;

export const GRADE_LEVELS = [
  "Pre-K",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
] as const;

export const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
] as const;

// Common validation patterns
const commonValidation = {
  email: z.string().email("Please enter a valid email address"),
  name: z
    .string()
    .min(2, "Must be at least 2 characters")
    .max(50, "Must be less than 50 characters"),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  required: z.string().min(1, "This field is required"),
  positiveNumber: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Must be a positive number",
    }),
};

// Teacher Information Schema
export const teacherInfoSchema = z
  .object({
    firstName: commonValidation.name,
    lastName: commonValidation.name,
    email: commonValidation.email,
    userRole: z.enum(USER_ROLES, { required_error: "Please select your role" }),
    customRole: z.string().optional(),
    subjects: z.array(z.enum(SUBJECTS)).optional(),
    gradeLevels: z.array(z.enum(GRADE_LEVELS)).optional(),
    numYearsTeaching: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Custom role validation
    if (data.userRole === "Other" && !data.customRole?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify your role",
        path: ["customRole"],
      });
    }

    // Teacher-specific validations
    const isTeacherRole = ["Teacher", "Special Education Teacher"].includes(
      data.userRole
    );

    if (isTeacherRole) {
      if (!data.subjects || data.subjects.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select at least one subject",
          path: ["subjects"],
        });
      }

      if (!data.gradeLevels || data.gradeLevels.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select at least one grade level",
          path: ["gradeLevels"],
        });
      }

      if (!data.numYearsTeaching?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Years of teaching is required for teachers",
          path: ["numYearsTeaching"],
        });
      } else if (
        isNaN(Number(data.numYearsTeaching)) ||
        Number(data.numYearsTeaching) < 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid number of years",
          path: ["numYearsTeaching"],
        });
      }
    }
  });

// School Information Schema
export const schoolInfoSchema = z.object({
  name: commonValidation.name,
  address: commonValidation.required,
  city: commonValidation.required,
  state: z.enum(US_STATES, { required_error: "Please select a state" }),
  zip: commonValidation.zipCode,
  districtId: z.string().optional(),
});

// School selection schema (for API data)
export const schoolSelectionSchema = z.object({
  ncesId: z.string(),
  name: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  telephone: z.string().optional(),
  type: z.string(),
  districtId: z.string(),
});

// Type exports
export type TeacherInfoFormData = z.infer<typeof teacherInfoSchema>;
export type SchoolInfoFormData = z.infer<typeof schoolInfoSchema>;
export type SchoolSelectionData = z.infer<typeof schoolSelectionSchema>;

// Helper functions
export const isTeacherRole = (role: string): boolean => {
  return ["Teacher", "Special Education Teacher"].includes(role);
};
