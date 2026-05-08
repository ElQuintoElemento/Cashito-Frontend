import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Credit } from '../../../domain/models/credit.model';
import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { DropdownMenuComponent, DropdownItemComponent, DropdownLabelComponent, DropdownSeparatorComponent } from '../../../../../shared/ui/dropdown-menu/dropdown-menu.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { AvatarComponent, AvatarFallbackComponent } from '../../../../../shared/ui/avatar/avatar.component';
import { LucideAngularModule } from 'lucide-angular';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { CurrencyService } from '../../../../../core/config/currency.service';

@Component({
  standalone: true,
  selector: 'app-credit-list',
  imports: [
    CommonModule, CardComponent, BadgeComponent, DropdownMenuComponent, 
    DropdownItemComponent, DropdownLabelComponent, DropdownSeparatorComponent, 
    ButtonDirective, AvatarComponent, AvatarFallbackComponent, LucideAngularModule, 
    EmptyStateComponent
  ],
  templateUrl: './credit-list.component.html'
})
export class CreditListComponent {
  public currencyService = inject(CurrencyService);

  @Input() credits: Credit[] = [];
  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() view = new EventEmitter<number>();
  @Output() updateStatus = new EventEmitter<{id: number, status: string}>();
  @Output() delete = new EventEmitter<number>();

  getBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch(status?.toLowerCase()) {
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
}
