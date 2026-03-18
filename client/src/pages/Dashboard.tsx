/* ============================================
   DASHBOARD PAGE
   Main overview page composing stat cards,
   recent transactions, spending chart, accounts,
   and upcoming payments.

   Currently uses mock data. Will connect to
   the API in Phase 3.
   ============================================ */

import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import {
  type Transaction,
  type Account,
  type RecurringPayment,
  type CategorySummary,
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

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    title: "Lunch — Soda El Parque",
    description: "Casado with chicken",
    amount: 850,
    currency: "USD",
    date: "2026-03-18T12:34:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "expense",
    category: "food",
    tags: ["Lunch", "Work"],
    recurrence: "none",
  },
  {
    id: "2",
    title: "Bus fare",
    amount: 125,
    currency: "USD",
    date: "2026-03-18T08:10:00",
    sourceType: "cash",
    sourceName: "Cash",
    type: "expense",
    category: "transport",
    tags: [],
    recurrence: "none",
  },
  {
    id: "3",
    title: "Amazon — USB cable",
    amount: 1299,
    currency: "USD",
    date: "2026-03-17T15:00:00",
    sourceType: "credit_card",
    sourceId: "1",
    sourceName: "Visa ••4521",
    type: "expense",
    category: "shopping",
    tags: ["Tech"],
    recurrence: "none",
  },
  {
    id: "4",
    title: "Electricity bill",
    amount: 4500,
    currency: "USD",
    date: "2026-03-15T09:00:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "expense",
    category: "bills",
    tags: [],
    recurrence: "monthly",
  },
  {
    id: "5",
    title: "Coffee — Starbucks",
    amount: 575,
    currency: "USD",
    date: "2026-03-14T07:45:00",
    sourceType: "cash",
    sourceName: "Cash",
    type: "expense",
    category: "food",
    tags: [],
    recurrence: "none",
  },
];

const MOCK_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "BAC Checking",
    bankInstitution: "BAC San José",
    country: "Costa Rica",
    currency: "USD",
    type: "checking",
    initialBalance: 750000,
    balance: 820000,
    tags: ["Primary"],
    visibility: "private",
    status: "active",
  },
  {
    id: "2",
    name: "BCR Savings",
    bankInstitution: "BCR",
    country: "Costa Rica",
    currency: "USD",
    type: "savings",
    initialBalance: 300000,
    balance: 391000,
    interestRate: 4.5,
    tags: [],
    visibility: "private",
    status: "active",
  },
  {
    id: "3",
    name: "Visa Gold",
    bankInstitution: "BAC",
    country: "Costa Rica",
    currency: "USD",
    type: "checking",
    initialBalance: 0,
    balance: -83050,
    tags: [],
    visibility: "private",
    status: "active",
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
    .filter((acc) => acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);
}

function getCreditCardCount(accounts: Account[]): number {
  return accounts.filter((acc) => acc.balance < 0).length;
}

function getCashBalance(): number {
  /* Cash balance would come from a dedicated cash entity in the future */
  return 34000;
}

/* ---------- Component ---------- */

export default function Dashboard() {
  const navigate = useNavigate();

  const globalBalance = calculateGlobalBalance(MOCK_ACCOUNTS);
  const creditDebt = calculateCreditDebt(MOCK_ACCOUNTS);
  const creditCardCount = getCreditCardCount(MOCK_ACCOUNTS);
  const cashBalance = getCashBalance();

  const recentTransactions = MOCK_TRANSACTIONS.filter(
    (t) => t.type === "expense",
  ).slice(0, DASHBOARD_RECENT_EXPENSES_COUNT);

  function handleQuickExpense() {
    /* TODO: Open quick expense modal */
    console.log("Open quick expense modal");
  }

  function handleNavigateTransactions() {
    navigate(ROUTES.TRANSACTIONS);
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
            onClick={handleNavigateTransactions}
          >
            View all transactions
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

      {/* Middle row: transactions + chart */}
      <div className="dashboard-gridMain">
        <DashboardCard
          title="Recent expenses"
          actionLabel="See all"
          onAction={handleNavigateTransactions}
        >
          <RecentExpenses
            transactions={recentTransactions}
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
