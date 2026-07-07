import { CreditStatus } from './credit-status';
import { GraceType } from '../../../../shared/domain/grace-type';

export interface Credit {
  id: number;
  clientId: number;
  vehicleId: number;

  vehiclePrice: number;
  currency: string;

  downPayment: number;
  financedAmount: number;

  interestRate: number;
  termMonths: number;
  rateType: 'TEA' | 'TNA';

  gracePeriod: number;
  graceType: GraceType;
  insurance: number;

  tcea: number;
  van: number;
  tir: number;

  status: CreditStatus;
  publicToken: string;
  capitalization?: string;

  desgravamenInsuranceRate: number;
  vehicularInsuranceRate: number;
  portes: number;
  disbursementFee: number;
  evaluationFee: number;
  notaryExpenses: number;
  soatAmount: number;
  otherExpenses: number;
  amortizableCapital: number;
  initialPaymentPercentage: number;
  balloonPaymentPercentage: number;
  balloonPaymentAmount: number;
  baseInstallment: number;
  opportunityRate: number;
}
