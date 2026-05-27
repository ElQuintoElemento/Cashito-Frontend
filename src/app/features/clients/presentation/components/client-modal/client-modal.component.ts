import { Component, Input, Output, EventEmitter, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { Client } from '../../../domain/models/client.model';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell.component';
import { FormSelectComponent, FormSelectOption } from '../../../../../shared/ui/form-select/form-select.component';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputDirective, ButtonDirective, ModalShellComponent, FormSelectComponent],
  templateUrl: './client-modal.component.html'
})
export class ClientModalComponent {

  @Input() open = false;
  @Input() client: Client | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  readonly currencyOptions: FormSelectOption[] = [
    { value: 'PEN', label: 'PEN' },
    { value: 'USD', label: 'USD' },
  ];

  form = signal({
    firstName: '',
    lastName: '',
    dni: '',
    monthlyIncome: 0,
    incomeCurrency: 'PEN',
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
          incomeCurrency: c.incomeCurrency,
          phone: c.phone,
          email: c.email || ''
        });
      } else {
        this.form.set({
          firstName: '',
          lastName: '',
          dni: '',
          monthlyIncome: 0,
          incomeCurrency: 'PEN',
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
