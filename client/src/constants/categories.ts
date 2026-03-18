/* ============================================
   APP CONSTANTS — CATEGORIES
   Centralized category config used across the app.
   Now includes income and transfer categories.
   ============================================ */

import { type TransactionCategory } from "../models/types";

export const CATEGORY_CONFIG: Record<
  TransactionCategory,
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
  salary: {
    label: "Salary",
    color: "#2ecc71",
    lightBg: "var(--color-success-light)",
  },
  freelance: {
    label: "Freelance",
    color: "#1D9E75",
    lightBg: "var(--color-success-light)",
  },
  investment_income: {
    label: "Investment",
    color: "#378ADD",
    lightBg: "var(--color-info-light)",
  },
  transfer: {
    label: "Transfer",
    color: "#378ADD",
    lightBg: "var(--color-info-light)",
  },
  other: {
    label: "Other",
    color: "#888780",
    lightBg: "var(--color-bg-secondary, #F1EFE8)",
  },
};

/**
 * Category options grouped by transaction type for form selectors.
 */
export const EXPENSE_CATEGORIES: TransactionCategory[] = [
  "food",
  "transport",
  "shopping",
  "bills",
  "entertainment",
  "health",
  "education",
  "other",
];

export const INCOME_CATEGORIES: TransactionCategory[] = [
  "salary",
  "freelance",
  "investment_income",
  "other",
];

export const TRANSFER_CATEGORIES: TransactionCategory[] = ["transfer"];

/**
 * Recurrence options for display.
 */
export const RECURRENCE_OPTIONS = [
  { value: "none", label: "One-time" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
] as const;

/**
 * Number of recent expenses to show on Dashboard.
 */
export const DASHBOARD_RECENT_EXPENSES_COUNT = 5;
