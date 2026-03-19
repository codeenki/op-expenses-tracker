/* ============================================
   TRANSACTION FILTERS COMPONENT
   Search bar and filter chips for filtering
   the transaction list.
   ============================================ */

import {
  type TransactionType,
  type TransactionCategory,
  type Account,
  type Card,
} from "../../models/types";
import {
  CATEGORY_CONFIG,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "../../constants/categories";
import "./TransactionFilters.css";

export interface FilterState {
  search: string;
  dateRange: string;
  category: TransactionCategory | "";
  source: string;
  type: TransactionType | "";
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  accounts: Account[];
  cards: Card[];
}

const DATE_RANGES = [
  { value: "", label: "All time" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export default function TransactionFilters({
  filters,
  onFilterChange,
  accounts,
  cards,
}: TransactionFiltersProps) {
  function updateFilter(key: keyof FilterState, value: string) {
    onFilterChange({ ...filters, [key]: value });
  }

  const hasActiveFilters =
    filters.dateRange || filters.category || filters.source || filters.type;

  return (
    <div className="txFilters">
      <div className="txFilters-searchWrap">
        <span className="txFilters-searchIcon">
          <SearchIcon />
        </span>
        <input
          className="txFilters-searchInput"
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
        />
      </div>

      <div className="txFilters-chips">
        {DATE_RANGES.map((range) => (
          <button
            key={range.value || "all"}
            className={`txFilters-chip ${filters.dateRange === range.value ? "active" : ""}`}
            onClick={() => updateFilter("dateRange", range.value)}
          >
            {range.label}
          </button>
        ))}

        <select
          className="txFilters-select"
          value={filters.category}
          onChange={(e) => updateFilter("category", e.target.value)}
        >
          <option value="">Category</option>
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_CONFIG[cat].label}
            </option>
          ))}
        </select>

        <select
          className="txFilters-select"
          value={filters.type}
          onChange={(e) => updateFilter("type", e.target.value)}
        >
          <option value="">Type</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
          <option value="transfer">Transfer</option>
        </select>

        <select
          className="txFilters-select"
          value={filters.source}
          onChange={(e) => updateFilter("source", e.target.value)}
        >
          <option value="">Source</option>
          {accounts
            .filter((a) => a.status === "active")
            .map((a) => (
              <option
                key={`account-${a.id}`}
                value={a.type === "cash" ? `cash-${a.id}` : `account-${a.id}`}
              >
                {a.name}
                {a.type === "cash" ? " (Cash)" : ""}
              </option>
            ))}
          {cards
            .filter((c) => c.status === "active")
            .map((c) => (
              <option key={`card-${c.id}`} value={`card-${c.id}`}>
                {c.name} (••{c.lastFourDigits})
              </option>
            ))}
        </select>

        {hasActiveFilters && (
          <button
            className="txFilters-chip clear"
            onClick={() =>
              onFilterChange({
                search: "",
                dateRange: "",
                category: "",
                source: "",
                type: "",
              })
            }
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M9.5 9.5L13 13"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
