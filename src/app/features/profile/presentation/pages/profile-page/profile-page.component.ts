import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../../../../../shared/ui/card/card.component';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';

import { ProfileService } from '../../../infrastructure/services/profile.service';
import {TranslateModule} from '@ngx-translate/core';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!newPassword || !confirmPassword) return null;
  return newPassword === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    InputDirective,
    ButtonDirective,
    TranslateModule
  ],
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);

  readonly profile = this.profileService.profile$;
  readonly savingProfile = this.profileService.savingProfile$;
  readonly changingPassword = this.profileService.changingPassword$;

  readonly profileSaved = signal(false);
  readonly passwordSaved = signal(false);

  readonly showCurrent = signal(false);
  readonly showNew = signal(false);
  readonly showConfirm = signal(false);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatch }
  );

  readonly passwordMismatch = computed(() =>
    Boolean(this.passwordForm.errors?.['passwordMismatch'])
  );

  constructor() {
    this.profileService.bootstrapFromStorage();

    effect(() => {
      const p = this.profile();
      if (!p) return;
      this.profileForm.patchValue(
        {
          firstName: p.firstName ?? '',
          lastName: p.lastName ?? '',
          email: p.email ?? '',
        },
        { emitEvent: false }
      );
    });

    this.profileForm.valueChanges.subscribe(() => this.profileSaved.set(false));
    this.passwordForm.valueChanges.subscribe(() => this.passwordSaved.set(false));
  }

  submitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.profileService.updateProfile(this.profileForm.getRawValue() as any);
    this.profileSaved.set(true);
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.profileService.changePassword({
      currentPassword: this.passwordForm.value.currentPassword!,
      newPassword: this.passwordForm.value.newPassword!,
    });
    this.passwordForm.reset();
    this.passwordSaved.set(true);
  }

  toggle(which: 'current' | 'new' | 'confirm'): void {
    if (which === 'current') this.showCurrent.update(v => !v);
    if (which === 'new') this.showNew.update(v => !v);
    if (which === 'confirm') this.showConfirm.update(v => !v);
  }
}

