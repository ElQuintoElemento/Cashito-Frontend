import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';
import {
  DashboardKpis,
  DashboardPortfolioSummary,
  DashboardRecentClient,
  DashboardRecentVehicle,
} from '../../domain/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/dashboard`;

  getKpis() {
    return this.http.get<DashboardKpis>(`${this.base}/kpis`);
  }

  getRecentClients() {
    return this.http.get<DashboardRecentClient[]>(`${this.base}/recent-clients`);
  }

  getRecentVehicles() {
    return this.http.get<DashboardRecentVehicle[]>(`${this.base}/vehicles`);
  }

  getPortfolioSummary() {
    return this.http.get<DashboardPortfolioSummary>(`${this.base}/portfolio-summary`);
  }
}
