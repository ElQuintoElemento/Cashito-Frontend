import { Component, Input, Output, EventEmitter, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../domain/models/vehicles.model';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell.component';
import { FormSelectComponent, FormSelectOption } from '../../../../../shared/ui/form-select/form-select.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, InputDirective, ButtonDirective, ModalShellComponent, FormSelectComponent, TranslateModule],
  templateUrl: './vehicle-modal.component.html'
})
export class VehicleModalComponent {
  private fb = inject(FormBuilder);

  @Input() open = false;
  @Input() vehicle: Vehicle | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  readonly minYear = new Date().getFullYear() - 2;

  readonly typeOptions: FormSelectOption[] = [
    { value: 'Sedan', label: 'Sedan' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Pickup', label: 'Pickup' },
  ];

  readonly currencyOptions: FormSelectOption[] = [
    { value: 'PEN', label: 'PEN' },
    { value: 'USD', label: 'USD' },
  ];

  form = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.0001)]],
    currency: ['PEN', Validators.required],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(this.minYear)]],
    type: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const v = this.vehicle;
      if (v) {
        this.form.patchValue({
          brand: v.brand,
          model: v.model,
          price: v.price,
          currency: v.currency,
          year: v.year,
          type: v.type
        });
      } else {
        this.form.reset({
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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
    this.close.emit();
  }
}
