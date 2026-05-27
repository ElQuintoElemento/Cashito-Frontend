import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';
import { PublicCreditDetail, PublicInstallment } from '../../domain/models/public-credit.model';

@Injectable({ providedIn: 'root' })
export class PublicCreditsApi {
  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/public/credits`;

  getCredit(id: number, token: string) {
    return this.http.get<PublicCreditDetail>(`${this.base}/${id}?token=${encodeURIComponent(token)}`);
  }

  getSchedule(id: number, token: string) {
    return this.http.get<PublicInstallment[]>(`${this.base}/${id}/schedule?token=${encodeURIComponent(token)}`);
  }

  approve(id: number, token: string) {
    return this.http.put<void>(`${this.base}/${id}/approve?token=${encodeURIComponent(token)}`, {});
  }

  reject(id: number, token: string) {
    return this.http.put<void>(`${this.base}/${id}/reject?token=${encodeURIComponent(token)}`, {});
  }

  payInstallment(id: number, number: number, token: string) {
    return this.http.put<void>(`${this.base}/${id}/installments/${number}/pay?token=${encodeURIComponent(token)}`, {});
  }
}

