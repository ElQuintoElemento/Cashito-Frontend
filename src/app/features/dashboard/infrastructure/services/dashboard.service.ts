import { computed, inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../api/dashboard.api';
import {
  DashboardKpis,
  DashboardPortfolioSummary,
  DashboardRecentClient,
  DashboardRecentVehicle,
} from '../../domain/models/dashboard.model';
import { NotificationService } from '../../../../core/services/notification.service';
import { finalize } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private api = inject(DashboardApi);
  private notify = inject(NotificationService);

  private kpis = signal<DashboardKpis | null>(null);
  private recentClients = signal<DashboardRecentClient[]>([]);
  private recentVehicles = signal<DashboardRecentVehicle[]>([]);
  private portfolioSummary = signal<DashboardPortfolioSummary | null>(null);
  private loading = signal(false);

  readonly kpis$ = this.kpis.asReadonly();
  readonly recentClients$ = this.recentClients.asReadonly();
  readonly recentVehicles$ = this.recentVehicles.asReadonly();
  readonly portfolioSummary$ = this.portfolioSummary.asReadonly();
  readonly loading$ = this.loading.asReadonly();

  readonly hasAnyData = computed(() =>
    !!this.kpis() ||
    !!this.portfolioSummary() ||
    this.recentClients().length > 0 ||
    this.recentVehicles().length > 0
  );

  load(): void {
    this.loading.set(true);
    let pending = 4;

    const finish = () => {
      pending -= 1;
      if (pending === 0) {
        this.loading.set(false);
      }
    };

    this.api.getKpis().pipe(finalize(finish)).subscribe({
      next: (res) => this.kpis.set(res),
      error: () => this.notify.error('Failed to load dashboard KPIs'),
    });

    this.api.getRecentClients().pipe(finalize(finish)).subscribe({
      next: (res) => this.recentClients.set(res ?? []),
      error: () => this.notify.error('Failed to load recent clients'),
    });

    this.api.getRecentVehicles().pipe(finalize(finish)).subscribe({
      next: (res) => this.recentVehicles.set(res ?? []),
      error: () => this.notify.error('Failed to load recent vehicles'),
    });

    this.api.getPortfolioSummary().pipe(finalize(finish)).subscribe({
      next: (res) => this.portfolioSummary.set(res),
      error: () => this.notify.error('Failed to load portfolio summary'),
    });
  }
}
