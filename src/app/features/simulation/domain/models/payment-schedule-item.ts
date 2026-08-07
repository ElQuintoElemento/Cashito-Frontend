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
  baseInstallment?: number;
  beginningBalance?: number;
  desgravamenInsurance?: number;
  vehicularInsurance?: number;
  portes?: number;
  otherExpenses?: number;
  cashFlow?: number;
  isBalloon?: boolean;
  balloonAmount?: number;
}
