export type MoneyCurrency = 'PEN' | 'USD' | string;

export function currencySymbol(currency: MoneyCurrency): string {
  const code = String(currency).toUpperCase();
  return code === 'PEN' ? 'S/' : '$';
}

export interface FormatMoneyOptions {
  decimals?: boolean;
  minFractionDigits?: number;
  maximumFractionDigits?: number;
}

/** Formats an amount in its native currency (no conversion). */
export function formatMoney(
  amount: number | null | undefined,
  currency: MoneyCurrency,
  options: FormatMoneyOptions = {}
): string {
  if (amount == null || Number.isNaN(amount)) return '';
  const {
    decimals = true,
    minFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  const symbol = currencySymbol(currency);
  const formatted = decimals
    ? amount.toLocaleString('en-US', {
        minimumFractionDigits: minFractionDigits,
        maximumFractionDigits: maximumFractionDigits,
      })
    : Math.round(amount).toLocaleString('en-US');

  return `${symbol}${formatted}`;
}
