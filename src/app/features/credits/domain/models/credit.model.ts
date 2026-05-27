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
}
