/* ============================================
   ADD CARD MODAL
   Form for creating a new credit/debit card.
   Auto-detects card network from first digit.
   ============================================ */

import { useState } from "react";
import { type CardType, type Account } from "../../models/types";
import {
  detectCardNetwork,
  CARD_NETWORK_CONFIG,
} from "../../constants/accounts";
import Modal from "../common/Modal";

interface AddCardModalProps {
  isOpen: boolean;
  accounts: Account[];
  onClose: () => void;
  onSubmit: (data: CardFormData) => void;
}

export interface CardFormData {
  name: string;
  type: CardType;
  firstDigit: string;
  bank: string;
  lastFourDigits: string;
  associatedAccountId: string;
  creditLimit: string;
  currentBalance: string;
  statementClosingDate: string;
  paymentDueDate: string;
  includeInGlobalBalance: boolean;
}

const INITIAL_FORM: CardFormData = {
  name: "",
  type: "credit",
  firstDigit: "",
  bank: "",
  lastFourDigits: "",
  associatedAccountId: "",
  creditLimit: "",
  currentBalance: "",
  statementClosingDate: "",
  paymentDueDate: "",
  includeInGlobalBalance: true,
};

export default function AddCardModal({
  isOpen,
  accounts,
  onClose,
  onSubmit,
}: AddCardModalProps) {
  const [form, setForm] = useState<CardFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CardFormData, string>>
  >({});

  const detectedNetwork = form.firstDigit
    ? detectCardNetwork(form.firstDigit)
    : null;
  const networkConfig = detectedNetwork
    ? CARD_NETWORK_CONFIG[detectedNetwork]
    : null;
  const isCreditCard = form.type === "credit";

  function handleChange(field: keyof CardFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof CardFormData, string>> = {};

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
    if (isCreditCard) {
      if (!form.creditLimit.trim()) {
        newErrors.creditLimit = "Credit limit is required";
      } else if (isNaN(Number(form.creditLimit))) {
        newErrors.creditLimit = "Must be a valid number";
      }
    }
    if (form.currentBalance && isNaN(Number(form.currentBalance))) {
      newErrors.currentBalance = "Must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(form);
    setForm(INITIAL_FORM);
    onClose();
  }

  function handleClose() {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  }

  return (
    <Modal isOpen={isOpen} title="Add card" onClose={handleClose} width="md">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Card name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. Visa Gold"
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
            placeholder="e.g. 4"
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
            placeholder="e.g. 4521"
            maxLength={4}
            value={form.lastFourDigits}
            onChange={(e) => handleChange("lastFourDigits", e.target.value)}
          />
          <div className="form-hint">We never store full card numbers</div>
          {errors.lastFourDigits && (
            <div className="form-error">{errors.lastFourDigits}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label
          className="form-label"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={form.includeInGlobalBalance}
            onChange={(e) =>
              handleChange("includeInGlobalBalance", e.target.checked)
            }
            style={{ width: "16px", height: "16px", cursor: "pointer" }}
          />
          Include in global balance
        </label>
        <div className="form-hint">
          When enabled, this card's balance affects your total balance
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Bank / Issuer</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. BAC"
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
          <div className="form-hint">
            {form.type === "debit"
              ? "Link to the bank account this card draws from"
              : "Optional — link to a payment account"}
          </div>
        </div>
      </div>

      {isCreditCard && (
        <>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Credit limit</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. 5000.00"
                value={form.creditLimit}
                onChange={(e) => handleChange("creditLimit", e.target.value)}
              />
              {errors.creditLimit && (
                <div className="form-error">{errors.creditLimit}</div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Current balance (optional)</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. 830.50"
                value={form.currentBalance}
                onChange={(e) => handleChange("currentBalance", e.target.value)}
              />
              <div className="form-hint">Amount currently owed</div>
              {errors.currentBalance && (
                <div className="form-error">{errors.currentBalance}</div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Statement closing date (optional)
              </label>
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
              <label className="form-label">Payment due date (optional)</label>
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
        <button className="btn-cancel" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          Add card
        </button>
      </div>
    </Modal>
  );
}
