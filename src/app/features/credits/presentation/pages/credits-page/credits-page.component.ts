import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsService } from '../../../infrastructure/services/credits.service';
import { ClientsService } from '../../../../clients/infrastructure/services/clients.service';
import { VehiclesService } from '../../../../vehicles/infrastructure/services/vehicles.service';

import { CreditListComponent } from '../../components/credit-list/credit-list.component';
import { CreditDetailComponent } from '../../components/credit-detail/credit-detail.component';

@Component({
  standalone: true,
  selector: 'app-credits-page',
  imports: [
    CommonModule,
    CreditListComponent,
    CreditDetailComponent
  ],
  templateUrl: './credits-page.component.html'
})
export class CreditsPageComponent {

  private creditsService = inject(CreditsService);
  private clientsService = inject(ClientsService);
  private vehiclesService = inject(VehiclesService);

  credits = this.creditsService.credits$;
  selected = this.creditsService.selected$;
  schedule = this.creditsService.schedule$;

  clients = this.clientsService.clients$;
  vehicles = this.vehiclesService.vehicles$;

  ngOnInit() {
    this.creditsService.load();
    this.clientsService.load();
    this.vehiclesService.load();
  }

  selectCredit(id: number) {
    this.creditsService.getById(id);
    this.creditsService.loadSchedule(id);
  }

  closeDetail() {
    this.creditsService.clearSelected();
  }
}
