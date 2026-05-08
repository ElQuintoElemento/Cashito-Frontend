import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditSimulationResponse } from '../../../domain/models/credit-simulation-response';
import { CardComponent } from '../../../../../shared/ui/card/card.component';
import { TableWrapperComponent, TableDirective, TableHeaderDirective, TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective } from '../../../../../shared/ui/table/table.component';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';

@Component({
  standalone: true,
  selector: 'app-credit-simulation-result',
  imports: [
    CommonModule, CardComponent, TableWrapperComponent, TableDirective, 
    TableHeaderDirective, TableBodyDirective, TableRowDirective, 
    TableHeadDirective, TableCellDirective, BadgeComponent, 
    LucideAngularModule, ButtonDirective, EmptyStateComponent
  ],
  templateUrl: './credit-simulation-result.component.html'
})
export class CreditSimulationResultComponent {

  private _simulation: CreditSimulationResponse | null = null;
  
  @Input() 
  set simulation(val: CreditSimulationResponse | null) {
    this._simulation = val;
    this.simSignal.set(val);
  }
  get simulation(): CreditSimulationResponse | null {
    return this._simulation;
  }

  simSignal = signal<CreditSimulationResponse | null>(null);
  viewMode = signal<'table' | 'calendar'>('table');

  totalInterest = computed(() => {
    const sim = this.simSignal();
    if (!sim) return 0;
    return sim.schedule.reduce((acc, curr) => acc + curr.interest, 0);
  });

  financedCapital = computed(() => {
    const sim = this.simSignal();
    if (!sim || sim.schedule.length === 0) return 0;
    return sim.schedule[0].remainingBalance + sim.schedule[0].amortization;
  });

  totalAmount = computed(() => {
    const sim = this.simSignal();
    if (!sim) return 0;
    return sim.schedule.reduce((acc, curr) => acc + curr.totalPayment, 0);
  });

  setViewMode(mode: 'table' | 'calendar') {
    this.viewMode.set(mode);
  }
}
