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

import { CreditStatus, normalizeCreditStatus } from '../../../domain/models/credit-status';
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
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { MoneyPipe } from '../../../../../shared/pipes/money.pipe';
import { formatMoney } from '../../../../../shared/utils/money-format';
import {
  PaymentCalendarComponent,
  CalendarPayment,
} from '../../../../../shared/ui/payment-calendar/payment-calendar.component';
import { CreditsService } from '../../../infrastructure/services/credits.service';
import {TranslateModule} from '@ngx-translate/core';

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
    TranslateModule
  ],
  templateUrl: './credit-detail.component.html',
})
export class CreditDetailComponent {

  private creditsService = inject(CreditsService);

  // Read directly from service signals — these update reactively on every state
  // change (approve / reject / pay / refresh) without relying on @Input propagation.
  readonly credit = this.creditsService.selected$;
  readonly schedule = this.creditsService.schedule$;
  readonly payingInstallments = this.creditsService.payingInstallments$;
  readonly downloadingPdf = this.creditsService.downloadingPdf$;
  readonly downloadingExcel = this.creditsService.downloadingExcel$;

  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() close = new EventEmitter<void>();

  isDownloadingPdf(id: number): boolean {
    return this.downloadingPdf().has(id);
  }

  isDownloadingExcel(id: number): boolean {
    return this.downloadingExcel().has(id);
  }

  downloadPdf(id: number): void {
    this.creditsService.downloadPdf(id);
  }

  downloadExcel(id: number): void {
    this.creditsService.downloadExcel(id);
  }

  activeTab = signal<'overview' | 'schedule'>('overview');
  viewMode = signal<'table' | 'calendar'>('table');

  progress = computed(() => {
    const s = this.schedule();
    if (!s.length) return 0;
    return Math.round((s.filter(i => i.isPaid).length / s.length) * 100);
  });

  totalPaid = computed(() =>
    this.schedule().filter(i => i.isPaid).reduce((a, c) => a + c.totalPayment, 0)
  );

  totalPending = computed(() =>
    this.schedule().filter(i => !i.isPaid).reduce((a, c) => a + c.totalPayment, 0)
  );

  calendarPayments = computed((): CalendarPayment[] =>
    this.schedule().map(s => ({
      number: s.number,
      date: s.date,
      totalPayment: s.totalPayment,
      isPaid: s.isPaid,
      status: s.status,
    }))
  );

  calendarFormatPayment = (amount: number): string => {
    const currency = this.credit()?.currency || 'USD';
    return formatMoney(amount, currency, { decimals: false });
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

  statusLabel(status: CreditStatus | string | number | null | undefined): string {
    return normalizeCreditStatus(status) || 'Simulated';
  }

  getBadgeVariant(status: CreditStatus | string | number | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' {
    switch (normalizeCreditStatus(status).toLowerCase()) {
      case 'simulated':  return 'secondary';
      case 'approved':   return 'default';
      case 'active':     return 'success';
      case 'completed':  return 'outline';
      case 'rejected':   return 'destructive';
      default:           return 'secondary';
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

  payInstallment(number: number): void {
    const id = this.credit()?.id;
    if (!id) return;
    this.creditsService.payInstallment(id, number);
  }

  isPaying(number: number): boolean {
    const id = this.credit()?.id;
    if (!id) return false;
    return this.payingInstallments().has(`${id}-${number}`);
  }
}
