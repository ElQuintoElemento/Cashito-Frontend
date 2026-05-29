import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import {
  CardComponent,
  CardContentComponent,
  CardHeaderComponent,
  CardTitleComponent,
} from '../../../../../shared/ui/card/card.component';
import {
  TableBodyDirective,
  TableCellDirective,
  TableDirective,
  TableHeadDirective,
  TableHeaderDirective,
  TableRowDirective,
  TableWrapperComponent,
} from '../../../../../shared/ui/table/table.component';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { DashboardService } from '../../../infrastructure/services/dashboard.service';
import { MoneyPipe } from '../../../../../shared/pipes/money.pipe';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LucideAngularModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    TableWrapperComponent,
    TableDirective,
    TableHeaderDirective,
    TableBodyDirective,
    TableRowDirective,
    TableHeadDirective,
    TableCellDirective,
    EmptyStateComponent,
    MoneyPipe,
    TranslateModule
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private dashboardService = inject(DashboardService);

  readonly kpis = this.dashboardService.kpis$;
  readonly recentClients = this.dashboardService.recentClients$;
  readonly recentVehicles = this.dashboardService.recentVehicles$;
  readonly portfolioSummary = this.dashboardService.portfolioSummary$;
  readonly loading = this.dashboardService.loading$;
  readonly hasAnyData = this.dashboardService.hasAnyData;

  readonly kpiCards = computed(() => {
    const kpis = this.kpis();
    return [
      {
        title: 'Total Clients',
        value: kpis?.totalClients ?? 0,
        currency: 'PEN',
        icon: 'users',
        gradient: 'from-primary/15 to-primary/5',
        border: 'border-primary/15',
      },
      {
        title: 'Total Vehicles',
        value: kpis?.totalVehicles ?? 0,
        currency: 'PEN',
        icon: 'car',
        gradient: 'from-blue-500/15 to-blue-500/5',
        border: 'border-blue-500/15',
      },
      {
        title: 'Active Credits',
        value: kpis?.activeCredits ?? 0,
        currency: 'PEN',
        icon: 'credit-card',
        gradient: 'from-violet-500/15 to-violet-500/5',
        border: 'border-violet-500/15',
      },
      {
        title: 'Total Credit Volume',
        value: kpis?.totalCreditVolume ?? 0,
        currency: kpis?.currency ?? 'PEN',
        icon: 'wallet',
        gradient: 'from-emerald-500/15 to-emerald-500/5',
        border: 'border-emerald-500/15',
        money: true,
      },
    ];
  });

  ngOnInit(): void {
    this.dashboardService.load();
  }
}
