import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Credit } from '../../../domain/models/credit.model';
import { CreditStatus, normalizeCreditStatus } from '../../../domain/models/credit-status';
import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { DropdownMenuComponent, DropdownItemComponent, DropdownLabelComponent, DropdownSeparatorComponent } from '../../../../../shared/ui/dropdown-menu/dropdown-menu.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';

import { LucideAngularModule } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { MoneyPipe } from '../../../../../shared/pipes/money.pipe';

@Component({
  standalone: true,
  selector: 'app-credit-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule, CardComponent, BadgeComponent, DropdownMenuComponent, 
    DropdownItemComponent, DropdownLabelComponent, DropdownSeparatorComponent, 
    ButtonDirective, LucideAngularModule, 
    EmptyStateComponent, MoneyPipe
  ],
  templateUrl: './credit-list.component.html'
})
export class CreditListComponent {
  @Input() credits: Credit[] = [];
  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() view = new EventEmitter<number>();
  @Output() updateStatus = new EventEmitter<{id: number, status: Extract<CreditStatus, 'Approved' | 'Rejected'>}>();
  @Output() delete = new EventEmitter<number>();
  @Output() copyPaymentLink = new EventEmitter<Credit>();

  statusLabel(status: CreditStatus | string | number | null | undefined): string {
    return normalizeCreditStatus(status) || 'Simulated';
  }

  isSimulated(status: CreditStatus | string | number | null | undefined): boolean {
    return normalizeCreditStatus(status) === 'Simulated';
  }

  getBadgeVariant(status: CreditStatus | string | number | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch(normalizeCreditStatus(status).toLowerCase()) {
      case 'simulated': return 'secondary';
      case 'approved': return 'default';
      case 'active': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  }

  getClientName(id: number) {
    const c = this.clients.find(x => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown';
  }

  getVehicle(id: number) {
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.brand} ${v.model}` : 'Unknown';
  }

  trackById(index: number, item: Credit): number {
    return item.id;
  }
}

