import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { NgIf } from '@angular/common';
import { Client } from '../../../domain/models/client.model';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [NgIf],
  templateUrl: './client-modal.component.html'
})
export class ClientModalComponent {

  @Input() open: boolean = false;
  @Input() client: Client | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form = signal({
    firstName: '',
    lastName: '',
    dni: '',
    monthlyIncome: 0,
    phone: '',
    email: ''
  });

  constructor() {
    effect(() => {
      const c = this.client;

      if (c) {
        this.form.set({
          firstName: c.firstName,
          lastName: c.lastName,
          dni: c.dni,
          monthlyIncome: c.monthlyIncome,
          phone: c.phone,
          email: c.email || ''
        });
      } else {
        this.form.set({
          firstName: '',
          lastName: '',
          dni: '',
          monthlyIncome: 0,
          phone: '',
          email: ''
        });
      }
    });
  }

  updateField(field: string, value: any) {
    this.form.update(f => ({
      ...f,
      [field]: field === 'monthlyIncome' ? Number(value) : value
    }));
  }

  submit() {
    this.save.emit(this.form());
    this.close.emit();
  }
}
