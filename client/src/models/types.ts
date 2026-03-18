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
  initialBalance: number;
  balance: number;
  interestRate?: number;
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
  creditLimit?: number;
  currentBalance: number;
  statementClosingDate?: string;
  paymentDueDate?: string;
}

export type CardType = "credit" | "debit";

export type CardNetwork = "visa" | "mastercard" | "amex" | "other";

/* ---------- Transactions ---------- */

export interface Transaction {
  id: string;
  title: string; // short name, required (shown in lists)
  description?: string; // optional longer notes
  amount: number; // in cents, always positive
  currency: string;
  date: string; // ISO string
  sourceType: TransactionSource;
  sourceId?: string;
  sourceName: string;
  type: TransactionType;
  category: TransactionCategory;
  tags: string[];
  recurrence: Recurrence;
  notes?: string;
  transferToId?: string;
  transferToName?: string;
  attachmentUrl?: string; // future: receipt photo or bill PDF
}

export type TransactionType = "expense" | "income" | "transfer";

export type TransactionSource = "account" | "credit_card" | "cash";

export type Recurrence = "none" | "weekly" | "biweekly" | "monthly";

export type TransactionCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "education"
  | "salary"
  | "freelance"
  | "investment_income"
  | "transfer"
  | "other";

/* ---------- Recurring Payments ---------- */

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: "weekly" | "biweekly" | "monthly";
  nextDueDate: string;
  category: TransactionCategory;
  accountId?: string;
}

/* ---------- Analytics ---------- */

export interface CategorySummary {
  category: TransactionCategory;
  total: number;
  percentage: number;
}
