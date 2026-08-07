import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy
} from '@angular/core';

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

import {
  GRACE_TYPE_OPTIONS,
  isGraceType
} from '../../../../../shared/domain/grace-type';

import { formatMoney } from '../../../../../shared/utils/money-format';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-credit-simulation-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    InputDirective,
    ButtonDirective,
    LucideAngularModule,
    TranslateModule,
  ],
  templateUrl: './credit-simulation-form.component.html'
})
export class CreditSimulationFormComponent {

  @Input() clients: Client[] = [];
  @Input() vehicles: Vehicle[] = [];

  @Output() simulate = new EventEmitter<CreditSimulationRequest>();

  readonly graceTypeOptions = GRACE_TYPE_OPTIONS;

  formatMoney = formatMoney;

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
    graceType: 'None',
    insurance: 0.02,
    desgravamenInsuranceRate: 0.035,
    vehicularInsuranceRate: 0.045,
    portes: 4.50,
    disbursementFee: 0,
    evaluationFee: 0,
    notaryExpenses: 0,
    soatAmount: 0,
    otherExpenses: 0,
    balloonPaymentPercentage: 40,
    opportunityRate: 0
  });

  balloonAmount = computed(() => {
    const f = this.form();
    return f.vehiclePrice * ((f.balloonPaymentPercentage ?? 40) / 100);
  });

  downPaymentMode = signal<'amount' | 'percent'>('amount');

  downPaymentPercent = computed(() => {
    const f = this.form();
    if (!f.vehiclePrice || f.vehiclePrice <= 0) return 0;
    return (f.downPayment / f.vehiclePrice) * 100;
  });

  setDownPaymentMode(mode: 'amount' | 'percent') {
    if (mode === 'percent' && this.form().vehiclePrice <= 0) return;
    this.downPaymentMode.set(mode);
  }

  updateDownPaymentPercent(value: any) {
    const pct = Number(value);
    const price = this.form().vehiclePrice ?? 0;
    const amount = price > 0 ? price * (pct / 100) : 0;
    this.update('downPayment', amount);
  }

  update<K extends keyof CreditSimulationRequest>(
    key: K,
    value: any
  ) {
    this.form.update(f => {
      const parsedValue = this.parseValue(key, value);
      const updated = {
        ...f,
        [key]: parsedValue
      };
      if (key === 'rateType' && parsedValue === 'TEA') {
        updated.capitalization = undefined;
      }
      return updated;
    });
  }

  private parseValue(
    key: keyof CreditSimulationRequest,
    value: any
  ) {
    const numericFields: (keyof CreditSimulationRequest)[] = [
      'clientId',
      'vehicleId',
      'vehiclePrice',
      'downPayment',
      'interestRate',
      'termMonths',
      'gracePeriod',
      'insurance',
      'desgravamenInsuranceRate',
      'vehicularInsuranceRate',
      'portes',
      'disbursementFee',
      'evaluationFee',
      'notaryExpenses',
      'soatAmount',
      'otherExpenses',
      'balloonPaymentPercentage',
      'opportunityRate'
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
    if (this.isValid()) {
      this.simulate.emit(this.form());
    }
  }

  isValid(): boolean {
    const f = this.form();

    return (
      f.clientId > 0 &&
      f.vehicleId > 0 &&
      f.downPayment >= 0 &&
      f.interestRate > 0 &&
      f.termMonths > 0 &&
      isGraceType(f.graceType) &&
      (f.rateType !== 'TNA' || !!f.capitalization) &&
      (f.desgravamenInsuranceRate ?? 0) >= 0 &&
      (f.vehicularInsuranceRate ?? 0) >= 0 &&
      (f.portes ?? 0) >= 0 &&
      (f.disbursementFee ?? 0) >= 0 &&
      (f.evaluationFee ?? 0) >= 0 &&
      (f.notaryExpenses ?? 0) >= 0 &&
      (f.soatAmount ?? 0) >= 0 &&
      (f.otherExpenses ?? 0) >= 0 &&
      (f.balloonPaymentPercentage >= 40 && f.balloonPaymentPercentage <= 50)
    );
  }
}
