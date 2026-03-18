/* ============================================
   LAYOUT COMPONENT
   The app shell. Orchestrates sidebar, topbar,
   and the content area where pages render.
   ============================================ */

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useTheme } from "../../hooks/useTheme";
import "./Layout.css";

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  function handleToggleCollapse() {
    setIsSidebarCollapsed((prev) => !prev);
  }

  function handleOpenMobileSidebar() {
    setIsMobileSidebarOpen(true);
  }

  function handleCloseMobileSidebar() {
    setIsMobileSidebarOpen(false);
  }

  const contentClasses = [
    "mainContent",
    isSidebarCollapsed ? "sidebarCollapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="layout">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        theme={theme}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={handleCloseMobileSidebar}
        onToggleTheme={toggleTheme}
      />

      <TopBar
        isSidebarCollapsed={isSidebarCollapsed}
        onOpenMobileSidebar={handleOpenMobileSidebar}
      />

      <main className={contentClasses}>
        {/* Outlet renders the matched child route's component */}
        <Outlet />
      </main>
    </div>
  );
}
