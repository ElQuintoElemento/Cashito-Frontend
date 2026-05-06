import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CreditSimulationResponse} from '../../../domain/models/credit-simulation-response';

@Component({
  standalone: true,
  selector: 'app-credit-simulation-result',
  imports: [CommonModule],
  templateUrl: './credit-simulation-result.component.html'
})
export class CreditSimulationResultComponent {

  @Input() simulation: CreditSimulationResponse | null = null;
}
