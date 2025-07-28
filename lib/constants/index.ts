import { LuGoal, LuClock4 } from "react-icons/lu";
import { MdOutlineAssessment, MdOutlineDifference } from "react-icons/md";
import { GiMaterialsScience, GiGiftOfKnowledge } from "react-icons/gi";
import { TbBrandPagekit } from "react-icons/tb";
import { LiaGoogleDrive } from "react-icons/lia";
import { TbBrandOnedrive } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa";

export const bloqTypes = [
  {
    key: "standards",
    title: "Standards",
    icon: LuGoal,
    description: "Creates a bloq that aligns to Learning Standard",
  },
  {
    key: "classTime",
    title: "Class Time",
    icon: LuClock4,
    description: "Creates a bloq for instructions during class time",
  },
  {
    key: "assessment",
    title: "Assessment",
    icon: MdOutlineAssessment,
    description: "Creates a bloq to help create an assessment",
  },
  {
    key: "differentiation",
    title: "Differentiation",
    icon: MdOutlineDifference,
    description: "Differentiate your class materials for your students",
  },
  {
    key: "materials",
    title: "Materials",
    icon: GiMaterialsScience,
    description:
      "List necessary materials or classroom materials for the lesson",
  },
  {
    key: "priorKnowledge",
    title: "Prior Knowledge",
    icon: GiGiftOfKnowledge,
    description: "Connect to previous lesson or previous knowledge",
  },
  {
    key: "customBloq",
    title: "Blank",
    icon: TbBrandPagekit,
    description: "Empty bloq to use for whatever you want!",
  },
];

export const exportOptions = [
  {
    key: "googleDrive",
    title: "Google Drive",
    icon: LiaGoogleDrive,
    description: "Export to your Google Drive",
  },
  {
    key: "oneDrive",
    title: "One Drive",
    icon: TbBrandOnedrive,
    description: "Export to your OneDrive",
  },
  {
    key: "exportPdf",
    title: "PDF",
    icon: FaRegFilePdf,
    description: "Download your lesson plan as PDF",
  },
];

export const ROLES = [
  "Teacher",
  "Special Education Teacher",
  "School Principal",
  "Vice Principal",
  "Administrator",
  "Other",
];

export const SCHOOL_TYPES = [
  "Public School",
  "Private School",
  "Charter School",
  "Homeschool",
  "Other",
];

export const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Art",
  "Music",
  "Physical Education",
  "Other",
];

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
];

// Define the steps
export const STEPS = [
  { id: 1, title: "Basic Information", description: "Tell us about yourself" },
  { id: 2, title: "School Information", description: "About your school" },
  {
    id: 3,
    title: "Teaching Details",
    description: "Your teaching preferences",
  },
] as const;
