import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Credit } from '../../../domain/models/credit.model';
import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';

@Component({
  standalone: true,
  selector: 'app-credit-list',
  imports: [CommonModule],
  templateUrl: './credit-list.component.html'
})
export class CreditListComponent {

  @Input() credits: Credit[] = [];
  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() view = new EventEmitter<number>();

  getClientName(id: number) {
    const c = this.clients.find(x => x.id === id);
    return c ? `${c.firstName} ${c.lastName}` : 'Unknown';
  }

  getVehicle(id: number) {
    const v = this.vehicles.find(x => x.id === id);
    return v ? `${v.brand} ${v.model}` : 'Unknown';
  }
}
