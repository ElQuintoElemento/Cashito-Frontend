import { Component, Input, Output, EventEmitter, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { Vehicle } from '../../../domain/models/vehicles.model';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell.component';
import { FormSelectComponent, FormSelectOption } from '../../../../../shared/ui/form-select/form-select.component';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDirective, ButtonDirective, ModalShellComponent, FormSelectComponent, TranslateModule],
  templateUrl: './vehicle-modal.component.html'
})
export class VehicleModalComponent {

  @Input() open = false;
  @Input() vehicle: Vehicle | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  readonly typeOptions: FormSelectOption[] = [
    { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Pickup', label: 'Pickup' },
    { value: 'Motorcycle', label: 'Motorcycle' },
  ];

  readonly currencyOptions: FormSelectOption[] = [
    { value: 'PEN', label: 'PEN' },
    { value: 'USD', label: 'USD' },
  ];

  form = signal({
    brand: '',
    model: '',
    price: 0,
    currency: 'PEN',
    year: new Date().getFullYear(),
    type: ''
  });

  constructor() {
    effect(() => {
      const v = this.vehicle;
      if (v) {
        this.form.set({
          brand: v.brand,
          model: v.model,
          price: v.price,
          currency: v.currency,
          year: v.year,
          type: v.type
        });
      } else {
        this.form.set({
          brand: '',
          model: '',
          price: 0,
          currency: 'PEN',
          year: new Date().getFullYear(),
          type: ''
        });
      }
    });
  }

  updateField(field: string, value: any) {
    this.form.update(f => ({
      ...f,
      [field]: field === 'price' || field === 'year' ? Number(value) : value
    }));
  }

  submit() {
    this.save.emit(this.form());
    this.close.emit();
  }
}
