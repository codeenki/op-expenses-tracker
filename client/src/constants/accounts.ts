/* ============================================
   COUNTRY, CURRENCY & ACCOUNT CONSTANTS
   ============================================ */

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
}

export const COUNTRIES: CountryConfig[] = [
  { code: "CR", name: "Costa Rica", currency: "CRC", currencySymbol: "₡" },
  { code: "US", name: "United States", currency: "USD", currencySymbol: "$" },
  { code: "MX", name: "Mexico", currency: "MXN", currencySymbol: "$" },
  { code: "CO", name: "Colombia", currency: "COP", currencySymbol: "$" },
  { code: "PA", name: "Panama", currency: "USD", currencySymbol: "$" },
  { code: "GT", name: "Guatemala", currency: "GTQ", currencySymbol: "Q" },
  { code: "SV", name: "El Salvador", currency: "USD", currencySymbol: "$" },
  { code: "HN", name: "Honduras", currency: "HNL", currencySymbol: "L" },
  { code: "NI", name: "Nicaragua", currency: "NIO", currencySymbol: "C$" },
  { code: "BR", name: "Brazil", currency: "BRL", currencySymbol: "R$" },
  { code: "AR", name: "Argentina", currency: "ARS", currencySymbol: "$" },
  { code: "CL", name: "Chile", currency: "CLP", currencySymbol: "$" },
  { code: "PE", name: "Peru", currency: "PEN", currencySymbol: "S/" },
  { code: "EC", name: "Ecuador", currency: "USD", currencySymbol: "$" },
  { code: "GB", name: "United Kingdom", currency: "GBP", currencySymbol: "£" },
  { code: "EU", name: "European Union", currency: "EUR", currencySymbol: "€" },
  { code: "CA", name: "Canada", currency: "CAD", currencySymbol: "C$" },
  { code: "JP", name: "Japan", currency: "JPY", currencySymbol: "¥" },
  { code: "KR", name: "South Korea", currency: "KRW", currencySymbol: "₩" },
  { code: "CN", name: "China", currency: "CNY", currencySymbol: "¥" },
];

export const CURRENCIES = Array.from(
  new Map(
    COUNTRIES.map((c) => [
      c.currency,
      { code: c.currency, symbol: c.currencySymbol },
    ]),
  ).values(),
);

/**
 * Account type labels for display.
 * Cash is included but handled differently in forms.
 */
export const ACCOUNT_TYPE_OPTIONS = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "investment", label: "Investment" },
  { value: "enterprise", label: "Enterprise" },
  { value: "cash", label: "Cash" },
] as const;

/**
 * Bank account types only (excludes cash).
 */
export const BANK_ACCOUNT_TYPE_OPTIONS = [
  { value: "checking", label: "Checking" },
  { value: "savings", label: "Savings" },
  { value: "investment", label: "Investment" },
  { value: "enterprise", label: "Enterprise" },
] as const;

export const VISIBILITY_OPTIONS = [
  { value: "private", label: "Private" },
  { value: "shared", label: "Shared" },
  { value: "public", label: "Public" },
] as const;

export function detectCardNetwork(
  firstDigit: string,
): "visa" | "mastercard" | "amex" | "other" {
  switch (firstDigit) {
    case "4":
      return "visa";
    case "5":
      return "mastercard";
    case "3":
      return "amex";
    default:
      return "other";
  }
}

export const CARD_NETWORK_CONFIG: Record<
  string,
  { label: string; gradient: string }
> = {
  visa: {
    label: "VISA",
    gradient: "linear-gradient(135deg, #1a1f71, #2d4fd4)",
  },
  mastercard: {
    label: "MC",
    gradient: "linear-gradient(135deg, #eb001b, #f79e1b)",
  },
  amex: {
    label: "AMEX",
    gradient: "linear-gradient(135deg, #006fcf, #00b4ff)",
  },
  other: { label: "••••", gradient: "linear-gradient(135deg, #555, #888)" },
};
