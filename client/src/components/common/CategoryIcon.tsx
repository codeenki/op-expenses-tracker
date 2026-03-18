/* ============================================
   CATEGORY ICONS
   SVG icon components for each expense category.
   Each icon is 16x16 and uses currentColor so it
   inherits the parent's text color.
   ============================================ */

import type { ExpenseCategory } from "../../models/types";
import { CATEGORY_CONFIG } from "../../constants/categories";
import "./CategoryIcon.css";

interface CategoryIconProps {
  category: ExpenseCategory;
  size?: number;
}

export default function CategoryIcon({
  category,
  size = 32,
}: CategoryIconProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = ICON_MAP[category];

  return (
    <div
      className="categoryIcon"
      style={{
        width: size,
        height: size,
        background: config.lightBg,
        color: config.color,
      }}
    >
      <Icon />
    </div>
  );
}

/* ---------- Icon mapping ---------- */

const ICON_MAP: Record<ExpenseCategory, React.FC> = {
  food: FoodIcon,
  transport: TransportIcon,
  shopping: ShoppingIcon,
  bills: BillsIcon,
  entertainment: EntertainmentIcon,
  health: HealthIcon,
  education: EducationIcon,
  other: OtherIcon,
};

/* ---------- SVG Icons ---------- */

function FoodIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M5 1v4c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V1M8 7v8M5 15h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TransportIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="4"
        width="14"
        height="7"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="4.5" cy="13" r="1.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="11.5" cy="13" r="1.2" stroke="currentColor" strokeWidth="1" />
      <path d="M1 8h14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ShoppingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 1h2l1.7 8.5a1 1 0 001 .8h6.6a1 1 0 001-.7L15 4H4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="13.5" r="1" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="13.5" r="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function BillsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 1h10a1 1 0 011 1v12l-2-1.5L10 14l-2-1.5L6 14l-2-1.5L2 14V2a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 5h6M5 8h4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EntertainmentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2"
        y="3"
        width="12"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M6.5 5.5v3l3-1.5-3-1.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13h6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 14s-5.5-3.5-5.5-7A3.5 3.5 0 018 4a3.5 3.5 0 015.5 3c0 3.5-5.5 7-5.5 7z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 6l7-3 7 3-7 3-7-3z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M4 7.5v4c0 1 1.8 2 4 2s4-1 4-2v-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OtherIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="8" r="1.2" fill="currentColor" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" />
      <circle cx="12" cy="8" r="1.2" fill="currentColor" />
    </svg>
  );
}
