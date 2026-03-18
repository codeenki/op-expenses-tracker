/* ============================================
   DASHBOARD PAGE
   Main overview page. Cash on hand now
   calculates from cash-type accounts.
   ============================================ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import {
  type Transaction,
  type Account,
  type RecurringPayment,
  type CategorySummary,
  type Card,
} from "../models/types";
import { formatCurrency } from "../utils/formatters";
import { DASHBOARD_RECENT_EXPENSES_COUNT } from "../constants/categories";
import StatCard from "../components/common/StatCard";
import DashboardCard from "../components/common/DashboardCard";
import RecentExpenses from "../components/dashboard/RecentExpenses";
import SpendingChart from "../components/dashboard/SpendingChart";
import AccountsOverview from "../components/dashboard/AccountsOverview";
import UpcomingPayments from "../components/dashboard/UpcomingPayments";
import QuickAddModal, {
  type QuickAddData,
} from "../components/transactions/QuickAddModal";
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
    sourceId: "cash-1",
    sourceName: "Wallet",
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
    sourceId: "cash-1",
    sourceName: "Wallet",
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
    includeInGlobalBalance: true,
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
    includeInGlobalBalance: true,
  },
  {
    id: "cash-1",
    name: "Wallet",
    bankInstitution: "",
    country: "",
    currency: "USD",
    type: "cash",
    initialBalance: 34000,
    balance: 34000,
    tags: [],
    visibility: "private",
    status: "active",
    location: "Wallet",
    includeInGlobalBalance: true,
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
  return accounts
    .filter((a) => a.status === "active" && a.includeInGlobalBalance)
    .reduce((sum, acc) => sum + acc.balance, 0);
}

function calculateCreditDebt(accounts: Card[]): number {
  return accounts
    .filter(
      (acc) =>
        acc.type === "credit" &&
        acc.status === "active" &&
        acc.includeInGlobalBalance,
    )
    .reduce((sum, acc) => sum + Math.abs(acc.currentBalance), 0);
}

function getCreditCardCount(accounts: Card[]): number {
  return accounts.filter(
    (acc) => acc.currentBalance < 0 && acc.status === "active",
  ).length;
}

function calculateCashBalance(accounts: Account[]): number {
  return accounts
    .filter(
      (a) =>
        a.type === "cash" && a.status === "active" && a.includeInGlobalBalance,
    )
    .reduce((sum, a) => sum + a.balance, 0);
}

/* ---------- Component ---------- */

export default function Dashboard() {
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const navigate = useNavigate();
  const MOCK_CARDS_FOR_MODAL: Card[] = [
    {
      id: "1",
      name: "Visa Gold",
      type: "credit",
      network: "visa",
      bank: "BAC",
      lastFourDigits: "4521",
      associatedAccountId: "1",
      status: "active",
      creditLimit: 500000,
      currentBalance: -83050,
      statementClosingDate: "2026-03-20",
      paymentDueDate: "2026-03-25",
      includeInGlobalBalance: true,
    },
    {
      id: "2",
      name: "Mastercard Platinum",
      type: "credit",
      network: "mastercard",
      bank: "BCR",
      lastFourDigits: "8832",
      status: "active",
      creditLimit: 300000,
      currentBalance: -40000,
      statementClosingDate: "2026-04-05",
      paymentDueDate: "2026-04-15",
      includeInGlobalBalance: false,
    },
  ];
  const globalBalance = calculateGlobalBalance(MOCK_ACCOUNTS);
  const creditDebt = calculateCreditDebt(MOCK_CARDS_FOR_MODAL);
  const creditCardCount = getCreditCardCount(MOCK_CARDS_FOR_MODAL);
  const cashBalance = calculateCashBalance(MOCK_ACCOUNTS);
  const cashAccountCount = MOCK_ACCOUNTS.filter(
    (a) => a.type === "cash" && a.status === "active",
  ).length;

  const recentTransactions = MOCK_TRANSACTIONS.filter(
    (t) => t.type === "expense",
  ).slice(0, DASHBOARD_RECENT_EXPENSES_COUNT);

  function handleQuickExpense() {
    setIsQuickAddOpen(true);
  }

  function handleQuickAdd(data: QuickAddData) {
    console.log("Quick add from dashboard:", data);
    // TODO: Will connect to shared state/API in Phase 3
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
            cashAccountCount > 0
              ? `${cashAccountCount} cash account${cashAccountCount > 1 ? "s" : ""}`
              : "Add a cash account to track"
          }
          subtitleType="neutral"
        />
      </div>

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

        <QuickAddModal
          isOpen={isQuickAddOpen}
          accounts={MOCK_ACCOUNTS}
          cards={MOCK_CARDS_FOR_MODAL}
          onClose={() => setIsQuickAddOpen(false)}
          onSubmit={handleQuickAdd}
        />
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
