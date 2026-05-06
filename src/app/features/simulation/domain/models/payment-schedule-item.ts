export interface PaymentScheduleItem {
  number: number;
  date: string;
  totalPayment: number;
  interest: number;
  amortization: number;
  remainingBalance: number;
  isPaid: boolean;
  paidAt: string | null;
  status: string;
}
