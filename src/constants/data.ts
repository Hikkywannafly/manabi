import type { NavItem } from "@/types";

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
// Overview section
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "layoutPanelLeft",
    isActive: false,
    items: [],
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: "library",
    isActive: false,
    items: [],
  },
];

// Content Creation section
export const contentNavItems: NavItem[] = [
  {
    title: "Materials",
    url: "/dashboard/material",
    icon: "page", // Using 'page' (IconFile) for file icon
    isActive: false,
    items: [],
  },
  {
    title: "Quizzes",
    url: "/dashboard/quiz",
    icon: "book",
    isActive: false,
    items: [],
  },
  {
    title: "Flashcards",
    url: "/dashboard/flashcards",
    icon: "bookOpen",
    isActive: false,
    items: [],
  },
  {
    title: "Collections",
    url: "/dashboard/collections",
    icon: "folder",
    isActive: false,
    items: [],
  },
];

// Study Tools section
export const studyToolsNavItems: NavItem[] = [
  {
    title: "Notes",
    url: "/dashboard/notes",
    icon: "stickyNote",
    isActive: false,
    items: [],
  },
  {
    title: "Reader",
    url: "/dashboard/reader",
    icon: "book",
    isActive: false,
    items: [],
  },
  {
    title: "Tutors",
    url: "",
    icon: "graduationCap",
    isActive: false,
    items: [],
  },
  {
    title: "Pomodoro",
    url: "/dashboard/pomodoro",
    icon: "timer",
    isActive: false,
    items: [],
  },
];

// Planning & Organization section
export const planningNavItems: NavItem[] = [
  {
    title: "Planner",
    url: "",
    icon: "calendar",
    isActive: false,
    items: [],
  },
  {
    title: "Kanban Board",
    url: "/dashboard/kanban",
    icon: "kanban",
    isActive: false,
    items: [],
  },
];

// Social & Progress section
export const socialNavItems: NavItem[] = [
  {
    title: "Study Groups",
    url: "",
    icon: "users",
    isActive: false,
    items: [],
  },
  {
    title: "Achievements",
    url: "/dashboard/achievements",
    icon: "trophy",
    isActive: false,
    items: [],
  },
  {
    title: "Statistics",
    url: "/dashboard/statistics",
    icon: "chartLine",
    isActive: false,
    items: [],
  },
];

// Account section
export const accountNavItems: NavItem[] = [
  {
    title: "Billing",
    url: "",
    icon: "billing",
    isActive: false,
    items: [],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: "settings", // IconSettings
    isActive: false,
    items: [],
  },
  {
    title: "Feedback",
    url: "",
    icon: "messageCircle",
    isActive: false,
    items: [],
  },
];

// Community section (Using external links, icons might need special handling if not in Icons map, assuming standard icons for now)
export const communityNavItems: NavItem[] = [
  {
    title: "Discord",
    url: "",
    icon: "discord",
    isActive: false,
    items: [],
    external: true, // Assuming NavItem supports this or we handle it
  },
  {
    title: "Facebook",
    url: "",
    icon: "facebook",
    isActive: false,
    items: [],
    external: true,
  },
  {
    title: "Reddit",
    url: "",
    icon: "reddit",
    isActive: false,
    items: [],
    external: true,
  },
];
