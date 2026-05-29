import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreditsApi } from '../api/credits.api';
import { NotificationService } from '../../../../core/services/notification.service';

import { Credit } from '../../domain/models/credit.model';
import { normalizeCreditStatus } from '../../domain/models/credit-status';
import { Installment } from '../../domain/models/installment.model';

@Injectable({ providedIn: 'root' })
export class CreditsService {

  private api = inject(CreditsApi);
  private notify = inject(NotificationService);

  private credits = signal<Credit[]>([]);
  private selected = signal<Credit | null>(null);
  private schedule = signal<Installment[]>([]);
  private payingInstallments = signal<Set<string>>(new Set());

  credits$ = this.credits.asReadonly();
  selected$ = this.selected.asReadonly();
  schedule$ = this.schedule.asReadonly();
  payingInstallments$ = this.payingInstallments.asReadonly();

  load() {
    this.api.getAll().subscribe(res => {
      this.credits.set((res ?? []).map(credit => this.normalizeCredit(credit)));
    });
  }

  getById(id: number) {
    this.api.getById(id).subscribe(res => {
      this.applyCreditSnapshot(this.normalizeCredit(res), true);
    });
  }

  loadSchedule(id: number) {
    this.api.getSchedule(id).subscribe(res => {
      this.schedule.set(res);
    });
  }

  payInstallment(creditId: number, installmentNumber: number) {
    const key = `${creditId}-${installmentNumber}`;
    if (this.payingInstallments().has(key)) return;

    const previous = this.schedule();

    // Optimistic UI update for immediate feedback
    this.schedule.set(
      previous.map(i =>
        i.number === installmentNumber
          ? { ...i, isPaid: true, status: 'Paid', paidAt: new Date().toISOString() }
          : i
      )
    );

    this.payingInstallments.set(new Set([...this.payingInstallments(), key]));

    this.api
      .payInstallment(creditId, installmentNumber)
      .pipe(
        finalize(() => {
          const next = new Set(this.payingInstallments());
          next.delete(key);
          this.payingInstallments.set(next);
        })
      )
      .subscribe({
        next: () => {
          this.notify.success('Installment marked as paid');
          // Reload schedule (authoritative) and credit (status may have changed to Active/Completed)
          this.loadSchedule(creditId);
          this.refreshCredit(creditId);
        },
        error: () => {
          // Revert optimistic update when backend fails
          this.schedule.set(previous);
        },
      });
  }

  approve(id: number) {
    this.api.approve(id).subscribe({
      next: (credit) => {
        this.notify.success('Credit approved');
        // Backend is the single source of truth — never assume the next status locally.
        // If the API returns the updated Credit object, apply it directly (handles Active, Approved, etc.).
        // If it returns null (empty body), re-fetch so we always display real server state.
        if (credit) {
          this.applyCreditSnapshot(this.normalizeCredit(credit));
        } else {
          this.refreshCredit(id);
        }
        // Reload schedule in case the backend generated or modified it on approval.
        if (this.selected()?.id === id) {
          this.loadSchedule(id);
        }
      },
      error: () => this.notify.error('Could not approve credit'),
    });
  }

  reject(id: number) {
    this.api.reject(id).subscribe({
      next: (credit) => {
        this.notify.success('Credit rejected');
        if (credit) {
          this.applyCreditSnapshot(this.normalizeCredit(credit));
        } else {
          this.refreshCredit(id);
        }
      },
      error: () => this.notify.error('Could not reject credit'),
    });
  }

  clearSelected() {
    this.selected.set(null);
    this.schedule.set([]);
  }

  private normalizeCredit(credit: Credit): Credit {
    return {
      ...credit,
      status: normalizeCreditStatus(credit.status) || credit.status,
    };
  }

  private refreshCredit(id: number): void {
    this.api.getById(id).subscribe({
      next: (credit) => this.applyCreditSnapshot(this.normalizeCredit(credit)),
    });
  }

  private applyCreditSnapshot(credit: Credit, select = false): void {
    this.selected.update(current => select || current?.id === credit.id ? credit : current);
    this.credits.update(credits => {
      const index = credits.findIndex(item => item.id === credit.id);
      if (index === -1) return credits;
      return credits.map(item => item.id === credit.id ? credit : item);
    });
  }
}
