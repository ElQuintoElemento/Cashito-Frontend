import { inject, Injectable, signal } from '@angular/core';
import { CreditsApi } from '../api/credits.api';
import {CreditSimulationResponse} from '../../domain/models/credit-simulation-response';
import {CreditSimulationRequest} from '../../domain/models/credit-simulation.model';

@Injectable({ providedIn: 'root' })
export class CreditsService {

  private api = inject(CreditsApi);

  private simulation = signal<CreditSimulationResponse | null>(null);

  simulation$ = this.simulation.asReadonly();

  simulate(data: CreditSimulationRequest) {
    this.api.simulate(data).subscribe(res => {
      this.simulation.set(res);
    });
  }

  createCredit(data: CreditSimulationRequest) {
    return this.api.createCredit(data).subscribe();
  }

  clear() {
    this.simulation.set(null);
  }
}
