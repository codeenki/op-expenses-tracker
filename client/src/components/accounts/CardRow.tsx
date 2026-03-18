/* ============================================
   CARD ROW COMPONENT
   Expandable row for credit/debit cards.
   Shows credit utilization bar, important dates,
   and available credit for credit cards.
   ============================================ */

import { useState } from "react";
import { type Card, type Account } from "../../models/types";
import { formatCurrency, getDaysUntil } from "../../utils/formatters";
import { CARD_NETWORK_CONFIG } from "../../constants/accounts";
import "./CardRow.css";

interface CardRowProps {
  card: Card;
  accounts: Account[];
  onEdit: (id: string) => void;
  onDeactivate: (id: string) => void;
}

export default function CardRow({
  card,
  accounts,
  onEdit,
  onDeactivate,
}: CardRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const networkConfig = CARD_NETWORK_CONFIG[card.network];
  const associatedAccount = card.associatedAccountId
    ? accounts.find((a) => a.id === card.associatedAccountId)
    : null;

  const debt = Math.abs(card.currentBalance);
  const limit = card.creditLimit || 0;
  const available = limit - debt;
  const utilizationPercent = limit > 0 ? Math.round((debt / limit) * 100) : 0;

  const utilizationClass =
    utilizationPercent > 75
      ? "danger"
      : utilizationPercent > 50
        ? "warn"
        : "ok";

  return (
    <div className="cardRow">
      <div
        className="cardRow-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="cardRow-left">
          <div
            className="cardRow-visual"
            style={{ background: networkConfig.gradient }}
          >
            {networkConfig.label}
          </div>
          <div>
            <div className="cardRow-name">{card.name}</div>
            <div className="cardRow-meta">
              <span className="cardRow-status">
                <span className={`cardRow-statusDot ${card.status}`} />
                {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
              </span>
              <span className="cardRow-separator">·</span>
              <span>
                {card.type === "credit" ? "Credit" : "Debit"} · ••••{" "}
                {card.lastFourDigits}
              </span>
              <span className="cardRow-separator">·</span>
              <span>{card.bank}</span>
              {!card.includeInGlobalBalance && (
                <span className="cardRow-tagExcluded">
                  Excluded from global
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="cardRow-right">
          <div className="cardRow-balance">
            <div
              className={`cardRow-balanceVal ${card.currentBalance < 0 ? "negative" : ""}`}
            >
              {formatCurrency(card.currentBalance)}
            </div>
            <div className="cardRow-balanceLabel">Current balance</div>
          </div>
          <div className={`cardRow-chevron ${isExpanded ? "open" : ""}`}>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="cardRow-details">
          {/* Credit utilization bar — credit cards only */}
          {card.type === "credit" && limit > 0 && (
            <div className="cardRow-creditBar">
              <div className="cardRow-creditLabels">
                <span>Used: {formatCurrency(debt)}</span>
                <span>Limit: {formatCurrency(limit)}</span>
              </div>
              <div className="cardRow-barTrack">
                <div
                  className={`cardRow-barFill ${utilizationClass}`}
                  style={{ width: `${utilizationPercent}%` }}
                />
              </div>
              <div className={`cardRow-creditAvailable ${utilizationClass}`}>
                {formatCurrency(available)} available (
                {100 - utilizationPercent}%)
              </div>
            </div>
          )}

          {/* Important dates — credit cards only */}
          {card.type === "credit" && (
            <div className="cardRow-dates">
              <div className="cardRow-dateBox">
                <div className="cardRow-dateLabel">Statement closing date</div>
                <div className="cardRow-dateValue">
                  {card.statementClosingDate
                    ? new Date(card.statementClosingDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )
                    : "—"}
                </div>
                {card.statementClosingDate && (
                  <DateUrgency dateString={card.statementClosingDate} />
                )}
              </div>
              <div className="cardRow-dateBox">
                <div className="cardRow-dateLabel">Payment due date</div>
                <div className="cardRow-dateValue">
                  {card.paymentDueDate
                    ? new Date(card.paymentDueDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric" },
                      )
                    : "—"}
                </div>
                {card.paymentDueDate && (
                  <DateUrgency dateString={card.paymentDueDate} />
                )}
              </div>
            </div>
          )}

          <div className="cardRow-detailsGrid">
            <div className="cardRow-detailItem">
              <div className="cardRow-detailLabel">Associated account</div>
              <div className="cardRow-detailValue">
                {associatedAccount ? associatedAccount.name : "—"}
              </div>
            </div>
            <div className="cardRow-detailItem">
              <div className="cardRow-detailLabel">Network</div>
              <div className="cardRow-detailValue">
                {card.network.charAt(0).toUpperCase() + card.network.slice(1)}
              </div>
            </div>
          </div>
          <div className="cardRow-detailItem">
            <div className="cardRow-detailLabel">In global balance</div>
            <div className="cardRow-detailValue">
              {card.includeInGlobalBalance ? "Yes" : "No"}
            </div>
          </div>
          <div className="cardRow-actions">
            <button className="cardRow-btn" onClick={() => onEdit(card.id)}>
              Edit
            </button>
            <button className="cardRow-btn" onClick={() => onEdit(card.id)}>
              View expenses
            </button>
            <button
              className="cardRow-btn danger"
              onClick={() => onDeactivate(card.id)}
            >
              {card.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DateUrgency({ dateString }: { dateString: string }) {
  const urgency = getDaysUntil(dateString);
  if (!urgency) return null;
  return <div className="cardRow-dateUrgency">{urgency}</div>;
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
