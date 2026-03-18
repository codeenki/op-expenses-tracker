/* ============================================
   EDIT ACCOUNT MODAL
   Pre-filled form for editing an existing
   bank account.
   ============================================ */

import { useState } from "react";
import {
  type Account,
  type AccountType,
  type Visibility,
} from "../../models/types";
import {
  COUNTRIES,
  ACCOUNT_TYPE_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../../constants/accounts";
import Modal from "../common/Modal";

interface EditAccountModalProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Account) => void;
}

interface EditAccountForm {
  name: string;
  bankInstitution: string;
  country: string;
  currency: string;
  type: AccountType;
  interestRate: string;
  visibility: Visibility;
  tags: string;
  includeInGlobalBalance: boolean;
}

export default function EditAccountModal({
  account,
  isOpen,
  onClose,
  onSave,
}: EditAccountModalProps) {
  const [prevId, setPrevId] = useState<string | null>(null);
  const [form, setForm] = useState<EditAccountForm>(getInitialForm(null));
  const [errors, setErrors] = useState<
    Partial<Record<keyof EditAccountForm, string>>
  >({});

  if (account && account.id !== prevId) {
    setPrevId(account.id);
    setForm(getInitialForm(account));
    setErrors({});
  }

  const selectedCountry = COUNTRIES.find((c) => c.code === form.country);

  function handleChange(field: keyof EditAccountForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "country") {
      const countryValue = value as string;
      const country = COUNTRIES.find((c) => c.code === countryValue);
      if (country) {
        setForm((prev) => ({
          ...prev,
          country: countryValue,
          currency: country.currency,
        }));
        setErrors({});
      }
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof EditAccountForm, string>> = {};

    if (!form.name.trim()) newErrors.name = "Account name is required";
    if (!form.bankInstitution.trim())
      newErrors.bankInstitution = "Bank institution is required";
    if (!form.country) newErrors.country = "Country is required";
    if (form.interestRate && isNaN(Number(form.interestRate))) {
      newErrors.interestRate = "Must be a valid number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!account || !validate()) return;

    const updated: Account = {
      ...account,
      name: form.name,
      bankInstitution: form.bankInstitution,
      country: form.country,
      currency: form.currency,
      type: form.type,
      interestRate: form.interestRate ? Number(form.interestRate) : undefined,
      visibility: form.visibility,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      includeInGlobalBalance: form.includeInGlobalBalance,
    };

    onSave(updated);
    onClose();
  }

  if (!account) return null;

  return (
    <Modal isOpen={isOpen} title="Edit account" onClose={onClose} width="md">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Account name</label>
          <input
            className="form-input"
            type="text"
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
          />
          <div className="form-hint">Auto-detected from country</div>
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
            placeholder="Comma separated"
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
          />
        </div>
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

function getInitialForm(account: Account | null): EditAccountForm {
  if (!account) {
    return {
      name: "",
      bankInstitution: "",
      country: "",
      currency: "",
      type: "checking",
      interestRate: "",
      visibility: "private",
      tags: "",
      includeInGlobalBalance: true,
    };
  }

  const country = COUNTRIES.find((c) => c.name === account.country);

  return {
    name: account.name,
    bankInstitution: account.bankInstitution,
    country: country?.code || "",
    currency: account.currency,
    type: account.type,
    interestRate: account.interestRate ? String(account.interestRate) : "",
    visibility: account.visibility,
    tags: account.tags.join(", "),
    includeInGlobalBalance: account.includeInGlobalBalance,
  };
}
