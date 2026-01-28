import { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export interface SidebarConfig {
  title: string;
  subtitle: string;
  items: SidebarItem[];
}
