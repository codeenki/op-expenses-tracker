/* ============================================
   UPCOMING PAYMENTS COMPONENT
   Shows upcoming recurring payments with due
   dates and urgency badges.
   ============================================ */

import type { RecurringPayment } from "../../models/types";
import { formatCurrency, getDaysUntil } from "../../utils/formatters";
import EmptyState from "../common/EmptyState";
import "./UpcomingPayments.css";

interface UpcomingPaymentsProps {
  payments: RecurringPayment[];
  onAddPayment: () => void;
}

export default function UpcomingPayments({
  payments,
  onAddPayment,
}: UpcomingPaymentsProps) {
  if (payments.length === 0) {
    return (
      <EmptyState
        icon={<PaymentEmptyIcon />}
        message="No recurring payments set up. Add your subscriptions and bills to stay on top of due dates."
        actionLabel="Add payment"
        onAction={onAddPayment}
      />
    );
  }

  return (
    <div className="upcomingPayments">
      {payments.map((payment) => {
        const urgency = getDaysUntil(payment.nextDueDate);
        const formattedDate = new Date(payment.nextDueDate).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          },
        );

        return (
          <div key={payment.id} className="upcomingPayments-row">
            <div>
              <span className="upcomingPayments-name">{payment.name}</span>
              <span className="upcomingPayments-due">
                Due {formattedDate}
                {urgency && (
                  <span className="upcomingPayments-badge">{urgency}</span>
                )}
              </span>
            </div>
            <span className="upcomingPayments-amount">
              -{formatCurrency(payment.amount)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function PaymentEmptyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect
        x="2"
        y="3"
        width="14"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M2 7h14M6 1v4M12 1v4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
