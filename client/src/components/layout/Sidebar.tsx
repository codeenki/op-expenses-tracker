/* ============================================
   SIDEBAR COMPONENT
   Handles navigation, profile link, theme toggle,
   and collapse/expand functionality.
   ============================================ */

import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import "./Sidebar.css";

/* ---------- Types ---------- */

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  theme: "light" | "dark";
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
  onToggleTheme: () => void;
}

/* ---------- Navigation config ---------- */

const NAV_ITEMS = [
  { path: ROUTES.DASHBOARD, label: "Dashboard", icon: DashboardIcon },
  { path: ROUTES.ACCOUNTS, label: "Accounts & cards", icon: AccountsIcon },
  { path: ROUTES.EXPENSES, label: "Expenses", icon: ExpensesIcon },
  { path: ROUTES.INCOME, label: "Income & payments", icon: IncomeIcon },
  { path: ROUTES.ANALYTICS, label: "Analytics", icon: AnalyticsIcon },
  { path: ROUTES.SETTINGS, label: "Settings", icon: SettingsIcon },
];

/* ---------- Component ---------- */

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  theme,
  onToggleCollapse,
  onCloseMobile,
  onToggleTheme,
}: SidebarProps) {
  const location = useLocation();

  const sidebarClasses = [
    "sidebar",
    isCollapsed ? "collapsed" : "",
    isMobileOpen ? "mobileOpen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isProfileActive = location.pathname === ROUTES.PROFILE;

  return (
    <>
      {/* Mobile overlay — closes sidebar when tapped */}
      <div
        className={`overlay ${isMobileOpen ? "visible" : ""}`}
        onClick={onCloseMobile}
      />

      <aside className={sidebarClasses}>
        {/* Mobile close button — visible only on small screens */}
        <button className="mobileCloseBtn" onClick={onCloseMobile}>
          <CloseIcon />
        </button>

        {/* Profile section */}
        <NavLink
          to={ROUTES.PROFILE}
          className={`profileRow ${isProfileActive ? "active" : ""}`}
          onClick={onCloseMobile}
        >
          <div className="profileAvatar">LA</div>
          <div className="profileInfo">
            <span className="profileName">Luis Araya</span>
            <span className="profileEmail">fooky408@gmail.com</span>
          </div>
        </NavLink>

        <div className="divider" />

        {/* Navigation items */}
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }: { isActive: boolean }) =>
              `navItem ${isActive ? "active" : ""}`
            }
            onClick={onCloseMobile}
          >
            <span className="navIcon">
              <Icon />
            </span>
            <span className="navLabel">{label}</span>
          </NavLink>
        ))}

        {/* Bottom section */}
        <div className="bottomSection">
          <button className="themeToggle" onClick={onToggleTheme}>
            <span className="navIcon">
              {theme === "dark" ? <MoonIcon /> : <SunIcon />}
            </span>
            <span className="themeLabel">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </span>
          </button>

          <button className="collapseBtn" onClick={onToggleCollapse}>
            <span className="collapseIcon">
              <ChevronLeftIcon />
            </span>
            <span className="collapseLabel">Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}

/* ---------- Icon components ---------- */

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 4L14 14M14 4L4 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="1"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="9"
        y="1"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="1"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="9"
        y="9"
        width="6"
        height="6"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function AccountsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="3"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="1"
        y1="7"
        x2="15"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function ExpensesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 4.5v7M5.5 6.5h5c.8 0 .8 2-1 2H6c-1.8 0-1.8 2 0 2h4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IncomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 13L5.5 8L8.5 10.5L14 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 3H14V7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="8"
        width="3"
        height="6"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="6.5"
        y="5"
        width="3"
        height="9"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="11"
        y="2"
        width="3"
        height="12"
        rx="0.8"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1.5A6.5 6.5 0 1 0 14.5 8 5 5 0 0 1 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M10 3L5 8L10 13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
