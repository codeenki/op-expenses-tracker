/* ============================================
   DASHBOARD CARD COMPONENT
   Wrapper for each section on the Dashboard.
   Provides consistent card styling with a title
   and optional action link.
   ============================================ */

import type { ReactNode } from "react";
import "./DashboardCard.css";

interface DashboardCardProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
}

export default function DashboardCard({
  title,
  actionLabel,
  onAction,
  children,
}: DashboardCardProps) {
  return (
    <div className="dashCard">
      <div className="dashCard-header">
        <h3 className="dashCard-title">{title}</h3>
        {actionLabel && onAction && (
          <button className="dashCard-link" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
