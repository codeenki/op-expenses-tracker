/* ============================================
   EDIT CARD MODAL
   Pre-filled form for editing an existing
   credit or debit card.
   ============================================ */

import { useState } from "react";
import { type Card, type CardType, type Account } from "../../models/types";
import {
  detectCardNetwork,
  CARD_NETWORK_CONFIG,
} from "../../constants/accounts";
import Modal from "../common/Modal";

interface EditCardModalProps {
  card: Card | null;
  isOpen: boolean;
  accounts: Account[];
  onClose: () => void;
  onSave: (updated: Card) => void;
}

interface EditCardForm {
  name: string;
  type: CardType;
  firstDigit: string;
  bank: string;
  lastFourDigits: string;
  associatedAccountId: string;
  creditLimit: string;
  statementClosingDate: string;
  paymentDueDate: string;
}

export default function EditCardModal({
  card,
  isOpen,
  accounts,
  onClose,
  onSave,
}: EditCardModalProps) {
  const [prevId, setPrevId] = useState<string | null>(null);
  const [form, setForm] = useState<EditCardForm>(getInitialForm(null));
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditCardForm, string>>
  >({});

  if (card && card.id !== prevId) {
    setPrevId(card.id);
    setForm(getInitialForm(card));
    setErrors({});
  }

  const detectedNetwork = form.firstDigit
    ? detectCardNetwork(form.firstDigit)
    : null;
  const networkConfig = detectedNetwork
    ? CARD_NETWORK_CONFIG[detectedNetwork]
    : null;
  const isCreditCard = form.type === "credit";

  function handleChange(field: keyof EditCardForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof EditCardForm, string>> = {};

    if (!form.name.trim()) newErrors.name = "Card name is required";
    if (!form.bank.trim()) newErrors.bank = "Bank is required";
    if (!form.lastFourDigits.trim()) {
      newErrors.lastFourDigits = "Last 4 digits required";
    } else if (!/^\d{4}$/.test(form.lastFourDigits)) {
      newErrors.lastFourDigits = "Must be exactly 4 digits";
    }
    if (!form.firstDigit.trim()) {
      newErrors.firstDigit = "First digit is required";
    } else if (!/^\d$/.test(form.firstDigit)) {
      newErrors.firstDigit = "Must be a single digit";
    }
    if (isCreditCard && form.creditLimit) {
      if (isNaN(Number(form.creditLimit))) {
        newErrors.creditLimit = "Must be a valid number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!card || !validate()) return;

    const updated: Card = {
      ...card,
      name: form.name,
      type: form.type,
      network: detectCardNetwork(form.firstDigit),
      bank: form.bank,
      lastFourDigits: form.lastFourDigits,
      associatedAccountId: form.associatedAccountId || undefined,
      creditLimit: form.creditLimit
        ? Math.round(Number(form.creditLimit) * 100)
        : undefined,
      statementClosingDate: form.statementClosingDate || undefined,
      paymentDueDate: form.paymentDueDate || undefined,
    };

    onSave(updated);
    onClose();
  }

  if (!card) return null;

  return (
    <Modal isOpen={isOpen} title="Edit card" onClose={onClose} width="md">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Card name</label>
          <input
            className="form-input"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Card type</label>
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">First digit of card number</label>
          <input
            className="form-input"
            type="text"
            maxLength={1}
            value={form.firstDigit}
            onChange={(e) => handleChange("firstDigit", e.target.value)}
          />
          {networkConfig && (
            <div
              className="form-hint"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "1px 6px",
                  borderRadius: "3px",
                  background: networkConfig.gradient,
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 600,
                }}
              >
                {networkConfig.label}
              </span>
              Network detected
            </div>
          )}
          {errors.firstDigit && (
            <div className="form-error">{errors.firstDigit}</div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Last 4 digits</label>
          <input
            className="form-input"
            type="text"
            maxLength={4}
            value={form.lastFourDigits}
            onChange={(e) => handleChange("lastFourDigits", e.target.value)}
          />
          {errors.lastFourDigits && (
            <div className="form-error">{errors.lastFourDigits}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Bank / Issuer</label>
          <input
            className="form-input"
            type="text"
            value={form.bank}
            onChange={(e) => handleChange("bank", e.target.value)}
          />
          {errors.bank && <div className="form-error">{errors.bank}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Associated account (optional)</label>
          <select
            className="form-select"
            value={form.associatedAccountId}
            onChange={(e) =>
              handleChange("associatedAccountId", e.target.value)
            }
          >
            <option value="">None</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isCreditCard && (
        <>
          <div className="form-group">
            <label className="form-label">Credit limit</label>
            <input
              className="form-input"
              type="text"
              value={form.creditLimit}
              onChange={(e) => handleChange("creditLimit", e.target.value)}
            />
            {errors.creditLimit && (
              <div className="form-error">{errors.creditLimit}</div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Statement closing date</label>
              <input
                className="form-input"
                type="date"
                value={form.statementClosingDate}
                onChange={(e) =>
                  handleChange("statementClosingDate", e.target.value)
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment due date</label>
              <input
                className="form-input"
                type="date"
                value={form.paymentDueDate}
                onChange={(e) => handleChange("paymentDueDate", e.target.value)}
              />
            </div>
          </div>
        </>
      )}

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

function getInitialForm(card: Card | null): EditCardForm {
  if (!card) {
    return {
      name: "",
      type: "credit",
      firstDigit: "",
      bank: "",
      lastFourDigits: "",
      associatedAccountId: "",
      creditLimit: "",
      statementClosingDate: "",
      paymentDueDate: "",
    };
  }

  const firstDigitMap: Record<string, string> = {
    visa: "4",
    mastercard: "5",
    amex: "3",
    other: "",
  };

  return {
    name: card.name,
    type: card.type,
    firstDigit: firstDigitMap[card.network] || "",
    bank: card.bank,
    lastFourDigits: card.lastFourDigits,
    associatedAccountId: card.associatedAccountId || "",
    creditLimit: card.creditLimit ? (card.creditLimit / 100).toFixed(2) : "",
    statementClosingDate: card.statementClosingDate || "",
    paymentDueDate: card.paymentDueDate || "",
  };
}
