import { LucideIcon } from "lucide-react";

export interface User {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  blogUrl: string;
  rssRegistered: boolean;
  lastPosted: string;
  totalPosts: number;
  totalViews: number;
  topics: string[];
}

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  id: string;
}
