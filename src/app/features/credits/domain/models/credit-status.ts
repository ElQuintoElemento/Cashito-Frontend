export type CreditStatus =
  | 'Simulated'
  | 'Approved'
  | 'Active'
  | 'Completed'
  | 'Rejected';

const CREDIT_STATUS_BY_VALUE: CreditStatus[] = [
  'Simulated',
  'Approved',
  'Active',
  'Completed',
  'Rejected',
];

export function normalizeCreditStatus(status: CreditStatus | string | number | null | undefined): CreditStatus | '' {
  if (typeof status === 'number') {
    return CREDIT_STATUS_BY_VALUE[status] ?? '';
  }

  const normalized = String(status ?? '').trim().toLowerCase();
  return CREDIT_STATUS_BY_VALUE.find(value => value.toLowerCase() === normalized) ?? '';
}
