/* ============================================
   ADD ACCOUNT MODAL
   Form for creating a new bank account.
   Country selection filters available currencies.
   ============================================ */

import { useState } from "react";
import { type AccountType, type Visibility } from "../../models/types";
import {
  COUNTRIES,
  ACCOUNT_TYPE_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../../constants/accounts";
import Modal from "../common/Modal";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => void;
}

export interface AccountFormData {
  name: string;
  bankInstitution: string;
  country: string;
  currency: string;
  type: AccountType;
  initialBalance: string;
  interestRate: string;
  visibility: Visibility;
  tags: string;
}

const INITIAL_FORM: AccountFormData = {
  name: "",
  bankInstitution: "",
  country: "",
  currency: "",
  type: "checking",
  initialBalance: "",
  interestRate: "",
  visibility: "private",
  tags: "",
};

export default function AddAccountModal({
  isOpen,
  onClose,
  onSubmit,
}: AddAccountModalProps) {
  const [form, setForm] = useState<AccountFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AccountFormData, string>>
  >({});

  function handleChange(field: keyof AccountFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    /* Auto-set currency when country changes */
    if (field === "country") {
      const country = COUNTRIES.find((c) => c.code === value);
      if (country) {
        setForm((prev) => ({
          ...prev,
          country: value,
          currency: country.currency,
        }));
      }
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Account name is required";
    if (!form.bankInstitution.trim())
      newErrors.bankInstitution = "Bank institution is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.currency) newErrors.currency = "Currency is required";
    if (!form.initialBalance.trim()) {
      newErrors.initialBalance = "Initial balance is required";
    } else if (isNaN(Number(form.initialBalance))) {
      newErrors.initialBalance = "Must be a valid number";
    }
    if (form.interestRate && isNaN(Number(form.interestRate))) {
      newErrors.interestRate = "Must be a valid number";
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

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  return (
    <Modal isOpen={isOpen} title="Add account" onClose={handleClose} width="md">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Account name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. BAC Checking"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Bank institution</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. BAC San José"
            value={form.bankInstitution}
            onChange={(e) => handleChange("bankInstitution", e.target.value)}
          />
          {errors.bankInstitution && (
            <div className="form-error">{errors.bankInstitution}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Country</label>
          <select
            className="form-select"
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && <div className="form-error">{errors.country}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Currency</label>
          <input
            className="form-input"
            type="text"
            value={
              selectedCountry
                ? `${selectedCountry.currency} (${selectedCountry.currencySymbol})`
                : form.currency
            }
            readOnly={!!selectedCountry}
            onChange={(e) => handleChange("currency", e.target.value)}
            placeholder="Select a country first"
          />
          <div className="form-hint">Auto-detected from country</div>
          {errors.currency && (
            <div className="form-error">{errors.currency}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Account type</label>
          <select
            className="form-select"
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            {ACCOUNT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Initial balance</label>
          <input
            className="form-input"
            type="text"
            placeholder="0.00"
            value={form.initialBalance}
            onChange={(e) => handleChange("initialBalance", e.target.value)}
          />
          {errors.initialBalance && (
            <div className="form-error">{errors.initialBalance}</div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Interest rate (optional)</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g. 4.5"
            value={form.interestRate}
            onChange={(e) => handleChange("interestRate", e.target.value)}
          />
          <div className="form-hint">Annual percentage rate</div>
          {errors.interestRate && (
            <div className="form-error">{errors.interestRate}</div>
          )}
        </div>
        <div className="form-group">
          <label className="form-label">Visibility</label>
          <select
            className="form-select"
            value={form.visibility}
            onChange={(e) => handleChange("visibility", e.target.value)}
          >
            {VISIBILITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tags (optional)</label>
        <input
          className="form-input"
          type="text"
          placeholder="e.g. Primary, Emergency fund (comma separated)"
          value={form.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
        />
        <div className="form-hint">Separate tags with commas</div>
      </div>

      <div className="form-actions">
        <button className="btn-cancel" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          Add account
        </button>
      </div>
    </Modal>
  );
}
