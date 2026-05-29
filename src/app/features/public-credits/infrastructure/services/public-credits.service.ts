import { computed, inject, Injectable, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import { CreditStatus, normalizeCreditStatus } from '../../../credits/domain/models/credit-status';
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

  /** Initial page load — shows the loading skeleton. */
  load(id: number, token: string, showLoading = true): void {
    if (showLoading) {
      this.loading.set(true);
    }
    this.forbidden.set(false);

    forkJoin({
      credit: this.api.getCredit(id, token),
      schedule: this.api.getSchedule(id, token),
    }).pipe(
      finalize(() => {
        if (showLoading) {
          this.loading.set(false);
        }
      })
    ).subscribe({
      next: ({ credit, schedule }) => {
        this.credit.set(this.normalizeCredit(credit));
        this.schedule.set(schedule ?? []);
      },
      error: () => {
        if (showLoading) {
          this.forbidden.set(true);
        }
      },
    });
  }

  approve(id: number, token: string): void {
    if (this.actionLoading()) return;
    this.actionLoading.set(true);

    this.api.approve(id, token)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.notify.success('Credit approved');

          // Eagerly update local state so canReview() goes false instantly
          // and the Approve/Reject buttons disappear before the background reload finishes.
          if (res) {
            this.credit.set(this.normalizeCredit(res));
          } else {
            this.applyEagerStatus('Approved');
          }

          // Background sync: fetch authoritative server state (handles Active, etc.)
          this.refreshCredit(id, token);
        },
        error: () => this.notify.error('Could not approve credit'),
      });
  }

  reject(id: number, token: string): void {
    if (this.actionLoading()) return;
    this.actionLoading.set(true);

    this.api.reject(id, token)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.notify.success('Credit rejected');

          if (res) {
            this.credit.set(this.normalizeCredit(res));
          } else {
            this.applyEagerStatus('Rejected');
          }

          // Background sync
          this.refreshCredit(id, token);
        },
        error: () => this.notify.error('Could not reject credit'),
      });
  }

  payInstallment(id: number, number: number, token: string): void {
    if (this.payingSet().has(number)) return;

    const previousSchedule = this.schedule();

    // Optimistic update: mark row as paid immediately
    this.payingSet.set(new Set([...this.payingSet(), number]));
    this.schedule.set(
      previousSchedule.map(x =>
        x.number === number
          ? { ...x, isPaid: true, status: 'Paid', paidAt: new Date().toISOString() }
          : x
      )
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
        // Reload both credit (status may change to Active/Completed) and schedule (authoritative)
        this.load(id, token, false);
      },
      error: () => {
        // Revert optimistic update
        this.schedule.set(previousSchedule);
        this.notify.error('Could not pay installment');
      },
    });
  }

  /**
   * Apply an eager local status change without a full reload.
   * Used when the API returns null (no body) so we know what status was set
   * but don't have the full updated object yet.
   */
  private applyEagerStatus(status: CreditStatus): void {
    this.credit.update(c => c ? { ...c, status } : c);
  }

  /**
   * Re-fetch only the credit detail in the background to get authoritative server state
   * (e.g., the backend may have auto-transitioned to Active after approval).
   */
  private refreshCredit(id: number, token: string): void {
    this.api.getCredit(id, token).subscribe({
      next: (credit) => this.credit.set(this.normalizeCredit(credit)),
    });
  }

  private normalizeCredit(credit: PublicCreditDetail): PublicCreditDetail {
    return {
      ...credit,
      status: normalizeCreditStatus(credit.status) || credit.status,
    };
  }
}
