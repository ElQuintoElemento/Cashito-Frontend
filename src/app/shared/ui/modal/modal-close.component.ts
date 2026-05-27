import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modal-close',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <button 
      (click)="close.emit()" 
      class="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-[60]"
      aria-label="Close modal"
    >
      <lucide-icon name="x" class="w-4 h-4"></lucide-icon>
    </button>
  `,
})
export class ModalCloseComponent {
  @Output() close = new EventEmitter<void>();
}
