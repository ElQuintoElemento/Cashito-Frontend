import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';
import { CreditSimulationRequest } from '../../../domain/models/credit-simulation.model';

@Component({
  standalone: true,
  selector: 'app-credit-simulation-form',
  imports: [CommonModule],
  templateUrl: './credit-simulation-form.component.html'
})
export class CreditSimulationFormComponent {

  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() simulate = new EventEmitter<CreditSimulationRequest>();
  @Output() create = new EventEmitter<CreditSimulationRequest>();

  form = signal<CreditSimulationRequest>({
    clientId: 0,
    vehicleId: 0,
    vehiclePrice: 0,
    currency: 'USD',
    downPayment: 0,
    interestRate: 10,
    termMonths: 12,
    rateType: 'TEA',
    gracePeriod: 0,
    insurance: 0.02
  });

  update<K extends keyof CreditSimulationRequest>(key: K, value: any) {
    this.form.update(f => ({
      ...f,
      [key]: typeof value === 'number' ? Number(value) : value
    }));
  }

  selectVehicle(vehicleId: number) {
    const v = this.vehicles.find(x => x.id === vehicleId);

    this.form.update(f => ({
      ...f,
      vehicleId,
      vehiclePrice: v?.price ?? 0,
      currency: v?.currency ?? 'USD'
    }));
  }

  onSimulate() {
    this.simulate.emit(this.form());
  }

  onCreate() {
    this.create.emit(this.form());
  }
}
