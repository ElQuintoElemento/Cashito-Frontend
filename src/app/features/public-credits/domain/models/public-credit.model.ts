export interface PublicCreditDetail {
  id: number;
  publicToken: string;
  status: string;
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
}

