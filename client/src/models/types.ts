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

/* ---------- Accounts ---------- */

export interface Account {
  id: string;
  name: string;
  bankInstitution: string;
  country: string;
  currency: string;
  type: AccountType;
  initialBalance: number; // in cents
  balance: number; // in cents, calculated
  interestRate?: number; // annual percentage, optional
  tags: string[];
  visibility: Visibility;
  status: EntityStatus;
}

export type AccountType = "checking" | "savings" | "investment" | "enterprise";

export type Visibility = "private" | "shared" | "public";

export type EntityStatus = "active" | "inactive" | "closed";

/* ---------- Cards ---------- */

export interface Card {
  id: string;
  name: string;
  type: CardType;
  network: CardNetwork;
  bank: string;
  lastFourDigits: string;
  associatedAccountId?: string;
  status: EntityStatus;
  creditLimit?: number; // in cents, credit cards only
  currentBalance: number; // in cents, negative = debt
  statementClosingDate?: string; // day of month as ISO string
  paymentDueDate?: string; // day of month as ISO string
}

export type CardType = "credit" | "debit";

export type CardNetwork = "visa" | "mastercard" | "amex" | "other";

/* ---------- Expenses ---------- */

export interface Expense {
  id: string;
  title: string;
  amount: number; // in cents, always positive
  category: ExpenseCategory;
  date: string; // ISO string
  accountId?: string; // null = global expense
  cardId?: string; // if paid with a card
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

/* ---------- Recurring Payments ---------- */

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number; // in cents
  frequency: "weekly" | "biweekly" | "monthly";
  nextDueDate: string; // ISO string
  category: ExpenseCategory;
  accountId?: string;
}

/* ---------- Analytics ---------- */

export interface CategorySummary {
  category: ExpenseCategory;
  total: number; // in cents
  percentage: number;
}
