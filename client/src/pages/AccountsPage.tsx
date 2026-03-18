/* ============================================
   ACCOUNTS & CARDS PAGE
   Tab-based page showing accounts and cards
   with add modals and expandable rows.

   Currently uses mock data. Will connect to
   the API in Phase 3.
   ============================================ */

import { useState } from "react";
import { type Account, type Card } from "../models/types";
import { formatCurrency } from "../utils/formatters";
import StatCard from "../components/common/StatCard";
import EmptyState from "../components/common/EmptyState";
import Tabs from "../components/common/Tabs";
import AccountRow from "../components/accounts/AccountRow";
import CardRow from "../components/accounts/CardRow";
import AddAccountModal from "../components/accounts/AddAccountModal";
import AddCardModal from "../components/accounts/AddCardModal";
import { type AccountFormData } from "../components/accounts/AddAccountModal";
import { type CardFormData } from "../components/accounts/AddCardModal";
import { getDaysUntil } from "../utils/formatters";
import { detectCardNetwork } from "../constants/accounts";
import "./AccountsPage.css";
import EditAccountModal from "../components/accounts/EditAccountModal";
import EditCardModal from "../components/accounts/EditCardModal";

/* ---------- Mock Data ---------- */

const INITIAL_ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "BAC Checking",
    bankInstitution: "BAC San José",
    country: "Costa Rica",
    currency: "USD",
    type: "checking",
    initialBalance: 750000,
    balance: 820000,
    interestRate: undefined,
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

const INITIAL_CARDS: Card[] = [
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
  {
    id: "2",
    name: "Mastercard Platinum",
    type: "credit",
    network: "mastercard",
    bank: "BCR",
    lastFourDigits: "8832",
    associatedAccountId: undefined,
    status: "active",
    creditLimit: 300000,
    currentBalance: -40000,
    statementClosingDate: "2026-04-05",
    paymentDueDate: "2026-04-15",
  },
];

/* ---------- Tab config ---------- */

const PAGE_TABS = [
  { id: "accounts", label: "Accounts" },
  { id: "cards", label: "Cards" },
];

/* ---------- Component ---------- */

export default function AccountsPage() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  /* ---------- Account calculations ---------- */
  const totalBalance = accounts
    .filter((a) => a.status === "active")
    .reduce((sum, a) => sum + a.balance, 0);

  const savingsBalance = accounts
    .filter((a) => a.type === "savings" && a.status === "active")
    .reduce((sum, a) => sum + a.balance, 0);

  const activeAccountCount = accounts.filter(
    (a) => a.status === "active",
  ).length;
  const inactiveAccountCount = accounts.filter(
    (a) => a.status !== "active",
  ).length;

  /* ---------- Card calculations ---------- */
  const totalDebt = cards
    .filter((c) => c.type === "credit" && c.status === "active")
    .reduce((sum, c) => sum + Math.abs(c.currentBalance), 0);

  const totalCreditLimit = cards
    .filter((c) => c.type === "credit" && c.status === "active")
    .reduce((sum, c) => sum + (c.creditLimit || 0), 0);

  const totalAvailable = totalCreditLimit - totalDebt;

  const nextPaymentCard = cards
    .filter((c) => c.paymentDueDate && c.status === "active")
    .sort(
      (a, b) =>
        new Date(a.paymentDueDate!).getTime() -
        new Date(b.paymentDueDate!).getTime(),
    )[0];

  const nextPaymentDate = nextPaymentCard?.paymentDueDate
    ? new Date(nextPaymentCard.paymentDueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "—";

  const nextPaymentUrgency = nextPaymentCard?.paymentDueDate
    ? getDaysUntil(nextPaymentCard.paymentDueDate)
    : null;

  /* ---------- Handlers ---------- */

  function handleAddAccount(data: AccountFormData) {
    const newAccount: Account = {
      id: String(Date.now()),
      name: data.name,
      bankInstitution: data.bankInstitution,
      country: data.country,
      currency: data.currency,
      type: data.type,
      initialBalance: Math.round(Number(data.initialBalance) * 100),
      balance: Math.round(Number(data.initialBalance) * 100),
      interestRate: data.interestRate ? Number(data.interestRate) : undefined,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      visibility: data.visibility,
      status: "active",
    };
    setAccounts((prev) => [...prev, newAccount]);
  }

  function handleAddCard(data: CardFormData) {
    const newCard: Card = {
      id: String(Date.now()),
      name: data.name,
      type: data.type,
      network: detectCardNetwork(data.firstDigit),
      bank: data.bank,
      lastFourDigits: data.lastFourDigits,
      associatedAccountId: data.associatedAccountId || undefined,
      status: "active",
      creditLimit: data.creditLimit
        ? Math.round(Number(data.creditLimit) * 100)
        : undefined,
      currentBalance: data.currentBalance
        ? -Math.round(Number(data.currentBalance) * 100)
        : 0,
      statementClosingDate: data.statementClosingDate || undefined,
      paymentDueDate: data.paymentDueDate || undefined,
    };
    setCards((prev) => [...prev, newCard]);
  }

  function handleEditAccount(id: string) {
    const account = accounts.find((a) => a.id === id);
    if (account) {
      setEditingAccount(account);
      setIsEditAccountOpen(true);
    }
  }

  function handleSaveAccount(updated: Account) {
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  function handleDeactivateAccount(id: string) {
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                a.status === "active"
                  ? ("inactive" as const)
                  : ("active" as const),
            }
          : a,
      ),
    );
  }

  function handleEditCard(id: string) {
    const card = cards.find((c) => c.id === id);
    if (card) {
      setEditingCard(card);
      setIsEditCardOpen(true);
    }
  }

  function handleSaveCard(updated: Card) {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function handleDeactivateCard(id: string) {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status:
                c.status === "active"
                  ? ("inactive" as const)
                  : ("active" as const),
            }
          : c,
      ),
    );
  }

  function handleAddClick() {
    if (activeTab === "accounts") {
      setIsAddAccountOpen(true);
    } else {
      setIsAddCardOpen(true);
    }
  }

  return (
    <div className="accountsPage">
      {/* Header */}
      <div className="accountsPage-header">
        <div>
          <h2 className="accountsPage-title">Accounts & cards</h2>
          <p className="accountsPage-subtitle">
            Manage your bank accounts and payment cards
          </p>
        </div>
        <button className="accountsPage-addBtn" onClick={handleAddClick}>
          <PlusIcon />
          {activeTab === "accounts" ? "Add account" : "Add card"}
        </button>
      </div>

      {/* Tabs */}
      <Tabs tabs={PAGE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Accounts tab */}
      {activeTab === "accounts" && (
        <>
          <div className="accountsPage-stats">
            <StatCard
              label="Total balance"
              value={formatCurrency(totalBalance)}
              subtitle={`Across ${activeAccountCount} account${activeAccountCount !== 1 ? "s" : ""}`}
            />
            <StatCard
              label="Savings"
              value={formatCurrency(savingsBalance)}
              subtitle={`${accounts.filter((a) => a.type === "savings").length} savings account${accounts.filter((a) => a.type === "savings").length !== 1 ? "s" : ""}`}
            />
            <StatCard
              label="Active accounts"
              value={String(activeAccountCount)}
              subtitle={`${inactiveAccountCount} inactive`}
            />
          </div>

          {accounts.length === 0 ? (
            <EmptyState
              icon={<AccountEmptyIcon />}
              message="No accounts added yet. Add your first bank account to start tracking your finances."
              actionLabel="Add account"
              onAction={() => setIsAddAccountOpen(true)}
            />
          ) : (
            accounts.map((account) => (
              <AccountRow
                key={account.id}
                account={account}
                onEdit={handleEditAccount}
                onDeactivate={handleDeactivateAccount}
              />
            ))
          )}
        </>
      )}

      {/* Cards tab */}
      {activeTab === "cards" && (
        <>
          <div className="accountsPage-stats">
            <StatCard
              label="Total credit debt"
              value={formatCurrency(totalDebt)}
              subtitle={`Across ${cards.filter((c) => c.type === "credit").length} card${cards.filter((c) => c.type === "credit").length !== 1 ? "s" : ""}`}
              subtitleType="negative"
            />
            <StatCard
              label="Total credit limit"
              value={formatCurrency(totalCreditLimit)}
              subtitle={`${formatCurrency(totalAvailable)} available`}
            />
            <StatCard
              label="Next payment due"
              value={nextPaymentDate}
              subtitle={
                nextPaymentUrgency ? `${nextPaymentUrgency}` : undefined
              }
              subtitleType={
                nextPaymentUrgency === "Overdue" ? "negative" : "neutral"
              }
            />
          </div>

          {cards.length === 0 ? (
            <EmptyState
              icon={<CardEmptyIcon />}
              message="No cards added yet. Add your credit or debit cards to track spending and due dates."
              actionLabel="Add card"
              onAction={() => setIsAddCardOpen(true)}
            />
          ) : (
            cards.map((card) => (
              <CardRow
                key={card.id}
                card={card}
                accounts={accounts}
                onEdit={handleEditCard}
                onDeactivate={handleDeactivateCard}
              />
            ))
          )}
        </>
      )}

      {/* Modals */}
      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onSubmit={handleAddAccount}
      />

      <AddCardModal
        isOpen={isAddCardOpen}
        accounts={accounts}
        onClose={() => setIsAddCardOpen(false)}
        onSubmit={handleAddCard}
      />

      <EditAccountModal
        account={editingAccount}
        isOpen={isEditAccountOpen}
        onClose={() => setIsEditAccountOpen(false)}
        onSave={handleSaveAccount}
      />

      <EditCardModal
        card={editingCard}
        isOpen={isEditCardOpen}
        accounts={accounts}
        onClose={() => setIsEditCardOpen(false)}
        onSave={handleSaveCard}
      />
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

function AccountEmptyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="2"
        width="14"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CardEmptyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="3"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <line
        x1="1"
        y1="7"
        x2="15"
        y2="7"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
