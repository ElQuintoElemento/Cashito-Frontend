import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { CreditsApi } from '../api/credits.api';
import { CreditSimulationResponse } from '../../domain/models/credit-simulation-response';
import { CreditSimulationRequest } from '../../domain/models/credit-simulation.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Injectable({ providedIn: 'root' })
export class CreditsService {

  private api = inject(CreditsApi);
  private notify = inject(NotificationService);

  private simulation = signal<CreditSimulationResponse | null>(null);
  private saving = signal(false);
  private saved = signal(false);

  simulation$ = this.simulation.asReadonly();
  saving$ = this.saving.asReadonly();
  saved$ = this.saved.asReadonly();

  simulate(data: CreditSimulationRequest) {
    this.saved.set(false);
    this.api.simulate(data).subscribe({
      next: res => this.simulation.set(res),
      error: () => this.notify.error('Simulation failed. Please try again.'),
    });
  }

  createCredit(data: CreditSimulationRequest) {
    if (this.saving() || this.saved()) {
      return;
    }
    this.saving.set(true);
    this.api.createCredit(data).pipe(
      finalize(() => this.saving.set(false))
    ).subscribe({
      next: () => {
        this.saved.set(true);
        this.notify.success('Credit saved successfully');
      },
      error: () => this.notify.error('Failed to save credit. Please try again.'),
    });
  }

  clear() {
    this.simulation.set(null);
    this.saved.set(false);
  }
}
