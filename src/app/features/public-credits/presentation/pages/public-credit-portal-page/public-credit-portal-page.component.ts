import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../../../../../shared/ui/card/card.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { MoneyPipe } from '../../../../../shared/pipes/money.pipe';
import { PublicCreditsService } from '../../../infrastructure/services/public-credits.service';

@Component({
  selector: 'app-public-credit-portal-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LucideAngularModule,
    CardComponent,
    CardContentComponent,
    CardHeaderComponent,
    CardTitleComponent,
    ButtonDirective,
    BadgeComponent,
    EmptyStateComponent,
    MoneyPipe,
  ],
  templateUrl: './public-credit-portal-page.component.html',
})
export class PublicCreditPortalPageComponent {
  private route = inject(ActivatedRoute);
  private service = inject(PublicCreditsService);

  readonly credit = this.service.credit$;
  readonly schedule = this.service.schedule$;
  readonly loading = this.service.loading$;
  readonly forbidden = this.service.forbidden$;
  readonly actionLoading = this.service.actionLoading$;
  readonly payingSet = this.service.payingSet$;
  readonly progress = this.service.progress$;
  invalidLink = false;

  readonly creditId = computed(() => Number(this.route.snapshot.paramMap.get('id')));
  readonly token = computed(() => this.route.snapshot.queryParamMap.get('token') ?? '');

  readonly totalPaid = computed(() =>
    this.schedule().filter(x => x.isPaid).reduce((a, c) => a + c.totalPayment, 0)
  );
  readonly totalPending = computed(() =>
    this.schedule().filter(x => !x.isPaid).reduce((a, c) => a + c.totalPayment, 0)
  );

  ngOnInit(): void {
    const id = this.creditId();
    const token = this.token();
    if (!id || !token) {
      this.invalidLink = true;
      return;
    }
    this.service.load(id, token);
  }

  approve(): void {
    this.service.approve(this.creditId(), this.token());
  }

  reject(): void {
    this.service.reject(this.creditId(), this.token());
  }

  payInstallment(number: number): void {
    this.service.payInstallment(this.creditId(), number, this.token());
  }

  isPaying(number: number): boolean {
    return this.payingSet().has(number);
  }

  getStatusVariant(status: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch ((status ?? '').toLowerCase()) {
      case 'approved':
      case 'active':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'completed':
        return 'outline';
      default:
        return 'secondary';
    }
  }
}

