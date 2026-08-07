import { Component, Input, Output, EventEmitter, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client } from '../../../domain/models/client.model';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell.component';
import { FormSelectComponent, FormSelectOption } from '../../../../../shared/ui/form-select/form-select.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, InputDirective, ButtonDirective, ModalShellComponent, FormSelectComponent, TranslateModule],
  templateUrl: './client-modal.component.html'
})
export class ClientModalComponent {
  private fb = inject(FormBuilder);

  @Input() open = false;
  @Input() client: Client | null = null;

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  readonly currencyOptions: FormSelectOption[] = [
    { value: 'PEN', label: 'PEN' },
    { value: 'USD', label: 'USD' },
  ];

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    monthlyIncome: [0, [Validators.required, Validators.min(0.0001)]],
    incomeCurrency: ['PEN', Validators.required],
    phone: ['', [Validators.pattern(/^\+51\s?9\d{8}$/)]],
    email: ['', [Validators.required, Validators.email]]
  });

  constructor() {
    effect(() => {
      const c = this.client;
      if (c) {
        this.form.patchValue({
          firstName: c.firstName,
          lastName: c.lastName,
          dni: c.dni,
          monthlyIncome: c.monthlyIncome,
          incomeCurrency: c.incomeCurrency,
          phone: c.phone || '',
          email: c.email || ''
        });
      } else {
        this.form.reset({
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

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.value);
    this.close.emit();
  }
}
