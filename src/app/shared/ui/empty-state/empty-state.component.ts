import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-500">
      <div *ngIf="icon" class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <ng-content select="[icon]"></ng-content>
      </div>
      <h3 class="mt-4 text-lg font-semibold">{{ title }}</h3>
      <p class="mb-4 mt-2 text-sm text-muted-foreground max-w-sm">
        {{ description }}
      </p>
      <ng-content select="[actions]"></ng-content>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() title: string = 'No results found';
  @Input() description: string = 'Try adjusting your filters or search terms.';
  @Input() icon: boolean = true;
  @Input() userClass: string = '';

  @HostBinding('class')
  get hostClasses(): string {
    return `block ${this.userClass}`;
  }
}
