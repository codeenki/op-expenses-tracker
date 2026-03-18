/* ============================================
   DASHBOARD PAGE
   Main overview page composing stat cards,
   recent expenses, spending chart, accounts,
   and upcoming payments.

   Currently uses mock data. Will connect to
   the API in Phase 3.
   ============================================ */

import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import type {
  Expense,
  Account,
  RecurringPayment,
  CategorySummary,
} from "../models/types";
import { formatCurrency } from "../utils/formatters";
import { DASHBOARD_RECENT_EXPENSES_COUNT } from "../constants/categories";
import StatCard from "../components/common/StatCard";
import DashboardCard from "../components/common/DashboardCard";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import SpendingChart from "../components/dashboard/SpendingChart";
import AccountsOverview from "../components/dashboard/AccountsOverview";
import UpcomingPayments from "../components/dashboard/UpcomingPayments";
import "./Dashboard.css";

/* ---------- Mock Data ---------- */
/*
 * This mock data lets us build and test the UI
 * before the backend exists. We'll replace this
 * with real API calls in Phase 3.
 *
 * Set any array to [] to see the empty states.
 */

const MOCK_EXPENSES: Expense[] = [
  {
    id: "1",
    title: "Lunch — Soda El Parque",
    amount: 850,
    category: "food",
    date: "2026-03-18T12:34:00",
  },
  {
    id: "2",
    title: "Bus fare",
    amount: 125,
    category: "transport",
    date: "2026-03-18T08:10:00",
  },
  {
    id: "3",
    title: "Amazon — USB cable",
    amount: 1299,
    category: "shopping",
    date: "2026-03-17T15:00:00",
  },
  {
    id: "4",
    title: "Electricity bill",
    amount: 4500,
    category: "bills",
    date: "2026-03-15T09:00:00",
  },
  {
    id: "5",
    title: "Coffee — Starbucks",
    amount: 575,
    category: "food",
    date: "2026-03-14T07:45:00",
  },
];

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "BAC Checking",
    type: "checking",
    balance: 820000,
    currency: "USD",
  },
  {
    id: "2",
    name: "BCR Savings",
    type: "savings",
    balance: 391000,
    currency: "USD",
  },
  {
    id: "3",
    name: "Visa Gold",
    type: "credit_card",
    balance: -83050,
    currency: "USD",
  },
];

const MOCK_PAYMENTS: RecurringPayment[] = [
  {
    id: "1",
    name: "Netflix",
    amount: 1599,
    frequency: "monthly",
    nextDueDate: "2026-03-22",
    category: "entertainment",
  },
  {
    id: "2",
    name: "Internet — Kolbi",
    amount: 3500,
    frequency: "monthly",
    nextDueDate: "2026-03-28",
    category: "bills",
  },
  {
    id: "3",
    name: "Gym membership",
    amount: 2500,
    frequency: "monthly",
    nextDueDate: "2026-04-01",
    category: "health",
  },
];

const MOCK_SPENDING: CategorySummary[] = [
  { category: "food", total: 18500, percentage: 36 },
  { category: "transport", total: 8200, percentage: 16 },
  { category: "shopping", total: 11300, percentage: 22 },
  { category: "bills", total: 9200, percentage: 18 },
  { category: "other", total: 4100, percentage: 8 },
];

/* ---------- Computed values ---------- */

function calculateGlobalBalance(accounts: Account[]): number {
  return accounts.reduce((sum, acc) => sum + acc.balance, 0);
}

function calculateCreditDebt(accounts: Account[]): number {
  return accounts
    .filter((acc) => acc.type === "credit_card" && acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);
}

function getCreditCardCount(accounts: Account[]): number {
  return accounts.filter((acc) => acc.type === "credit_card").length;
}

function getCashBalance(accounts: Account[]): number {
  return accounts
    .filter((acc) => acc.type === "cash")
    .reduce((sum, acc) => sum + acc.balance, 0);
}

/* ---------- Component ---------- */

export default function Dashboard() {
  const navigate = useNavigate();

  const globalBalance = calculateGlobalBalance(MOCK_ACCOUNTS);
  const creditDebt = calculateCreditDebt(MOCK_ACCOUNTS);
  const creditCardCount = getCreditCardCount(MOCK_ACCOUNTS);
  const cashBalance = getCashBalance(MOCK_ACCOUNTS);

  const recentExpenses = MOCK_EXPENSES.slice(
    0,
    DASHBOARD_RECENT_EXPENSES_COUNT,
  );

  function handleQuickExpense() {
    // TODO: Open quick expense modal
    console.log("Open quick expense modal");
  }

  function handleNavigateExpenses() {
    navigate(ROUTES.EXPENSES);
  }

  function handleNavigateAccounts() {
    navigate(ROUTES.ACCOUNTS);
  }

  function handleNavigateIncome() {
    navigate(ROUTES.INCOME);
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h2 className="dashboard-greeting">Welcome back, Luis</h2>
        <div className="dashboard-actions">
          <button className="dashboard-btnPrimary" onClick={handleQuickExpense}>
            <PlusIcon />
            Quick expense
          </button>
          <button
            className="dashboard-btnOutline"
            onClick={handleNavigateExpenses}
          >
            View all expenses
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="dashboard-stats">
        <StatCard
          label="Global balance"
          value={formatCurrency(globalBalance)}
          subtitle={
            globalBalance > 0
              ? "+2.4% from last month"
              : "Add an account to get started"
          }
          subtitleType={globalBalance > 0 ? "positive" : "neutral"}
        />
        <StatCard
          label="Credit card debt"
          value={formatCurrency(creditDebt)}
          subtitle={
            creditCardCount > 0
              ? `Across ${creditCardCount} card${creditCardCount > 1 ? "s" : ""}`
              : "No credit cards added"
          }
          subtitleType={creditDebt > 0 ? "negative" : "neutral"}
        />
        <StatCard
          label="Cash on hand"
          value={formatCurrency(cashBalance)}
          subtitle={
            cashBalance > 0
              ? "Updated today"
              : "Set your cash balance in settings"
          }
          subtitleType="neutral"
        />
      </div>

      {/* Middle row: expenses + chart */}
      <div className="dashboard-gridMain">
        <DashboardCard
          title="Recent expenses"
          actionLabel="See all"
          onAction={handleNavigateExpenses}
        >
          <RecentExpenses
            expenses={recentExpenses}
            onAddExpense={handleQuickExpense}
          />
        </DashboardCard>

        <DashboardCard title="Spending by category">
          <SpendingChart data={MOCK_SPENDING} />
        </DashboardCard>
      </div>

      {/* Bottom row: accounts + payments */}
      <div className="dashboard-gridBottom">
        <DashboardCard
          title="Accounts"
          actionLabel="Manage"
          onAction={handleNavigateAccounts}
        >
          <AccountsOverview
            accounts={MOCK_ACCOUNTS}
            onAddAccount={handleNavigateAccounts}
          />
        </DashboardCard>

        <DashboardCard
          title="Upcoming payments"
          actionLabel="Manage"
          onAction={handleNavigateIncome}
        >
          <UpcomingPayments
            payments={MOCK_PAYMENTS}
            onAddPayment={handleNavigateIncome}
          />
        </DashboardCard>
      </div>
    </div>
  );
}

/* ---------- Icons ---------- */

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M7 1v12M1 7h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
