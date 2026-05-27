import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegisterUseCase } from '../../../application/usecases/register.usecase';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, InputDirective, ButtonDirective, LucideAngularModule],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  private fb = inject(FormBuilder);
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.registerUseCase.execute(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Register failed';
        this.loading = false;
      }
    });
  }
}
