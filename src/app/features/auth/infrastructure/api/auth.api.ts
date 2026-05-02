import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {APP_SETTINGS} from '../../../../core/config/app.settings';

@Injectable({ providedIn: 'root' })
export class AuthApi {

  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/auth`;

  signIn(data: { username: string; password: string }) {
    return this.http.post(`${this.base}/sign-in`, data);
  }

  signUp(data: any) {
    return this.http.post(`${this.base}/sign-up`, data);
  }

  me() {
    return this.http.get(`${this.base}/me`);
  }
}
