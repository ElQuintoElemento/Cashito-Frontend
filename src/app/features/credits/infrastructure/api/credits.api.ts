import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';

import { Credit } from '../../domain/models/credit.model';
import { Installment } from '../../domain/models/installment.model';

@Injectable({ providedIn: 'root' })
export class CreditsApi {

  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/credits`;

  getAll() {
    return this.http.get<Credit[]>(this.base);
  }

  getById(id: number) {
    return this.http.get<Credit>(`${this.base}/${id}`);
  }

  getSchedule(id: number) {
    return this.http.get<Installment[]>(`${this.base}/${id}/schedule`);
  }

  payInstallment(creditId: number, installmentNumber: number) {
    return this.http.put<void>(
      `${this.base}/${creditId}/installments/${installmentNumber}/pay`,
      {}
    );
  }

  approve(id: number) {
    return this.http.put<Credit | null>(`${this.base}/${id}/approve`, {});
  }

  reject(id: number) {
    return this.http.put<Credit | null>(`${this.base}/${id}/reject`, {});
  }
}
