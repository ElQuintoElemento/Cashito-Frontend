import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSimulationResponse } from '../../../domain/models/credit-simulation-response';
import { CardComponent, CardContentComponent } from '../../../../../shared/ui/card/card.component';
import { TableWrapperComponent, TableDirective, TableHeaderDirective, TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective } from '../../../../../shared/ui/table/table.component';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';

export interface CalendarMonth {
  year: number;
  month: number;
  label: string;
  startWeekday: number;
  daysInMonth: number;
  payments: { day: number; installment: any }[];
}

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

@Component({
  standalone: true,
  selector: 'app-credit-simulation-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, CardComponent, CardContentComponent, TableWrapperComponent, TableDirective,
    TableHeaderDirective, TableBodyDirective, TableRowDirective,
    TableHeadDirective, TableCellDirective,
    LucideAngularModule, ButtonDirective
  ],
  templateUrl: './credit-simulation-result.component.html'
})
export class CreditSimulationResultComponent {

  @Output() saveCredit = new EventEmitter<void>();

  private _simulation: CreditSimulationResponse | null = null;

  @Input()
  set simulation(val: CreditSimulationResponse | null) {
    this._simulation = val;
    this.simSignal.set(val);
  }
  get simulation(): CreditSimulationResponse | null {
    return this._simulation;
  }

  simSignal = signal<CreditSimulationResponse | null>(null);
  viewMode = signal<'table' | 'calendar'>('table');

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

  calendarMonths = computed((): CalendarMonth[] => {
    const sim = this.simSignal();
    if (!sim || !sim.schedule.length) return [];

    const byMonth = new Map<string, CalendarMonth>();

    for (const s of sim.schedule) {
      const d = new Date(s.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${m}`;

      if (!byMonth.has(key)) {
        byMonth.set(key, {
          year: y, month: m,
          label: `${MONTH_NAMES[m]} ${y}`,
          startWeekday: new Date(y, m, 1).getDay(),
          daysInMonth: new Date(y, m + 1, 0).getDate(),
          payments: []
        });
      }
      byMonth.get(key)!.payments.push({ day: d.getDate(), installment: s });
    }

    return Array.from(byMonth.values());
  });

  readonly dayAbbr = DAY_ABBR;

  setViewMode(mode: 'table' | 'calendar') {
    this.viewMode.set(mode);
  }

  trackByNumber(index: number, item: any): number {
    return item.number;
  }

  trackByKey(index: number, item: CalendarMonth): string {
    return `${item.year}-${item.month}`;
  }

  getPaymentForDay(month: CalendarMonth, day: number): any | null {
    return month.payments.find(p => p.day === day)?.installment ?? null;
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
