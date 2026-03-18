/* ============================================
   ACCOUNTS OVERVIEW COMPONENT
   Shows a summary of all accounts and cards
   on the Dashboard. Credit cards shown in red
   as liabilities.
   ============================================ */

import type { Account } from "../../models/types";
import { formatCurrency } from "../../utils/formatters";
import EmptyState from "../common/EmptyState";
import "./AccountsOverview.css";

interface AccountsOverviewProps {
  accounts: Account[];
  onAddAccount: () => void;
}

export default function AccountsOverview({
  accounts,
  onAddAccount,
}: AccountsOverviewProps) {
  if (accounts.length === 0) {
    return (
      <EmptyState
        icon={<AccountEmptyIcon />}
        message="No accounts or cards added yet. Add your bank accounts to track balances."
        actionLabel="Add account"
        onAction={onAddAccount}
      />
    );
  }

  return (
    <div className="accountsOverview">
      {accounts.map((account) => {
        const isLiability =
          account.type === "credit_card" && account.balance < 0;

        return (
          <div key={account.id} className="accountsOverview-row">
            <div className="accountsOverview-left">
              <div className="accountsOverview-icon">
                <AccountTypeIcon type={account.type} />
              </div>
              <div>
                <span className="accountsOverview-name">{account.name}</span>
                <span className="accountsOverview-type">
                  {ACCOUNT_TYPE_LABELS[account.type]}
                </span>
              </div>
            </div>
            <span
              className={`accountsOverview-balance ${isLiability ? "negative" : ""}`}
            >
              {formatCurrency(account.balance)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Constants ---------- */

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  checking: "Bank account",
  savings: "Savings account",
  credit_card: "Credit card",
  debit_card: "Debit card",
  cash: "Cash",
};

/* ---------- Icons ---------- */

function AccountTypeIcon({ type }: { type: string }) {
  if (type === "cash") {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect
          x="1"
          y="3"
          width="14"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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

function AccountEmptyIcon() {
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
