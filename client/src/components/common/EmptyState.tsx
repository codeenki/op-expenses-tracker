/* ============================================
   EMPTY STATE COMPONENT
   Reusable component shown when a section has
   no data. Displays an icon, message, and an
   optional call-to-action button.
   ============================================ */

import type { ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  icon: ReactNode;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="emptyState">
      <div className="emptyState-icon">{icon}</div>
      <p className="emptyState-message">{message}</p>
      {actionLabel && onAction && (
        <button className="emptyState-btn" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
