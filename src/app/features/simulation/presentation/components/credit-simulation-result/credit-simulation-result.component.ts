import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSimulationResponse } from '../../../domain/models/credit-simulation-response';
import { CreditSimulationRequest } from '../../../domain/models/credit-simulation.model';
import { CardComponent, CardContentComponent } from '../../../../../shared/ui/card/card.component';
import {
  TableWrapperComponent,
  TableDirective,
  TableHeaderDirective,
  TableBodyDirective,
  TableRowDirective,
  TableHeadDirective,
  TableCellDirective,
} from '../../../../../shared/ui/table/table.component';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { formatMoney } from '../../../../../shared/utils/money-format';
import {
  PaymentCalendarComponent,
  CalendarPayment,
} from '../../../../../shared/ui/payment-calendar/payment-calendar.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-credit-simulation-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    CardContentComponent,
    TableWrapperComponent,
    TableDirective,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective,
    LucideAngularModule,
    ButtonDirective,
    PaymentCalendarComponent,
    TranslateModule
  ],
  templateUrl: './credit-simulation-result.component.html',
})
export class CreditSimulationResultComponent {

  @Output() saveCredit = new EventEmitter<void>();

  @Input() currency = 'USD';
  @Input() saving = false;
  @Input() saved = false;

  private _simulation: CreditSimulationResponse | null = null;
  private _request: CreditSimulationRequest | null = null;

  @Input()
  set simulation(val: CreditSimulationResponse | null) {
    this._simulation = val;
    this.simSignal.set(val);
  }
  get simulation(): CreditSimulationResponse | null {
    return this._simulation;
  }

  @Input()
  set request(val: CreditSimulationRequest | null) {
    this._request = val;
    this.requestSignal.set(val);
  }
  get request(): CreditSimulationRequest | null {
    return this._request;
  }

  simSignal = signal<CreditSimulationResponse | null>(null);
  requestSignal = signal<CreditSimulationRequest | null>(null);
  viewMode = signal<'table' | 'calendar'>('table');

  nominalFinancedAmount = computed(() => {
    const req = this.requestSignal();
    if (!req) return 0;
    return req.vehiclePrice - req.downPayment;
  });

  totalUpfrontExpenses = computed(() => {
    const req = this.requestSignal();
    if (!req) return 0;
    return (
      (req.disbursementFee ?? 0) +
      (req.evaluationFee ?? 0) +
      (req.notaryExpenses ?? 0) +
      (req.soatAmount ?? 0)
    );
  });

  netDisbursed = computed(() => {
    return this.nominalFinancedAmount() - this.totalUpfrontExpenses();
  });

  hasSimulation = computed(() => this.simSignal() != null);

  totalInterest = computed(() => {
    const sim = this.simSignal();
    if (!sim) return 0;
    return sim.schedule.reduce((acc, curr) => acc + curr.interest, 0);
  });

  financedCapital = computed(() => {
    const sim = this.simSignal();
    if (!sim || sim.schedule.length === 0) return 0;
    return sim.schedule[0].remainingBalance + sim.schedule[0].amortization;
  });

  totalAmount = computed(() => {
    const sim = this.simSignal();
    if (!sim) return 0;
    return sim.schedule.reduce((acc, curr) => acc + curr.totalPayment, 0);
  });

  calendarPayments = computed((): CalendarPayment[] => {
    const sim = this.simSignal();
    if (!sim) return [];
    return sim.schedule.map(s => ({
      number: s.number,
      date: s.date,
      totalPayment: s.totalPayment,
      isPaid: s.isPaid,
      status: s.status,
    }));
  });

  formatAmount = (amount: number) => formatMoney(amount, this.currency);

  setViewMode(mode: 'table' | 'calendar') {
    this.viewMode.set(mode);
  }

  trackByNumber(_index: number, item: { number: number }): number {
    return item.number;
  }
}
