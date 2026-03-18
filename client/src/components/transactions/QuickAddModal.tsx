/* ============================================
   QUICK ADD MODAL
   Simplified modal for logging transactions
   quickly. Only essential fields.
   ============================================ */

import { useState } from "react";
import {
  type TransactionType,
  type TransactionCategory,
  type Account,
  type Card,
} from "../../models/types";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_CONFIG,
} from "../../constants/categories";
import { CURRENCIES } from "../../constants/accounts";
import Modal from "../common/Modal";

interface QuickAddModalProps {
  isOpen: boolean;
  accounts: Account[];
  cards: Card[];
  onClose: () => void;
  onSubmit: (data: QuickAddData) => void;
}

export interface QuickAddData {
  amount: string;
  title: string;
  currency: string;
  category: TransactionCategory;
  type: TransactionType;
  sourceKey: string;
}

export default function QuickAddModal({
  isOpen,
  accounts,
  cards,
  onClose,
  onSubmit,
}: QuickAddModalProps) {
  const [form, setForm] = useState<QuickAddData>({
    amount: "",
    title: "",
    currency: "USD",
    category: "food",
    type: "expense",
    sourceKey: "cash",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuickAddData, string>>
  >({});

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleChange(field: keyof QuickAddData, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "type") {
        const cats =
          value === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        updated.category = cats[0];
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof QuickAddData, string>> = {};
    if (
      !form.amount.trim() ||
      isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount";
    }
    if (!form.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(form);
    setForm({
      amount: "",
      title: "",
      currency: "USD",
      category: "food",
      type: "expense",
      sourceKey: "cash",
    });
    onClose();
  }

  function handleClose() {
    setForm({
      amount: "",
      title: "",
      currency: "USD",
      category: "food",
      type: "expense",
      sourceKey: "cash",
    });
    setErrors({});
    onClose();
  }

  return (
    <Modal isOpen={isOpen} title="Quick add" onClose={handleClose} width="sm">
      <div className="form-group">
        <label className="form-label">Type</label>
        <div style={{ display: "flex", gap: "6px" }}>
          {(["expense", "income", "transfer"] as TransactionType[]).map((t) => (
            <button
              key={t}
              type="button"
              style={{
                flex: 1,
                padding: "8px",
                fontSize: "13px",
                borderRadius: "8px",
                border:
                  form.type === t
                    ? "1px solid var(--color-accent)"
                    : "1px solid var(--color-border-secondary)",
                background:
                  form.type === t ? "var(--color-accent-light)" : "transparent",
                color:
                  form.type === t
                    ? "var(--color-accent-text)"
                    : "var(--color-text-secondary)",
                cursor: "pointer",
                fontWeight: form.type === t ? 500 : 400,
              }}
              onClick={() => handleChange("type", t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Amount</label>
        <input
          className="form-input"
          type="text"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          autoFocus
        />
        {errors.amount && <div className="form-error">{errors.amount}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Currency</label>
        <select
          className="form-select"
          value={form.currency}
          onChange={(e) => handleChange("currency", e.target.value)}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Title</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. Coffee at Starbucks"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      {form.type !== "transfer" && (
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_CONFIG[cat].label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">
          {form.type === "transfer" ? "From" : "Source"}
        </label>
        <select
          className="form-select"
          value={form.sourceKey}
          onChange={(e) => handleChange("sourceKey", e.target.value)}
        >
          <option value="cash">Cash</option>
          {accounts
            .filter((a) => a.status === "active")
            .map((a) => (
              <option key={`acc-${a.id}`} value={`account-${a.id}`}>
                {a.name}
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
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          Add
        </button>
      </div>
    </Modal>
  );
}
