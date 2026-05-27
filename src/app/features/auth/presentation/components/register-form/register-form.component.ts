import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterUseCase } from '../../../application/usecases/register.usecase';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-register-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, RouterLink, InputDirective, ButtonDirective, LucideAngularModule],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  private fb = inject(FormBuilder);
  private registerUseCase = inject(RegisterUseCase);
  private router = inject(Router);

  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    this.registerUseCase.execute(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Register failed');
        this.loading.set(false);
      }
    });
  }
}
