import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../core/config/currency.service';

@Component({
  selector: 'app-currency-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1 rounded-md border border-border bg-muted p-1">
      <button
        (click)="currencyService.setCurrency('PEN')"
        class="flex-1 rounded-sm px-3 py-1 text-xs font-medium transition-all"
        [ngClass]="currencyService.currency() === 'PEN' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'"
      >
        PEN
      </button>
      <button
        (click)="currencyService.setCurrency('USD')"
        class="flex-1 rounded-sm px-3 py-1 text-xs font-medium transition-all"
        [ngClass]="currencyService.currency() === 'USD' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'"
      >
        USD
      </button>
    </div>
  `
})
export class CurrencyToggleComponent {
  public currencyService = inject(CurrencyService);
}
