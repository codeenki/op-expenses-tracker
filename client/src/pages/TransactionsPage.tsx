/* ============================================
   TRANSACTIONS PAGE
   Full transaction management page with chart,
   filters, list, detail modal, and add modals.
   ============================================ */

import { useState, useMemo } from "react";
import { type Transaction, type Account, type Card } from "../models/types";
import { formatCurrency } from "../utils/formatters";
import StatCard from "../components/common/StatCard";
import TransactionChart from "../components/transactions/TransactionChart";
import TransactionFilters, {
  type FilterState,
} from "../components/transactions/TransactionFilters";
import TransactionList from "../components/transactions/TransactionList";
import TransactionDetailModal from "../components/transactions/TransactionDetailModal";
import AddTransactionModal, {
  type TransactionFormData,
} from "../components/transactions/AddTransactionModal";
import QuickAddModal, {
  type QuickAddData,
} from "../components/transactions/QuickAddModal";
import "./TransactionsPage.css";
import EditTransactionModal from "../components/transactions/EditTransactionModal";
/* ---------- Mock Data ---------- */

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
];

const MOCK_CARDS: Card[] = [
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
  },
];

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
    title: "Salary deposit",
    amount: 320000,
    currency: "USD",
    date: "2026-03-15T09:00:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "income",
    category: "salary",
    tags: [],
    recurrence: "monthly",
  },
  {
    id: "5",
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
    id: "6",
    title: "Transfer to BCR Savings",
    amount: 50000,
    currency: "USD",
    date: "2026-03-14T10:00:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "transfer",
    category: "transfer",
    tags: [],
    recurrence: "none",
    transferToId: "2",
    transferToName: "BCR Savings",
  },
  {
    id: "7",
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
  {
    id: "8",
    title: "Netflix subscription",
    amount: 1599,
    currency: "USD",
    date: "2026-03-12T00:00:00",
    sourceType: "credit_card",
    sourceId: "1",
    sourceName: "Visa ••4521",
    type: "expense",
    category: "entertainment",
    tags: ["Streaming"],
    recurrence: "monthly",
  },
  {
    id: "9",
    title: "Gym membership",
    amount: 2500,
    currency: "USD",
    date: "2026-03-10T14:30:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "expense",
    category: "health",
    tags: [],
    recurrence: "monthly",
  },
  {
    id: "10",
    title: "Grocery shopping",
    description: "Weekly groceries at AutoMercado",
    amount: 3450,
    currency: "USD",
    date: "2026-03-08T12:00:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "expense",
    category: "food",
    tags: ["Groceries"],
    recurrence: "none",
  },
  {
    id: "11",
    title: "Freelance payment",
    description: "Web development for Client A",
    amount: 15000,
    currency: "USD",
    date: "2026-03-05T09:00:00",
    sourceType: "account",
    sourceId: "1",
    sourceName: "BAC Checking",
    type: "income",
    category: "freelance",
    tags: ["Client A"],
    recurrence: "none",
  },
  {
    id: "12",
    title: "Movie tickets",
    amount: 800,
    currency: "USD",
    date: "2026-03-03T18:00:00",
    sourceType: "cash",
    sourceName: "Cash",
    type: "expense",
    category: "entertainment",
    tags: [],
    recurrence: "none",
  },
];

/* ---------- Component ---------- */

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateRange: "",
    category: "",
    source: "",
    type: "",
  });
  const [selectedMonth, setSelectedMonth] = useState("2026-03");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  /* ---------- Filtering ---------- */

  const filteredTransactions = useMemo(() => {
    let result = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          (t.description && t.description.toLowerCase().includes(search)) ||
          t.tags.some((tag) => tag.toLowerCase().includes(search)),
      );
    }

    if (filters.dateRange) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (filters.dateRange === "today") {
        result = result.filter((t) => new Date(t.date) >= today);
      } else if (filters.dateRange === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        result = result.filter((t) => new Date(t.date) >= weekAgo);
      } else if (filters.dateRange === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        result = result.filter((t) => new Date(t.date) >= monthStart);
      }
    }

    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    return result;
  }, [transactions, filters]);

  /* ---------- Stats ---------- */

  const monthlyExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(selectedMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = transactions
    .filter((t) => t.type === "income" && t.date.startsWith(selectedMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyTxCount = transactions.filter((t) =>
    t.date.startsWith(selectedMonth),
  ).length;

  const daysInMonth = new Date(
    Number(selectedMonth.split("-")[0]),
    Number(selectedMonth.split("-")[1]),
    0,
  ).getDate();
  const currentDay = Math.min(new Date().getDate(), daysInMonth);
  const dailyAverage =
    currentDay > 0 ? Math.round(monthlyExpenses / currentDay) : 0;

  /* ---------- Handlers ---------- */

  function handleRowClick(transaction: Transaction) {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  }

  function handleEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsDetailOpen(false);
    setIsEditOpen(true);
  }

  function handleSaveEdit(updated: Transaction) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t)),
    );
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function getSourceName(key: string): string {
    if (key === "cash") return "Cash";
    const [type, id] = key.split("-");
    if (type === "account") {
      const acc = MOCK_ACCOUNTS.find((a) => a.id === id);
      return acc ? acc.name : "Unknown";
    }
    if (type === "card") {
      const card = MOCK_CARDS.find((c) => c.id === id);
      return card ? `${card.name} (••${card.lastFourDigits})` : "Unknown";
    }
    return "Unknown";
  }

  function handleAddTransaction(data: TransactionFormData) {
    const newTx: Transaction = {
      id: String(Date.now()),
      title: data.title,
      description: data.description || undefined,
      amount: Math.round(Number(data.amount) * 100),
      currency: data.currency,
      date: new Date(data.date).toISOString(),
      sourceType:
        data.sourceKey === "cash"
          ? "cash"
          : data.sourceKey.startsWith("card")
            ? "credit_card"
            : "account",
      sourceId:
        data.sourceKey === "cash" ? undefined : data.sourceKey.split("-")[1],
      sourceName: getSourceName(data.sourceKey),
      type: data.type,
      category: data.type === "transfer" ? "transfer" : data.category,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      recurrence: data.recurrence,
      notes: data.notes || undefined,
      transferToId: data.transferToKey
        ? data.transferToKey.split("-")[1]
        : undefined,
      transferToName: data.transferToKey
        ? getSourceName(data.transferToKey)
        : undefined,
    };
    setTransactions((prev) => [newTx, ...prev]);
  }

  function handleQuickAdd(data: QuickAddData) {
    const newTx: Transaction = {
      id: String(Date.now()),
      title: data.title,
      amount: Math.round(Number(data.amount) * 100),
      currency: data.currency,
      date: new Date().toISOString(),
      sourceType:
        data.sourceKey === "cash"
          ? "cash"
          : data.sourceKey.startsWith("card")
            ? "credit_card"
            : "account",
      sourceId:
        data.sourceKey === "cash" ? undefined : data.sourceKey.split("-")[1],
      sourceName: getSourceName(data.sourceKey),
      type: data.type,
      category: data.type === "transfer" ? "transfer" : data.category,
      tags: [],
      recurrence: "none",
    };
    setTransactions((prev) => [newTx, ...prev]);
  }

  const availableMonths = ["2026-03", "2026-02", "2026-01"];

  return (
    <div className="txPage">
      <div className="txPage-header">
        <div>
          <h2 className="txPage-title">Transactions</h2>
          <p className="txPage-subtitle">
            Track and manage all your transactions
          </p>
        </div>
        <div className="txPage-actions">
          <button
            className="txPage-btnPrimary"
            onClick={() => setIsAddOpen(true)}
          >
            <PlusIcon /> Add transaction
          </button>
          <button
            className="txPage-btnOutline"
            onClick={() => setIsQuickAddOpen(true)}
          >
            Quick add
          </button>
        </div>
      </div>

      <div className="txPage-stats">
        <StatCard
          label="Spent this month"
          value={formatCurrency(monthlyExpenses)}
          subtitle={`${monthlyTxCount} transactions`}
          subtitleType="negative"
        />
        <StatCard
          label="Income this month"
          value={formatCurrency(monthlyIncome)}
          subtitle={`${transactions.filter((t) => t.type === "income" && t.date.startsWith(selectedMonth)).length} transactions`}
          subtitleType="positive"
        />
        <StatCard
          label="Daily average"
          value={formatCurrency(dailyAverage)}
          subtitle={`Based on ${currentDay} days`}
        />
      </div>

      <TransactionChart
        transactions={transactions}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        availableMonths={availableMonths}
      />

      <TransactionFilters filters={filters} onFilterChange={setFilters} />

      <TransactionList
        transactions={filteredTransactions}
        onRowClick={handleRowClick}
        onAddTransaction={() => setIsAddOpen(true)}
      />

      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddTransactionModal
        isOpen={isAddOpen}
        accounts={MOCK_ACCOUNTS}
        cards={MOCK_CARDS}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddTransaction}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        accounts={MOCK_ACCOUNTS}
        cards={MOCK_CARDS}
        onClose={() => setIsQuickAddOpen(false)}
        onSubmit={handleQuickAdd}
      />

      <EditTransactionModal
        transaction={editingTransaction}
        isOpen={isEditOpen}
        accounts={MOCK_ACCOUNTS}
        cards={MOCK_CARDS}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveEdit}
      />
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
