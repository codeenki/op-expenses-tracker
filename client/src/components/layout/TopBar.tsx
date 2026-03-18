/* ============================================
   TOPBAR COMPONENT
   Displays page title, hamburger menu (mobile),
   and action buttons.
   ============================================ */

import { useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./TopBar.css";

/* ---------- Types ---------- */

interface TopBarProps {
  isSidebarCollapsed: boolean;
  onOpenMobileSidebar: () => void;
}

/* ---------- Page title mapping ---------- */

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: "Dashboard",
  [ROUTES.ACCOUNTS]: "Accounts & cards",
  [ROUTES.TRANSACTIONS]: "Transactions",
  [ROUTES.INCOME]: "Income & payments",
  [ROUTES.ANALYTICS]: "Analytics",
  [ROUTES.SETTINGS]: "Settings",
  [ROUTES.PROFILE]: "Profile",
};

/* ---------- Component ---------- */

export default function TopBar({
  isSidebarCollapsed,
  onOpenMobileSidebar,
}: TopBarProps) {
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard";

  const topbarClasses = ["topbar", isSidebarCollapsed ? "sidebarCollapsed" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={topbarClasses}>
      <div className="topbarLeft">
        <button className="hamburger" onClick={onOpenMobileSidebar}>
          <HamburgerIcon />
        </button>
        <h1 className="pageTitle">{pageTitle}</h1>
      </div>

      <div className="topbarRight">
        <button className="topbarBtn" aria-label="Notifications">
          <NotificationIcon />
        </button>
      </div>
    </header>
  );
}

/* ---------- Icons ---------- */

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 5h14M3 10h14M3 15h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M13.5 6.75a4.5 4.5 0 1 0-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3 15.75a1.5 1.5 0 0 1-2.6 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
