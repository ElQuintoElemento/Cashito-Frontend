import { Component, Input, Output, EventEmitter, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Credit } from '../../../domain/models/credit.model';
import { Installment } from '../../../domain/models/installment.model';
import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';

import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { LucideAngularModule } from 'lucide-angular';
import { TableWrapperComponent, TableDirective, TableHeaderDirective, TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective } from '../../../../../shared/ui/table/table.component';
import { CurrencyService } from '../../../../../core/config/currency.service';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';

export interface CalendarMonth {
  year: number;
  month: number;
  label: string;
  startWeekday: number;
  daysInMonth: number;
  payments: { day: number; installment: Installment }[];
}

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December'];
const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

@Component({
  standalone: true,
  selector: 'app-credit-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, CardComponent, BadgeComponent, ButtonDirective,
    LucideAngularModule, TableWrapperComponent, TableDirective,
    TableHeaderDirective, TableBodyDirective, TableRowDirective,
    TableHeadDirective, TableCellDirective, EmptyStateComponent
  ],
  templateUrl: './credit-detail.component.html'
})
export class CreditDetailComponent {

  public currencyService = inject(CurrencyService);

  private _credit: Credit | null = null;
  @Input()
  set credit(val: Credit | null) { this._credit = val; }
  get credit() { return this._credit; }

  private _schedule: Installment[] = [];
  @Input()
  set schedule(val: Installment[]) {
    this._schedule = val;
    this.scheduleSignal.set(val);
  }
  get schedule() { return this._schedule; }

  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() close = new EventEmitter<void>();

  activeTab = signal<'overview' | 'schedule'>('overview');
  viewMode = signal<'table' | 'calendar'>('table');
  scheduleSignal = signal<Installment[]>([]);

  progress = computed(() => {
    const s = this.scheduleSignal();
    if (!s.length) return 0;
    return Math.round((s.filter(i => i.isPaid).length / s.length) * 100);
  });

  totalPaid = computed(() =>
    this.scheduleSignal().filter(i => i.isPaid).reduce((a, c) => a + c.totalPayment, 0)
  );

  totalPending = computed(() =>
    this.scheduleSignal().filter(i => !i.isPaid).reduce((a, c) => a + c.totalPayment, 0)
  );

  calendarMonths = computed((): CalendarMonth[] => {
    const schedule = this.scheduleSignal();
    if (!schedule.length) return [];

    const byMonth = new Map<string, CalendarMonth>();
    for (const s of schedule) {
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

  getClientName(id: number | undefined) {
    if (!id) return '';
    const c = this.clients.find(x => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : '';
  }

  getVehicle(id: number | undefined) {
    if (!id) return '';
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.brand} ${v.model}` : '';
  }

  getBadgeVariant(status: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status?.toLowerCase()) {
      case 'simulated': return 'secondary';
      case 'approved': return 'default';
      case 'active': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  }

  setTab(tab: 'overview' | 'schedule') { this.activeTab.set(tab); }
  setViewMode(mode: 'table' | 'calendar') { this.viewMode.set(mode); }

  trackByNumber(index: number, item: Installment): number { return item.number; }
  trackByKey(index: number, item: CalendarMonth): string { return `${item.year}-${item.month}`; }

  getPaymentForDay(month: CalendarMonth, day: number): Installment | null {
    return month.payments.find(p => p.day === day)?.installment ?? null;
  }

  range(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }
}
