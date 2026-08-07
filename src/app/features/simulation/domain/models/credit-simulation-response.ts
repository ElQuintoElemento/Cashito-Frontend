import {PaymentScheduleItem} from './payment-schedule-item';

export interface CreditSimulationResponse {
  cuota: number;
  tcea: number;
  van: number;
  tir: number;
  schedule: PaymentScheduleItem[];
}
