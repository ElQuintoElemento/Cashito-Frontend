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
  insurance: number;
}
