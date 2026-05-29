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
import { CreditStatus, normalizeCreditStatus } from '../../../../credits/domain/models/credit-status';
import { PublicCreditsService } from '../../../infrastructure/services/public-credits.service';
import {TranslateModule} from '@ngx-translate/core';
import {LanguageSwitcherComponent} from '../../../../../layout/language-switcher/language-switcher.component';
import {ThemeToggleComponent} from '../../../../../layout/theme-toggle/theme-toggle.component';

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
    TranslateModule,
    LanguageSwitcherComponent,
    ThemeToggleComponent
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
  readonly monthlyPayment = computed(() =>
    this.credit()?.cuota ?? this.credit()?.monthlyPayment ?? this.schedule()[0]?.totalPayment ?? 0
  );
  readonly status = computed(() => normalizeCreditStatus(this.credit()?.status));
  readonly canReview = computed(() => this.status() === 'Simulated');

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
    if (!this.canReview()) return;
    this.service.approve(this.creditId(), this.token());
  }

  reject(): void {
    if (!this.canReview()) return;
    this.service.reject(this.creditId(), this.token());
  }

  payInstallment(number: number): void {
    this.service.payInstallment(this.creditId(), number, this.token());
  }

  isPaying(number: number): boolean {
    return this.payingSet().has(number);
  }

  statusLabel(status: CreditStatus | string | number | null | undefined): string {
    return normalizeCreditStatus(status) || 'Pending';
  }

  getStatusVariant(status: CreditStatus | string | number | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' {
    switch (normalizeCreditStatus(status).toLowerCase()) {
      case 'approved':   return 'default';
      case 'active':     return 'success';
      case 'rejected':   return 'destructive';
      case 'completed':  return 'outline';
      case 'simulated':  return 'secondary';
      default:           return 'secondary';
    }
  }
}

