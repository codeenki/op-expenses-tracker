/* ============================================
   TRANSACTION LIST COMPONENT
   Compact table-style list of transactions.
   Clicking a row opens the detail modal.
   ============================================ */

import { type Transaction } from "../../models/types";
import { formatCurrency, formatRelativeDate } from "../../utils/formatters";
import CategoryIcon from "../common/CategoryIcon";
import EmptyState from "../common/EmptyState";
import "./TransactionList.css";

interface TransactionListProps {
  transactions: Transaction[];
  onRowClick: (transaction: Transaction) => void;
  onAddTransaction: () => void;
}

export default function TransactionList({
  transactions,
  onRowClick,
  onAddTransaction,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<TxEmptyIcon />}
        message="No transactions found. Add your first transaction to start tracking your finances."
        actionLabel="Add transaction"
        onAction={onAddTransaction}
      />
    );
  }

  return (
    <div className="txList">
      <div className="txList-header">
        <div className="txList-colIcon" />
        <div className="txList-colDesc">Title</div>
        <div className="txList-colDate">Date</div>
        <div className="txList-colSource">Source</div>
        <div className="txList-colType">Type</div>
        <div className="txList-colAmount">Amount</div>
      </div>

      {transactions.map((tx) => {
        const amountClass =
          tx.type === "expense"
            ? "negative"
            : tx.type === "income"
              ? "positive"
              : "neutral";

        const amountPrefix =
          tx.type === "expense" ? "-" : tx.type === "income" ? "+" : "";

        const sourceName =
          tx.type === "transfer" && tx.transferToName
            ? `${tx.sourceName} → ${tx.transferToName}`
            : tx.sourceName;

        return (
          <div
            key={tx.id}
            className="txList-row"
            onClick={() => onRowClick(tx)}
          >
            <div className="txList-cellIcon">
              <CategoryIcon category={tx.category} size={26} />
            </div>
            <div className="txList-cellDesc">
              <span className="txList-descText">{tx.title}</span>
              {tx.recurrence !== "none" && (
                <span className="txList-recurrBadge">
                  {tx.recurrence.charAt(0).toUpperCase() +
                    tx.recurrence.slice(1)}
                </span>
              )}
            </div>
            <div className="txList-cellDate">{formatRelativeDate(tx.date)}</div>
            <div className="txList-cellSource">{sourceName}</div>
            <div className="txList-cellType">
              <span className={`txList-typeBadge ${tx.type}`}>
                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
              </span>
            </div>
            <div className={`txList-cellAmount ${amountClass}`}>
              {amountPrefix}
              {formatCurrency(tx.amount, tx.currency)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TxEmptyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M8 4.5v7M5.5 6.5h5c.8 0 .8 2-1 2H6c-1.8 0-1.8 2 0 2h4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
