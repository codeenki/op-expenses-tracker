/* ============================================
   DATA MODELS
   TypeScript interfaces for all entities.
   All monetary values are in cents (integers)
   to avoid floating point precision issues.
   ============================================ */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  primaryCurrency: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number; // in cents
  currency: string;
}

export type AccountType =
  | "checking"
  | "savings"
  | "credit_card"
  | "debit_card"
  | "cash";

export interface Expense {
  id: string;
  title: string;
  amount: number; // in cents, always positive
  category: ExpenseCategory;
  date: string; // ISO string
  accountId?: string; // null = global expense
  notes?: string;
}

export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "education"
  | "other";

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number; // in cents
  frequency: "weekly" | "biweekly" | "monthly";
  nextDueDate: string; // ISO string
  category: ExpenseCategory;
  accountId?: string;
}

export interface CategorySummary {
  category: ExpenseCategory;
  total: number; // in cents
  percentage: number;
}
