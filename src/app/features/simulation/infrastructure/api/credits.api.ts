import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_SETTINGS } from '../../../../core/config/app.settings';
import {CreditSimulationRequest} from '../../domain/models/credit-simulation.model';
import {CreditSimulationResponse} from '../../domain/models/credit-simulation-response';

@Injectable({ providedIn: 'root' })
export class CreditsApi {

  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/credits`;

  simulate(data: CreditSimulationRequest) {
    return this.http.post<CreditSimulationResponse>(
      `${this.base}/simulate`,
      data
    );
  }

  createCredit(data: CreditSimulationRequest) {
    return this.http.post(`${this.base}`, data);
  }
}
