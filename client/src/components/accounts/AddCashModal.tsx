/* ============================================
   ADD CASH ACCOUNT MODAL
   Simplified form for creating a cash account.
   No bank, no interest rate — just name, currency,
   balance, location, and global balance toggle.
   ============================================ */

import { useState } from "react";
import { CURRENCIES } from "../../constants/accounts";
import Modal from "../common/Modal";

interface AddCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CashFormData) => void;
}

export interface CashFormData {
  name: string;
  currency: string;
  balance: string;
  location: string;
  includeInGlobalBalance: boolean;
}

const INITIAL_FORM: CashFormData = {
  name: "Cash",
  currency: "USD",
  balance: "",
  location: "",
  includeInGlobalBalance: true,
};

export default function AddCashModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCashModalProps) {
  const [form, setForm] = useState<CashFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CashFormData, string>>
  >({});

  function handleChange(field: keyof CashFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof CashFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.balance.trim()) {
      newErrors.balance = "Balance is required";
    } else if (isNaN(Number(form.balance))) {
      newErrors.balance = "Must be a valid number";
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
    <Modal
      isOpen={isOpen}
      title="Add cash account"
      onClose={handleClose}
      width="sm"
    >
      <div className="form-group">
        <label className="form-label">Name</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. Wallet, Home safe"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        {errors.name && <div className="form-error">{errors.name}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Current balance</label>
          <input
            className="form-input"
            type="text"
            placeholder="0.00"
            value={form.balance}
            onChange={(e) => handleChange("balance", e.target.value)}
          />
          {errors.balance && <div className="form-error">{errors.balance}</div>}
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

      <div className="form-group">
        <label className="form-label">Location (optional)</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. Wallet, Home, Office"
          value={form.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <div className="form-hint">Where is this cash stored?</div>
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
          When enabled, this cash amount counts toward your total balance
        </div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          Add cash account
        </button>
      </div>
    </Modal>
  );
}
