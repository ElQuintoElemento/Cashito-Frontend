import { CreditStatus } from '../../../credits/domain/models/credit-status';

export interface PublicCreditDetail {
  id: number;
  publicToken: string;
  status: CreditStatus | string | number;
  clientId?: number;
  vehicleId?: number;
  vehiclePrice?: number;
  currency: string;
  downPayment?: number;
  financedAmount?: number;
  interestRate?: number;
  termMonths?: number;
  rateType?: string;
  gracePeriod?: number;
  graceType?: string;
  tcea?: number;
  van?: number;
  tir?: number;
  cuota?: number;
  monthlyPayment?: number;
  capitalization?: string;
  desgravamenInsuranceRate?: number;
  vehicularInsuranceRate?: number;
  portes?: number;
  disbursementFee?: number;
  evaluationFee?: number;
  notaryExpenses?: number;
  soatAmount?: number;
  otherExpenses?: number;
  amortizableCapital?: number;
  initialPaymentPercentage?: number;
  balloonPaymentPercentage?: number;
  balloonPaymentAmount?: number;
  baseInstallment?: number;
  opportunityRate?: number;
}

export interface PublicInstallment {
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

