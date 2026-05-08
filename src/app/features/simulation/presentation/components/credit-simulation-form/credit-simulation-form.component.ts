import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Client } from '../../../../clients/domain/models/client.model';
import { Vehicle } from '../../../../vehicles/domain/models/vehicles.model';
import { CreditSimulationRequest } from '../../../domain/models/credit-simulation.model';
import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent
} from '../../../../../shared/ui/card/card.component';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-credit-simulation-form',
  imports: [CommonModule, CardComponent, InputDirective, ButtonDirective, LucideAngularModule, CardContentComponent, CardTitleComponent, CardHeaderComponent],
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
      [key]: this.parseValue(key, value)
    }));
  }

  private parseValue(key: keyof CreditSimulationRequest, value: any) {
    const numericFields: (keyof CreditSimulationRequest)[] = [
      'clientId',
      'vehicleId',
      'vehiclePrice',
      'downPayment',
      'interestRate',
      'termMonths',
      'gracePeriod',
      'insurance'
    ];

    return numericFields.includes(key)
      ? Number(value)
      : value;
  }

  selectVehicle(vehicleId: any) {
    const id = Number(vehicleId);

    const v = this.vehicles.find(x => x.id === id);

    this.form.update(f => ({
      ...f,
      vehicleId: id,
      vehiclePrice: v?.price ?? 0,
      currency: v?.currency ?? 'PEN'
    }));
  }

  onSimulate() {
    this.simulate.emit(this.form());
  }

  onCreate() {
    this.create.emit(this.form());
  }
}
