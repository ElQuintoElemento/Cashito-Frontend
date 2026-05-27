import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreditsApi } from '../api/credits.api';
import { NotificationService } from '../../../../core/services/notification.service';

import { Credit } from '../../domain/models/credit.model';
import { CreditStatus, normalizeCreditStatus } from '../../domain/models/credit-status';
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
      this.selected.set(this.normalizeCredit(res));
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
          this.loadSchedule(creditId);
          this.getById(creditId);
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
        this.applyStatusUpdate(id, 'Approved', credit ?? undefined);
        this.notify.success('Credit approved');
        this.load();
        if (this.selected()?.id === id) {
          this.getById(id);
          this.loadSchedule(id);
        }
      },
      error: () => this.notify.error('Could not approve credit'),
    });
  }

  reject(id: number) {
    this.api.reject(id).subscribe({
      next: (credit) => {
        this.applyStatusUpdate(id, 'Rejected', credit ?? undefined);
        this.notify.success('Credit rejected');
        this.load();
        if (this.selected()?.id === id) {
          this.getById(id);
          this.loadSchedule(id);
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

  private applyStatusUpdate(id: number, fallbackStatus: CreditStatus, responseCredit?: Credit): void {
    const updated = responseCredit ? this.normalizeCredit(responseCredit) : null;
    const nextStatus = updated?.status || fallbackStatus;

    this.credits.update(credits =>
      credits.map(credit =>
        credit.id === id ? { ...credit, ...(updated ?? {}), status: nextStatus } : credit
      )
    );

    if (this.selected()?.id === id) {
      this.selected.update(credit =>
        credit ? { ...credit, ...(updated ?? {}), status: nextStatus } : credit
      );
    }
  }
}
