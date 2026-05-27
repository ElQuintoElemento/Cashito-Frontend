export interface PublicCreditDetail {
  id: number;
  publicToken: string;
  status: string;
  clientId?: number;
  client?: {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    name?: string;
  };
  clientName?: string;
  clientFullName?: string;
  clientEmail?: string;
  clientPhone?: string;
  vehicleId?: number;
  vehicle?: {
    brand?: string;
    model?: string;
    name?: string;
  };
  vehicleName?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehiclePrice: number;
  currency: string;
  downPayment: number;
  financedAmount: number;
  interestRate: number;
  termMonths: number;
  rateType: string;
  gracePeriod: number;
  graceType?: string;
  tcea: number;
  van: number;
  tir: number;
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

