import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditsService } from '../../../infrastructure/services/credits.service';
import { ClientsService } from '../../../../clients/infrastructure/services/clients.service';
import { VehiclesService } from '../../../../vehicles/infrastructure/services/vehicles.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Credit } from '../../../domain/models/credit.model';
import { CreditStatus } from '../../../domain/models/credit-status';

import { CreditListComponent } from '../../components/credit-list/credit-list.component';
import { CreditDetailComponent } from '../../components/credit-detail/credit-detail.component';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell.component';

@Component({
  standalone: true,
  selector: 'app-credits-page',
  imports: [
    CommonModule,
    CreditListComponent,
    CreditDetailComponent,
    ModalShellComponent,
  ],
  templateUrl: './credits-page.component.html'
})
export class CreditsPageComponent {

  private creditsService = inject(CreditsService);
  private clientsService = inject(ClientsService);
  private vehiclesService = inject(VehiclesService);
  private notify = inject(NotificationService);

  credits = this.creditsService.credits$;
  selected = this.creditsService.selected$;

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

  updateStatus(event: { id: number; status: Extract<CreditStatus, 'Approved' | 'Rejected'> }) {
    if (event.status === 'Approved') {
      this.creditsService.approve(event.id);
      return;
    }

    this.creditsService.reject(event.id);
  }

  async copyPaymentLink(credit: Credit) {
    const link = `${window.location.origin}/public/credits/${credit.id}?token=${encodeURIComponent(credit.publicToken)}`;
    try {
      await navigator.clipboard.writeText(link);
      this.notify.success('Payment link copied');
    } catch {
      this.notify.error('Could not copy payment link');
    }
  }
}
