import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';
import { ChangePasswordRequest, UpdateUserProfileRequest, UserProfile } from '../../domain/models/profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileApi {
  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/v1/users`;

  updateUser(id: number, body: UpdateUserProfileRequest) {
    return this.http.put<UserProfile>(`${this.base}/${id}`, body);
  }

  changePassword(id: number, body: ChangePasswordRequest) {
    return this.http.post<void>(`${this.base}/${id}/change-password`, body);
  }
}

