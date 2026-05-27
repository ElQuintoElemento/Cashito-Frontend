import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { PublicCreditDetail, PublicInstallment } from '../../domain/models/public-credit.model';
import { PublicCreditsApi } from '../api/public-credits.api';

@Injectable({ providedIn: 'root' })
export class PublicCreditsService {
  private api = inject(PublicCreditsApi);
  private notify = inject(NotificationService);

  private credit = signal<PublicCreditDetail | null>(null);
  private schedule = signal<PublicInstallment[]>([]);
  private loading = signal(false);
  private forbidden = signal(false);
  private actionLoading = signal(false);
  private payingSet = signal<Set<number>>(new Set());

  readonly credit$ = this.credit.asReadonly();
  readonly schedule$ = this.schedule.asReadonly();
  readonly loading$ = this.loading.asReadonly();
  readonly forbidden$ = this.forbidden.asReadonly();
  readonly actionLoading$ = this.actionLoading.asReadonly();
  readonly payingSet$ = this.payingSet.asReadonly();

  readonly progress$ = computed(() => {
    const s = this.schedule();
    if (!s.length) return 0;
    return Math.round((s.filter(x => x.isPaid).length / s.length) * 100);
  });

  load(id: number, token: string): void {
    this.loading.set(true);
    this.forbidden.set(false);

    let pending = 2;
    const finish = () => {
      pending -= 1;
      if (pending === 0) this.loading.set(false);
    };

    this.api.getCredit(id, token).pipe(finalize(finish)).subscribe({
      next: (res) => this.credit.set(res),
      error: () => this.forbidden.set(true),
    });

    this.api.getSchedule(id, token).pipe(finalize(finish)).subscribe({
      next: (res) => this.schedule.set(res ?? []),
      error: () => this.forbidden.set(true),
    });
  }

  approve(id: number, token: string): void {
    if (this.actionLoading()) return;
    this.actionLoading.set(true);
    this.api.approve(id, token).pipe(finalize(() => this.actionLoading.set(false))).subscribe({
      next: () => {
        this.notify.success('Credit approved');
        this.load(id, token);
      },
      error: () => this.notify.error('Could not approve credit'),
    });
  }

  reject(id: number, token: string): void {
    if (this.actionLoading()) return;
    this.actionLoading.set(true);
    this.api.reject(id, token).pipe(finalize(() => this.actionLoading.set(false))).subscribe({
      next: () => {
        this.notify.success('Credit rejected');
        this.load(id, token);
      },
      error: () => this.notify.error('Could not reject credit'),
    });
  }

  payInstallment(id: number, number: number, token: string): void {
    if (this.payingSet().has(number)) return;
    const previous = this.schedule();
    this.payingSet.set(new Set([...this.payingSet(), number]));
    this.schedule.set(
      previous.map(x => x.number === number ? { ...x, isPaid: true, status: 'Paid', paidAt: new Date().toISOString() } : x)
    );

    this.api.payInstallment(id, number, token).pipe(
      finalize(() => {
        const next = new Set(this.payingSet());
        next.delete(number);
        this.payingSet.set(next);
      })
    ).subscribe({
      next: () => {
        this.notify.success('Installment paid');
        this.load(id, token);
      },
      error: () => {
        this.schedule.set(previous);
        this.notify.error('Could not pay installment');
      },
    });
  }

}

