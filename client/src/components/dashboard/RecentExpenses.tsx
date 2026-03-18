/* ============================================
   RECENT EXPENSES COMPONENT
   Shows the latest expenses on the Dashboard.
   Handles empty state when no expenses exist.
   ============================================ */

import type { Expense } from "../../models/types";
import { formatCurrency, formatRelativeDate } from "../../utils/formatters";
import CategoryIcon from "../common/CategoryIcon";
import EmptyState from "../common/EmptyState";
import "./RecentExpenses.css";

interface RecentExpensesProps {
  expenses: Expense[];
  onAddExpense: () => void;
}

export default function RecentExpenses({
  expenses,
  onAddExpense,
}: RecentExpensesProps) {
  if (expenses.length === 0) {
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
      {expenses.map((expense) => (
        <div key={expense.id} className="recentExpenses-row">
          <div className="recentExpenses-left">
            <CategoryIcon category={expense.category} />
            <div>
              <span className="recentExpenses-name">{expense.title}</span>
              <span className="recentExpenses-date">
                {formatRelativeDate(expense.date)}
              </span>
            </div>
          </div>
          <span className="recentExpenses-amount">
            -{formatCurrency(expense.amount)}
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
