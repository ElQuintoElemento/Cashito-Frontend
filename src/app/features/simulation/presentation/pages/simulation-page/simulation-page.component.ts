import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsService } from '../../../infrastructure/services/credits.service';
import { ClientsService } from '../../../../clients/infrastructure/services/clients.service';
import { VehiclesService } from '../../../../vehicles/infrastructure/services/vehicles.service';

import { CreditSimulationRequest } from '../../../domain/models/credit-simulation.model';
import {
  CreditSimulationResultComponent
} from '../../components/credit-simulation-result/credit-simulation-result.component';
import {CreditSimulationFormComponent} from '../../components/credit-simulation-form/credit-simulation-form.component';


@Component({
  standalone: true,
  selector: 'app-simulation-page',
  imports: [
    CommonModule,
    CreditSimulationResultComponent,
    CreditSimulationFormComponent
  ],
  templateUrl: './simulation-page.component.html'
})
export class SimulationPageComponent {

  private service = inject(CreditsService);
  private clientsService = inject(ClientsService);
  private vehiclesService = inject(VehiclesService);

  clients = this.clientsService.clients$;
  vehicles = this.vehiclesService.vehicles$;

  simulation = this.service.simulation$;

  ngOnInit() {
    this.clientsService.load();
    this.vehiclesService.load();
  }

  simulate(request: CreditSimulationRequest) {
    this.service.simulate(request);
  }

  createCredit(request: CreditSimulationRequest) {
    this.service.createCredit(request);
  }
}
