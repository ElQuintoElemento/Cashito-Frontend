import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCloseComponent } from './modal-close.component';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ModalCloseComponent],
  template: `
    @if (open) {
      <div
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100] p-4 sm:p-6 animate-in fade-in duration-300"
        role="dialog"
        aria-modal="true"
        (click)="onBackdropClick($event)"
      >
        <div
          class="bg-card text-card-foreground w-full rounded-xl border border-border/50 shadow-2xl flex flex-col relative animate-in zoom-in-[0.98] duration-300 ease-out"
          [class.max-w-md]="size === 'sm'"
          [class.max-w-7xl]="size === 'xl'"
          [class.max-h-[95vh]]="size === 'sm'"
          [class.max-h-[90vh]]="size === 'xl'"
          [class.h-full]="size === 'xl'"
          [class.overflow-hidden]="!allowBodyScroll"
          (click)="$event.stopPropagation()"
        >
          <div class="relative shrink-0 z-[70] flex justify-end p-2 min-h-[2.5rem]">
            <app-modal-close (close)="close.emit()" />
          </div>

          @if (title) {
            <div class="flex flex-col space-y-1.5 px-6 pt-0 pb-4 border-b shrink-0 -mt-8">
              <h2 class="text-xl font-semibold leading-none tracking-tight pr-10">{{ title }}</h2>
              @if (description) {
                <p class="text-sm text-muted-foreground">{{ description }}</p>
              }
            </div>
          }

          <div
            class="flex-1 min-h-0"
            [class.overflow-y-auto]="allowBodyScroll"
            [class.p-6]="contentPadding"
          >
            <ng-content />
          </div>

          @if (hasFooter) {
            <div class="flex items-center justify-end p-6 border-t gap-3 bg-muted/50 shrink-0">
              <ng-content select="[modalFooter]" />
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class ModalShellComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() description = '';
  @Input() size: 'sm' | 'xl' = 'sm';
  @Input() allowBodyScroll = true;
  @Input() contentPadding = true;
  @Input() hasFooter = false;

  @Output() close = new EventEmitter<void>();

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close.emit();
    }
  }
}
