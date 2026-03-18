/* ============================================
   TRANSACTION DETAIL MODAL
   Shows all details of a transaction.
   Allows editing and deletion (with confirmation).
   ============================================ */

import { useState } from "react";
import { type Transaction } from "../../models/types";
import { formatCurrency } from "../../utils/formatters";
import { CATEGORY_CONFIG } from "../../constants/categories";
import CategoryIcon from "../common/CategoryIcon";
import Modal from "../common/Modal";
import "./TransactionDetailModal.css";

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionDetailModal({
  transaction,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TransactionDetailModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!transaction) return null;

  const amountClass =
    transaction.type === "expense"
      ? "negative"
      : transaction.type === "income"
        ? "positive"
        : "neutral";

  const amountPrefix =
    transaction.type === "expense"
      ? "-"
      : transaction.type === "income"
        ? "+"
        : "";

  const categoryConfig = CATEGORY_CONFIG[transaction.category];

  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const sourceName =
    transaction.type === "transfer" && transaction.transferToName
      ? `${transaction.sourceName} → ${transaction.transferToName}`
      : transaction.sourceName;

  function handleDelete() {
    if (!transaction) return;
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    onDelete(transaction.id);
    setShowDeleteConfirm(false);
    onClose();
  }

  function handleClose() {
    setShowDeleteConfirm(false);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Transaction details"
      onClose={handleClose}
      width="md"
    >
      {/* Header with icon, title, and amount */}
      <div className="txDetail-header">
        <div className="txDetail-headerLeft">
          <CategoryIcon category={transaction.category} size={36} />
          <div>
            <div className="txDetail-title">{transaction.title}</div>
            <div className="txDetail-subtitle">
              {categoryConfig.label} ·{" "}
              {transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1)}
            </div>
          </div>
        </div>
        <div className={`txDetail-amount ${amountClass}`}>
          {amountPrefix}
          {formatCurrency(transaction.amount, transaction.currency)}
        </div>
      </div>

      {/* Detail grid */}
      <div className="txDetail-grid">
        <div className="txDetail-item">
          <div className="txDetail-label">Transaction date</div>
          <div className="txDetail-value">{formattedDate}</div>
        </div>
        <div className="txDetail-item">
          <div className="txDetail-label">Currency</div>
          <div className="txDetail-value">{transaction.currency}</div>
        </div>
        <div className="txDetail-item">
          <div className="txDetail-label">Source</div>
          <div className="txDetail-value">{sourceName}</div>
        </div>
        <div className="txDetail-item">
          <div className="txDetail-label">Category</div>
          <div className="txDetail-value">{categoryConfig.label}</div>
        </div>
        <div className="txDetail-item">
          <div className="txDetail-label">Type</div>
          <div className="txDetail-value">
            <span className={`txDetail-typeBadge ${transaction.type}`}>
              {transaction.type.charAt(0).toUpperCase() +
                transaction.type.slice(1)}
            </span>
          </div>
        </div>
        <div className="txDetail-item">
          <div className="txDetail-label">Recurrence</div>
          <div className="txDetail-value">
            {transaction.recurrence === "none"
              ? "One-time"
              : transaction.recurrence.charAt(0).toUpperCase() +
                transaction.recurrence.slice(1)}
          </div>
        </div>
        {transaction.description && (
          <div className="txDetail-item txDetail-full">
            <div className="txDetail-label">Description</div>
            <div className="txDetail-value">{transaction.description}</div>
          </div>
        )}
        {transaction.notes && (
          <div className="txDetail-item txDetail-full">
            <div className="txDetail-label">Notes</div>
            <div className="txDetail-value">{transaction.notes}</div>
          </div>
        )}
        <div className="txDetail-item txDetail-full">
          <div className="txDetail-label">Tags</div>
          <div className="txDetail-value">
            {transaction.tags.length > 0 ? (
              <div className="txDetail-tags">
                {transaction.tags.map((tag) => (
                  <span key={tag} className="txDetail-tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="txDetail-empty">No tags</span>
            )}
          </div>
        </div>
        <div className="txDetail-item txDetail-full">
          <div className="txDetail-label">Attachments</div>
          <div className="txDetail-value">
            <span className="txDetail-empty">No attachments (coming soon)</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="txDetail-actions">
        <button className="txDetail-btn" onClick={() => onEdit(transaction)}>
          Edit
        </button>
        {showDeleteConfirm ? (
          <div className="txDetail-confirmDelete">
            <span className="txDetail-confirmText">Are you sure?</span>
            <button className="txDetail-btn danger" onClick={handleDelete}>
              Yes, delete
            </button>
            <button
              className="txDetail-btn"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button className="txDetail-btn danger" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </Modal>
  );
}
