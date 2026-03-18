/* ============================================
   STAT CARD COMPONENT
   Displays a single metric with label, value,
   and optional subtitle. Used on the Dashboard
   for global balance, credit debt, cash, etc.
   ============================================ */

import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  subtitleType?: "positive" | "negative" | "neutral";
}

export default function StatCard({
  label,
  value,
  subtitle,
  subtitleType = "neutral",
}: StatCardProps) {
  return (
    <div className="statCard">
      <span className="statCard-label">{label}</span>
      <span className="statCard-value">{value}</span>
      {subtitle && (
        <span className={`statCard-subtitle ${subtitleType}`}>{subtitle}</span>
      )}
    </div>
  );
}
