/* ============================================
   ADD ACCOUNT MODAL
   Form for creating a new bank account or
   cash account. When cash is selected, the
   form simplifies (no bank, no country, no
   interest rate).
   ============================================ */

import { useState } from "react";
import { type AccountType, type Visibility } from "../../models/types";
import {
  COUNTRIES,
  ACCOUNT_TYPE_OPTIONS,
  VISIBILITY_OPTIONS,
  CURRENCIES,
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
  location: string;
  includeInGlobalBalance: boolean;
}

const INITIAL_FORM: AccountFormData = {
  name: "",
  bankInstitution: "",
  country: "",
  currency: "USD",
  type: "checking",
  initialBalance: "",
  interestRate: "",
  visibility: "private",
  tags: "",
  location: "",
  includeInGlobalBalance: true,
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

  const isCash = form.type === "cash";

  function handleChange(field: keyof AccountFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "country" && typeof value === "string") {
      const country = COUNTRIES.find((c) => c.code === value);
      if (country) {
        setForm((prev) => ({
          ...prev,
          country: value as string,
          currency: country.currency,
        }));
      }
    }

    if (field === "type" && value === "cash") {
      setForm((prev) => ({
        ...prev,
        type: "cash",
        bankInstitution: "",
        country: "",
        interestRate: "",
        name: prev.name || "Cash",
      }));
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof AccountFormData, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!isCash) {
      if (!form.bankInstitution.trim())
        newErrors.bankInstitution = "Bank institution is required";
      if (!form.country) newErrors.country = "Country is required";
    }

    if (!form.currency) newErrors.currency = "Currency is required";

    if (!form.initialBalance.trim()) {
      newErrors.initialBalance = "Balance is required";
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
    <Modal
      isOpen={isOpen}
      title={isCash ? "Add cash account" : "Add account"}
      onClose={handleClose}
      width="md"
    >
      {/* Account type selector */}
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

      {/* Name + Bank (or Name + Location for cash) */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            {isCash ? "Cash account name" : "Account name"}
          </label>
          <input
            className="form-input"
            type="text"
            placeholder={
              isCash ? "e.g. Wallet, Home safe" : "e.g. BAC Checking"
            }
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
        {isCash ? (
          <div className="form-group">
            <label className="form-label">Location (optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Home, Office, Car"
              value={form.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
            <div className="form-hint">Where is this cash stored?</div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Country + Currency (bank accounts) or just Currency (cash) */}
      {isCash ? (
        <div className="form-row">
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
            {errors.currency && (
              <div className="form-error">{errors.currency}</div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Current balance</label>
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
      ) : (
        <>
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
              {errors.country && (
                <div className="form-error">{errors.country}</div>
              )}
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
          </div>
        </>
      )}

      {/* Include in global balance toggle */}
      <div className="form-group">
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            fontSize: "var(--font-size-sm)",
            color: "var(--color-text-primary)",
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
        <div className="form-hint" style={{ marginLeft: "24px" }}>
          When enabled, this account's balance counts toward your total
        </div>
      </div>

      {/* Visibility + Tags (not shown for cash to keep it simple) */}
      {!isCash && (
        <div className="form-row">
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
          <div className="form-group">
            <label className="form-label">Tags (optional)</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Primary, Emergency fund"
              value={form.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
            />
            <div className="form-hint">Separate tags with commas</div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn-cancel" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn-submit" onClick={handleSubmit}>
          {isCash ? "Add cash account" : "Add account"}
        </button>
      </div>
    </Modal>
  );
}
