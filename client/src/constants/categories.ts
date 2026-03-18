/* ============================================
   APP CONSTANTS
   Centralized values used across the app.
   ============================================ */

import type { ExpenseCategory } from "../models/types";

/**
 * Category configuration.
 * Maps each category to its display name and color.
 * Colors are used in charts, icons, and badges.
 */
export const CATEGORY_CONFIG: Record<
  ExpenseCategory,
  {
    label: string;
    color: string;
    lightBg: string;
  }
> = {
  food: {
    label: "Food",
    color: "#EF9F27",
    lightBg: "var(--color-warning-light)",
  },
  transport: {
    label: "Transport",
    color: "#378ADD",
    lightBg: "var(--color-info-light)",
  },
  shopping: {
    label: "Shopping",
    color: "#1D9E75",
    lightBg: "var(--color-success-light)",
  },
  bills: {
    label: "Bills",
    color: "#E24B4A",
    lightBg: "var(--color-danger-light)",
  },
  entertainment: {
    label: "Entertainment",
    color: "#7F77DD",
    lightBg: "#EEEDFE",
  },
  health: { label: "Health", color: "#D4537E", lightBg: "#FBEAF0" },
  education: { label: "Education", color: "#5DCAA5", lightBg: "#E1F5EE" },
  other: {
    label: "Other",
    color: "#888780",
    lightBg: "var(--color-bg-secondary, #F1EFE8)",
  },
};

/**
 * Number of recent expenses to show on Dashboard.
 */
export const DASHBOARD_RECENT_EXPENSES_COUNT = 5;
