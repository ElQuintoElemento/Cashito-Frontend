import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {APP_SETTINGS} from '../../../../core/config/app.settings';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class AuthApi {

  private http = inject(HttpClient);
  private notify = inject(NotificationService);
  private base = `${APP_SETTINGS.apiUrl}/v1/auth`;

  signIn(data: { username: string; password: string }) {
    return this.http.post(`${this.base}/sign-in`, data).pipe(
      catchError(err => {
        this.notify.error(err.error?.error || 'Login failed');
        return throwError(() => err);
      })
    );
  }

  signUp(data: any) {
    return this.http.post(`${this.base}/sign-up`, data).pipe(
      catchError(err => {
        this.notify.error(err.error?.error || 'Register failed');
        return throwError(() => err);
      })
    );
  }

  me() {
    return this.http.get(`${this.base}/me`);
  }
}
