import { ReactNode } from "react";

export const mockSidebar = {
  Sidebar: ({ children }: { children: ReactNode }) => <div data-testid="sidebar">{children}</div>,
  SidebarContent: ({ children }: { children: ReactNode }) => <div data-testid="sidebar-content">{children}</div>,
};
