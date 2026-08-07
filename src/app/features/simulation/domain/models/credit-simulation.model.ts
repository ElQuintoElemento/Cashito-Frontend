import { GraceType } from '../../../../shared/domain/grace-type';

export interface CreditSimulationRequest {
  clientId: number;
  vehicleId: number;
  vehiclePrice: number;
  currency: string;
  downPayment: number;
  interestRate: number;
  termMonths: number;
  rateType: 'TEA' | 'TNA';
  gracePeriod: number;
  graceType: GraceType;
  insurance: number;
  capitalization?: string;
  desgravamenInsuranceRate: number;
  vehicularInsuranceRate: number;
  portes: number;
  disbursementFee: number;
  evaluationFee: number;
  notaryExpenses: number;
  soatAmount: number;
  otherExpenses: number;
  balloonPaymentPercentage: number;
  opportunityRate: number;
}
