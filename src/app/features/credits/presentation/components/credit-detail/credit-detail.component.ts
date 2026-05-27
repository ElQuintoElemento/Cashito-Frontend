import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { Credit } from '../../../domain/models/credit.model';
import { Installment } from '../../../domain/models/installment.model';
import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';

import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { LucideAngularModule } from 'lucide-angular';
import {
  TableWrapperComponent,
  TableDirective,
  TableHeaderDirective,
  TableBodyDirective,
  TableRowDirective,
  TableHeadDirective,
  TableCellDirective,
} from '../../../../../shared/ui/table/table.component';
import { CurrencyService } from '../../../../../core/config/currency.service';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { MoneyPipe } from '../../../../../shared/pipes/money.pipe';
import {
  PaymentCalendarComponent,
  CalendarPayment,
} from '../../../../../shared/ui/payment-calendar/payment-calendar.component';

@Component({
  standalone: true,
  selector: 'app-credit-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    BadgeComponent,
    ButtonDirective,
    LucideAngularModule,
    TableWrapperComponent,
    TableDirective,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective,
    EmptyStateComponent,
    MoneyPipe,
    PaymentCalendarComponent,
  ],
  templateUrl: './credit-detail.component.html',
})
export class CreditDetailComponent {

  readonly currencyService = inject(CurrencyService);

  private _credit: Credit | null = null;
  @Input()
  set credit(val: Credit | null) {
    this._credit = val;
  }
  get credit(): Credit | null {
    return this._credit;
  }

  private _schedule: Installment[] = [];
  @Input()
  set schedule(val: Installment[]) {
    this._schedule = val;
    this.scheduleSignal.set(val);
  }
  get schedule(): Installment[] {
    return this._schedule;
  }

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

  calendarPayments = computed((): CalendarPayment[] =>
    this.scheduleSignal().map(s => ({
      number: s.number,
      date: s.date,
      totalPayment: s.totalPayment,
      isPaid: s.isPaid,
      status: s.status,
    }))
  );

  calendarFormatPayment = (amount: number): string => {
    const currency = this.credit?.currency || 'USD';
    const converted = this.currencyService.convert(amount, currency);
    const display = this.currencyService.currency();
    return `${display === 'PEN' ? 'S/' : '$'}${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  getClientName(id: number | undefined): string {
    if (!id) return '';
    const c = this.clients.find(x => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : '';
  }

  getVehicle(id: number | undefined): string {
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

  setTab(tab: 'overview' | 'schedule'): void {
    this.activeTab.set(tab);
  }

  setViewMode(mode: 'table' | 'calendar'): void {
    this.viewMode.set(mode);
  }

  trackByNumber(_index: number, item: Installment): number {
    return item.number;
  }
}
