/* ============================================
   ACCOUNT ROW COMPONENT
   Expandable row showing account summary.
   Handles both bank accounts and cash accounts
   with appropriate display for each.
   ============================================ */

import { useState } from "react";
import { type Account } from "../../models/types";
import { formatCurrency } from "../../utils/formatters";
import { ACCOUNT_TYPE_OPTIONS } from "../../constants/accounts";
import "./AccountRow.css";

interface AccountRowProps {
  account: Account;
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export default function AccountRow({
  account,
  onEdit,
  onDeactivate,
}: AccountRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isCash = account.type === "cash";
  const typeLabel =
    ACCOUNT_TYPE_OPTIONS.find((t) => t.value === account.type)?.label ||
    account.type;

  return (
    <div className="accountRow">
      <div
        className="accountRow-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="accountRow-left">
          <div className="accountRow-icon">
            {isCash ? <CashIcon /> : <AccountIcon />}
          </div>
          <div>
            <div className="accountRow-name">{account.name}</div>
            <div className="accountRow-meta">
              <span className="accountRow-status">
                <span className={`accountRow-statusDot ${account.status}`} />
                {account.status.charAt(0).toUpperCase() +
                  account.status.slice(1)}
              </span>
              <span className="accountRow-separator">·</span>
              <span>
                {typeLabel} · {account.currency}
              </span>
              {isCash && account.location && (
                <>
                  <span className="accountRow-separator">·</span>
                  <span>{account.location}</span>
                </>
              )}
              {!account.includeInGlobalBalance && (
                <span className="accountRow-excludedBadge">
                  Excluded from balance
                </span>
              )}
              {account.tags.map((tag) => (
                <span key={tag} className="accountRow-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="accountRow-right">
          <div className="accountRow-balance">
            <div className="accountRow-balanceVal">
              {formatCurrency(account.balance, account.currency)}
            </div>
            <div className="accountRow-balanceLabel">Current balance</div>
          </div>
          <div className={`accountRow-chevron ${isExpanded ? "open" : ""}`}>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="accountRow-details">
          <div className="accountRow-detailsGrid">
            {isCash ? (
              <>
                <DetailItem label="Location" value={account.location || "—"} />
                <DetailItem label="Currency" value={account.currency} />
                <DetailItem
                  label="Balance"
                  value={formatCurrency(account.balance, account.currency)}
                />
                <DetailItem
                  label="In global balance"
                  value={account.includeInGlobalBalance ? "Yes" : "No"}
                />
              </>
            ) : (
              <>
                <DetailItem
                  label="Bank institution"
                  value={account.bankInstitution}
                />
                <DetailItem label="Country" value={account.country} />
                <DetailItem
                  label="Initial balance"
                  value={formatCurrency(
                    account.initialBalance,
                    account.currency,
                  )}
                />
                <DetailItem
                  label="Interest rate"
                  value={
                    account.interestRate
                      ? `${account.interestRate}% annual`
                      : "—"
                  }
                />
                <DetailItem
                  label="Visibility"
                  value={
                    account.visibility.charAt(0).toUpperCase() +
                    account.visibility.slice(1)
                  }
                />
                <DetailItem
                  label="In global balance"
                  value={account.includeInGlobalBalance ? "Yes" : "No"}
                />
                <DetailItem
                  label="Tags"
                  value={
                    account.tags.length > 0 ? account.tags.join(", ") : "—"
                  }
                />
              </>
            )}
          </div>
          <div className="accountRow-actions">
            <button
              className="accountRow-btn"
              onClick={() => onEdit(account.id)}
            >
              Edit
            </button>
            <button
              className="accountRow-btn"
              onClick={() => onEdit(account.id)}
            >
              View transactions
            </button>
            <button
              className="accountRow-btn danger"
              onClick={() => onDeactivate(account.id)}
            >
              {account.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="accountRow-detailItem">
      <div className="accountRow-detailLabel">{label}</div>
      <div className="accountRow-detailValue">{value}</div>
    </div>
  );
}

function AccountIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
      <path
        d="M4 9h3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="1"
        y="3"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="3.5" cy="8" r="0.8" fill="currentColor" />
      <circle cx="12.5" cy="8" r="0.8" fill="currentColor" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
