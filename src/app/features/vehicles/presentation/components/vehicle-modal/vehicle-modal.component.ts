import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { NgIf } from '@angular/common';
import {Vehicle} from '../../../domain/models/vehicles.model';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';

import { ModalCloseComponent } from '../../../../../shared/ui/modal/modal-close.component';

@Component({
  selector: 'app-vehicle-modal',
  standalone: true,
  imports: [NgIf, InputDirective, ButtonDirective, ModalCloseComponent],
  templateUrl: './vehicle-modal.component.html'
})
export class VehicleModalComponent {

  @Input() open: boolean = false;
  @Input() vehicle: Vehicle | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

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
      [field]:
        field === 'price' || field === 'year'
          ? Number(value)
          : value
    }));
  }

  submit() {
    this.save.emit(this.form());
    this.close.emit();
  }
}
