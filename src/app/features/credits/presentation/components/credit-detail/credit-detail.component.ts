import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Credit } from '../../../domain/models/credit.model';
import { Installment } from '../../../domain/models/installment.model';
import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';

@Component({
  standalone: true,
  selector: 'app-credit-detail',
  imports: [CommonModule],
  templateUrl: './credit-detail.component.html'
})
export class CreditDetailComponent {

  @Input() credit: Credit | null = null;
  @Input() schedule: Installment[] = [];
  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() close = new EventEmitter<void>();

  getClientName(id: number) {
    const c = this.clients.find(x => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : '';
  }

  getVehicle(id: number) {
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.brand} ${v.model}` : '';
  }
}
