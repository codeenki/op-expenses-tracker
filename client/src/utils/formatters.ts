/* ============================================
   UTILITY FUNCTIONS
   Shared helpers used across the app.
   ============================================ */

/**
 * Formats a cent value to a currency string.
 * Example: 1250 → "$12.50"
 *
 * We store all money as integers (cents) to avoid
 * floating point issues. This function converts
 * cents to a human-readable format.
 */
export function formatCurrency(
  cents: number,
  currency: string = "USD",
): string {
  const amount = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a date string to a human-readable relative format.
 * Examples: "Today, 12:34 PM" | "Yesterday" | "Mar 15"
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  if (dateOnly.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })}`;
  }

  if (dateOnly.getTime() === yesterday.getTime()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Calculates how many days until a given date.
 * Returns a human-readable string or null if not soon.
 */
export function getDaysUntil(dateString: string): string | null {
  const target = new Date(dateString);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `${diffDays} days`;
  return null;
}
