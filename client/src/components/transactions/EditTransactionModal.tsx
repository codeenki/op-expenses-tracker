/* ============================================
   EDIT TRANSACTION MODAL
   Pre-filled form for editing an existing
   transaction. Reuses the same form layout
   as AddTransactionModal.
   ============================================ */

import { useState } from "react";
import {
  type Transaction,
  type TransactionType,
  type TransactionCategory,
  type Recurrence,
  type Account,
  type Card,
} from "../../models/types";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  CATEGORY_CONFIG,
  RECURRENCE_OPTIONS,
} from "../../constants/categories";
import { CURRENCIES } from "../../constants/accounts";
import Modal from "../common/Modal";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  accounts: Account[];
  cards: Card[];
  onClose: () => void;
  onSave: (updated: Transaction) => void;
}

interface EditFormData {
  title: string;
  description: string;
  amount: string;
  currency: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  sourceKey: string;
  transferToKey: string;
  tags: string;
  recurrence: Recurrence;
  notes: string;
}

export default function EditTransactionModal({
  transaction,
  isOpen,
  accounts,
  cards,
  onClose,
  onSave,
}: EditTransactionModalProps) {
  const [prevId, setPrevId] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormData>(getInitialForm(null));
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditFormData, string>>
  >({});

  /*
   * When the transaction changes (user opens a different one),
   * populate the form with its current values.
   */
  if (transaction && transaction.id !== prevId) {
    setPrevId(transaction.id);
    setForm(getInitialForm(transaction));
    setErrors({});
  }

  const categories =
    form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isTransfer = form.type === "transfer";
  const activeAccounts = accounts.filter((a) => a.status === "active");
  const activeCards = cards.filter((c) => c.status === "active");

  function handleChange(field: keyof EditFormData, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "type") {
        const cats =
          value === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        updated.category = value === "transfer" ? "transfer" : cats[0];
      }
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof EditFormData, string>> = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (
      !form.amount.trim() ||
      isNaN(Number(form.amount)) ||
      Number(form.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount";
    }
    if (!form.date) newErrors.date = "Date is required";
    if (isTransfer && !form.transferToKey) {
      newErrors.transferToKey = "Select a destination account";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!transaction || !validate()) return;

    const updated: Transaction = {
      ...transaction,
      title: form.title,
      description: form.description || undefined,
      amount: Math.round(Number(form.amount) * 100),
      currency: form.currency,
      date: new Date(form.date).toISOString(),
      type: form.type,
      category: isTransfer ? "transfer" : form.category,
      sourceType:
        form.sourceKey === "cash"
          ? "cash"
          : form.sourceKey.startsWith("card")
            ? "credit_card"
            : "account",
      sourceId:
        form.sourceKey === "cash" ? undefined : form.sourceKey.split("-")[1],
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      recurrence: form.recurrence,
      notes: form.notes || undefined,
      transferToId: form.transferToKey
        ? form.transferToKey.split("-")[1]
        : undefined,
    };

    onSave(updated);
    onClose();
  }

  if (!transaction) return null;

  return (
    <Modal
      isOpen={isOpen}
      title="Edit transaction"
      onClose={onClose}
      width="md"
    >
      <div className="form-group">
        <label className="form-label">Transaction type</label>
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
        <label className="form-label">Title</label>
        <input
          className="form-input"
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Amount</label>
          <input
            className="form-input"
            type="text"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
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
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            className="form-input"
            type="date"
            value={form.date}
            onChange={(e) => handleChange("date", e.target.value)}
          />
          {errors.date && <div className="form-error">{errors.date}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">
            {isTransfer ? "From account" : "Source"}
          </label>
          <select
            className="form-select"
            value={form.sourceKey}
            onChange={(e) => handleChange("sourceKey", e.target.value)}
          >
            <option value="cash">Cash</option>
            {activeAccounts.map((a) => (
              <option key={`acc-${a.id}`} value={`account-${a.id}`}>
                {a.name}
              </option>
            ))}
            {!isTransfer &&
              activeCards.map((c) => (
                <option key={`card-${c.id}`} value={`card-${c.id}`}>
                  {c.name} (••{c.lastFourDigits})
                </option>
              ))}
          </select>
        </div>
      </div>

      {isTransfer && (
        <div className="form-group">
          <label className="form-label">To account</label>
          <select
            className="form-select"
            value={form.transferToKey}
            onChange={(e) => handleChange("transferToKey", e.target.value)}
          >
            <option value="">Select destination</option>
            {activeAccounts
              .filter((a) => `account-${a.id}` !== form.sourceKey)
              .map((a) => (
                <option key={a.id} value={`account-${a.id}`}>
                  {a.name}
                </option>
              ))}
          </select>
          {errors.transferToKey && (
            <div className="form-error">{errors.transferToKey}</div>
          )}
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Description (optional)</label>
        <input
          className="form-input"
          type="text"
          placeholder="Additional context"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      {!isTransfer && (
        <div className="form-row">
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
          <div className="form-group">
            <label className="form-label">Recurrence</label>
            <select
              className="form-select"
              value={form.recurrence}
              onChange={(e) => handleChange("recurrence", e.target.value)}
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Tags (optional)</label>
        <input
          className="form-input"
          type="text"
          placeholder="Comma separated"
          value={form.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-input"
          rows={2}
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          style={{ resize: "vertical", minHeight: "60px" }}
        />
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={onClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSave}>
          Save changes
        </button>
      </div>
    </Modal>
  );
}

function getInitialForm(tx: Transaction | null): EditFormData {
  if (!tx) {
    return {
      title: "",
      description: "",
      amount: "",
      currency: "USD",
      date: "",
      type: "expense",
      category: "food",
      sourceKey: "cash",
      transferToKey: "",
      tags: "",
      recurrence: "none",
      notes: "",
    };
  }

  const sourceKey =
    tx.sourceType === "cash"
      ? "cash"
      : tx.sourceType === "credit_card"
        ? `card-${tx.sourceId}`
        : `account-${tx.sourceId}`;

  const transferToKey = tx.transferToId ? `account-${tx.transferToId}` : "";

  return {
    title: tx.title,
    description: tx.description || "",
    amount: (tx.amount / 100).toFixed(2),
    currency: tx.currency,
    date: tx.date.split("T")[0],
    type: tx.type,
    category: tx.category,
    sourceKey,
    transferToKey,
    tags: tx.tags.join(", "),
    recurrence: tx.recurrence,
    notes: tx.notes || "",
  };
}
