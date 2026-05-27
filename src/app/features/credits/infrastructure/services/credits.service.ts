import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreditsApi } from '../api/credits.api';
import { NotificationService } from '../../../../core/services/notification.service';

import { Credit } from '../../domain/models/credit.model';
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
      this.credits.set(res);
    });
  }

  getById(id: number) {
    this.api.getById(id).subscribe(res => {
      this.selected.set(res);
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

  clearSelected() {
    this.selected.set(null);
    this.schedule.set([]);
  }
}
