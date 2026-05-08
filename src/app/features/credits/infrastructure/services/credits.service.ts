import { inject, Injectable, signal } from '@angular/core';
import { CreditsApi } from '../api/credits.api';

import { Credit } from '../../domain/models/credit.model';
import { Installment } from '../../domain/models/installment.model';

@Injectable({ providedIn: 'root' })
export class CreditsService {

  private api = inject(CreditsApi);

  private credits = signal<Credit[]>([]);
  private selected = signal<Credit | null>(null);
  private schedule = signal<Installment[]>([]);

  credits$ = this.credits.asReadonly();
  selected$ = this.selected.asReadonly();
  schedule$ = this.schedule.asReadonly();

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

  clearSelected() {
    this.selected.set(null);
    this.schedule.set([]);
  }
}
