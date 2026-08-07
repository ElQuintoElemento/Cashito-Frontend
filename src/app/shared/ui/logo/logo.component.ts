import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-2 select-none" [ngClass]="containerClass">
      <!-- Icon -->
      <div 
        class="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-600 shadow-sm shrink-0 overflow-hidden"
        [ngStyle]="{'width': iconSize + 'px', 'height': iconSize + 'px'}"
      >
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2.5" 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          class="text-white relative z-10"
          [ngStyle]="{'width': (iconSize * 0.55) + 'px', 'height': (iconSize * 0.55) + 'px'}"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>

      <!-- Text -->
      <div *ngIf="variant !== 'icon'" class="flex flex-col justify-center">
        <span 
          class="font-bold tracking-tight text-foreground leading-none"
          [ngStyle]="{'font-size': (iconSize * 0.6) + 'px'}"
        >
          Cashito
        </span>
        <span *ngIf="variant === 'full' && showSubtitle" class="text-[0.65rem] font-medium text-muted-foreground uppercase tracking-widest leading-none mt-1">
          Fintech SaaS
        </span>
      </div>
    </div>
  `
})
export class LogoComponent {
  /**
   * 'icon': just the SVG box
   * 'compact': icon + 'Cashito' text
   * 'full': icon + 'Cashito' + 'Fintech SaaS' subtitle
   */
  @Input() variant: 'icon' | 'compact' | 'full' = 'compact';
  @Input() iconSize: number = 32;
  @Input() showSubtitle: boolean = true;
  @Input() containerClass: string = '';
}
