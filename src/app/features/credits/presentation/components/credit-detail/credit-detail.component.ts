import { Component, Input, Output, EventEmitter, inject, signal, computed } from '@angular/core';
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

@Component({
  standalone: true,
  selector: 'app-credit-detail',
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
  set credit(val: Credit | null) {
    this._credit = val;
  }
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
    if (!s || s.length === 0) return 0;
    const paid = s.filter(i => i.isPaid).length;
    return Math.round((paid / s.length) * 100);
  });

  totalPaid = computed(() => {
    const s = this.scheduleSignal();
    return s.filter(i => i.isPaid).reduce((acc, curr) => acc + curr.totalPayment, 0);
  });

  totalPending = computed(() => {
    const s = this.scheduleSignal();
    return s.filter(i => !i.isPaid).reduce((acc, curr) => acc + curr.totalPayment, 0);
  });

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
    switch(status?.toLowerCase()) {
      case 'simulated': return 'secondary';
      case 'approved': return 'default';
      case 'active': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  }

  setTab(tab: 'overview' | 'schedule') {
    this.activeTab.set(tab);
  }

  setViewMode(mode: 'table' | 'calendar') {
    this.viewMode.set(mode);
  }
}
