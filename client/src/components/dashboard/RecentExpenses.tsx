/* ============================================
   RECENT EXPENSES COMPONENT
   Shows the latest expenses on the Dashboard.
   Handles empty state when no transactions exist.
   Now uses Transaction model with title field.
   ============================================ */

import { type Transaction } from "../../models/types";
import { formatCurrency, formatRelativeDate } from "../../utils/formatters";
import CategoryIcon from "../common/CategoryIcon";
import EmptyState from "../common/EmptyState";
import "./RecentExpenses.css";

interface RecentExpensesProps {
  transactions: Transaction[];
  onAddExpense: () => void;
}

export default function RecentExpenses({
  transactions,
  onAddExpense,
}: RecentExpensesProps) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<ExpenseEmptyIcon />}
        message="No expenses recorded yet. Start tracking to see your spending here."
        actionLabel="Add your first expense"
        onAction={onAddExpense}
      />
    );
  }

  return (
    <div className="recentExpenses">
      {transactions.map((tx) => (
        <div key={tx.id} className="recentExpenses-row">
          <div className="recentExpenses-left">
            <CategoryIcon category={tx.category} />
            <div>
              <span className="recentExpenses-name">{tx.title}</span>
              <span className="recentExpenses-date">
                {formatRelativeDate(tx.date)}
              </span>
            </div>
          </div>
          <span className="recentExpenses-amount">
            -{formatCurrency(tx.amount, tx.currency)}
          </span>
        </div>
      ))}
    </div>
  );
}

function ExpenseEmptyIcon() {
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
