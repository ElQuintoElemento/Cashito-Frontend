import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modal-close',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideAngularModule],
  template: `
    <button
      type="button"
      (click)="close.emit()"
      class="w-8 h-8 flex items-center justify-center rounded-full bg-background border border-border text-foreground/80 hover:text-foreground hover:bg-muted shadow-sm transition-all duration-200 hover:scale-105"
      aria-label="Close modal"
    >
      <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
    </button>
  `,
})
export class ModalCloseComponent {
  @Output() close = new EventEmitter<void>();
}
