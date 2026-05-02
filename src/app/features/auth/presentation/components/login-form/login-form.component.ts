import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import {LoginUseCase} from '../../../application/usecases/login.usecase';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {

  private fb = inject(FormBuilder);
  private loginUseCase = inject(LoginUseCase);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    this.loginUseCase.execute(this.form.value as any).subscribe({
      next: () => {
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.error = err.error?.error || 'Login failed';
        this.loading = false;
      }
    });
  }
}
