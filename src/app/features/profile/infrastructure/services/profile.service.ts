import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthStorageService } from '../../../auth/infrastructure/services/auth-storage.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ProfileApi } from '../api/profile.api';
import { ChangePasswordRequest, UpdateUserProfileRequest, UserProfile } from '../../domain/models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private api = inject(ProfileApi);
  private authStorage = inject(AuthStorageService);
  private notify = inject(NotificationService);

  private profile = signal<UserProfile | null>(null);
  private savingProfile = signal(false);
  private changingPassword = signal(false);

  readonly profile$ = this.profile.asReadonly();
  readonly savingProfile$ = this.savingProfile.asReadonly();
  readonly changingPassword$ = this.changingPassword.asReadonly();

  /** Uses the locally stored auth user for the user id. */
  get userId(): number | null {
    const user = this.authStorage.getUser();
    const id = Number(user?.id);
    return Number.isFinite(id) ? id : null;
  }

  bootstrapFromStorage(): void {
    const user = this.authStorage.getUser();
    if (!user) return;

    const id = Number(user.id);
    if (!Number.isFinite(id)) return;

    // Backend does not provide "get me" endpoint in requirements; we bootstrap from storage.
    // If fields are missing, forms will still be editable.
    this.profile.set({
      id,
      username: user.username,
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
    });
  }

  updateProfile(body: UpdateUserProfileRequest): void {
    const id = this.userId;
    if (!id || this.savingProfile()) return;

    this.savingProfile.set(true);

    this.api.updateUser(id, body).pipe(
      finalize(() => this.savingProfile.set(false))
    ).subscribe({
      next: (updated) => {
        // Keep local profile in sync
        this.profile.set(updated);

        // Update auth storage snapshot (do not touch token)
        const user = this.authStorage.getUser();
        if (user) {
          const token = this.authStorage.getToken() ?? user.token ?? '';
          if (token) {
            this.authStorage.save(token, {
              ...user,
              firstName: updated.firstName,
              lastName: updated.lastName,
              email: updated.email,
            });
          }
        }

        this.notify.success('Profile updated');
      },
      error: () => {
        this.notify.error('Failed to update profile');
      }
    });
  }

  changePassword(body: ChangePasswordRequest): void {
    const id = this.userId;
    if (!id || this.changingPassword()) return;

    this.changingPassword.set(true);
    this.api.changePassword(id, body).pipe(
      finalize(() => this.changingPassword.set(false))
    ).subscribe({
      next: () => this.notify.success('Password changed'),
      error: () => this.notify.error('Failed to change password'),
    });
  }
}

