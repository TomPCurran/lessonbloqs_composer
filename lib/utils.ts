import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Roles } from "@/types/global";
import { auth } from "@clerk/nextjs/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const getAccessType = (userType: UserType) => {
  switch (userType) {
    case "creator":
      return ["room:write"];
    case "editor":
      return ["room:write"];
    case "viewer":
      return ["room:read", "room:presence:write"];
    default:
      return ["room:read", "room:presence:write"];
  }
};

export const dateConverter = (timestamp: string): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case diffInDays > 7:
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    case diffInDays >= 1 && diffInDays <= 7:
      return `${Math.floor(diffInDays)} days ago`;
    case diffInHours >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case diffInMinutes >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return "Just now";
  }
};

export function getRandomColor() {
  const avoidColors = ["#000000", "#FFFFFF", "#8B4513"]; // Black, White, Brown in hex format

  let randomColor;
  do {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256); // Random number between 0-255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB to hex format
    randomColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  } while (avoidColors.includes(randomColor));

  return randomColor;
}

export const brightColors = [
  "#2E8B57", // Darker Neon Green
  "#FF6EB4", // Darker Neon Pink
  "#00CDCD", // Darker Cyan
  "#FF00FF", // Darker Neon Magenta
  "#FF007F", // Darker Bright Pink
  "#FFD700", // Darker Neon Yellow
  "#00CED1", // Darker Neon Mint Green
  "#FF1493", // Darker Neon Red
  "#00CED1", // Darker Bright Aqua
  "#FF7F50", // Darker Neon Coral
  "#9ACD32", // Darker Neon Lime
  "#FFA500", // Darker Neon Orange
  "#32CD32", // Darker Neon Chartreuse
  "#ADFF2F", // Darker Neon Yellow Green
  "#DB7093", // Darker Neon Fuchsia
  "#00FF7F", // Darker Spring Green
  "#FFD700", // Darker Electric Lime
  "#FF007F", // Darker Bright Magenta
  "#FF6347", // Darker Neon Vermilion
];

export function getUserColor(userId?: string) {
  if (!userId) {
    // Fallback to random color if no userId provided
    return getRandomColor();
  }

  // Create a hash from the userId to get a consistent index
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get a valid index
  const colorIndex = Math.abs(hash) % brightColors.length;
  return brightColors[colorIndex];
}
