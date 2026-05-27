import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChild,
  HostListener,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, ConnectionPositionPair } from '@angular/cdk/overlay';
import { LucideAngularModule } from 'lucide-angular';
import { openOverlayPanel, closeOverlayPanel } from '../../utils/overlay-animation';

export interface FormSelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, OverlayModule, LucideAngularModule],
  template: `
    <div class="space-y-2" [class]="containerClass">
      @if (label) {
        <label class="text-sm font-medium leading-none">{{ label }}</label>
      }
      <div class="relative" cdkOverlayOrigin #trigger="cdkOverlayOrigin">
        <button
          type="button"
          #triggerBtn
          class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-200 ease-in-out hover:border-primary/40 focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
          [class.h-11]="size === 'lg'"
          [disabled]="disabled"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-haspopup]="'listbox'"
          (click)="toggle()"
          (keydown)="onTriggerKeydown($event)"
        >
          <span class="truncate text-left" [class.text-muted-foreground]="!selectedLabel()">{{ selectedLabel() || placeholder }}</span>
          <lucide-icon
            name="chevron-down"
            class="w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200"
            [class.rotate-180]="isOpen()"
          ></lucide-icon>
        </button>

        <ng-template
          cdkConnectedOverlay
          [cdkConnectedOverlayOrigin]="trigger"
          [cdkConnectedOverlayOpen]="panelRendered()"
          [cdkConnectedOverlayPositions]="positions"
          [cdkConnectedOverlayWidth]="triggerWidth() ?? 0"
          (overlayOutsideClick)="close()"
          [cdkConnectedOverlayHasBackdrop]="true"
          cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
        >
          <div
            #panel
            role="listbox"
            class="z-[200] max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg transition-all duration-200 ease-out outline-none flex flex-col gap-0.5"
            [class.opacity-100]="panelVisible()"
            [class.scale-100]="panelVisible()"
            [class.translate-y-0]="panelVisible()"
            [class.pointer-events-auto]="panelVisible()"
            [class.opacity-0]="!panelVisible()"
            [class.scale-95]="!panelVisible()"
            [class.-translate-y-1]="!panelVisible()"
            [class.pointer-events-none]="!panelVisible()"
          >
            @for (opt of options; track opt.value) {
              <button
                type="button"
                role="option"
                class="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                [class.bg-accent]="opt.value === value"
                [attr.aria-selected]="opt.value === value"
                (click)="select(opt)"
              >
                {{ opt.label }}
              </button>
            }
          </div>
        </ng-template>
      </div>
    </div>
  `,
})
export class FormSelectComponent {
  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() options: FormSelectOption[] = [];
  @Input() value = '';
  @Input() disabled = false;
  @Input() size: 'md' | 'lg' = 'md';
  @Input() containerClass = '';

  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('triggerBtn') triggerBtn?: ElementRef<HTMLButtonElement>;
  @ViewChild('panel') panel?: ElementRef<HTMLDivElement>;

  isOpen = signal(false);
  panelRendered = signal(false);
  panelVisible = signal(false);
  triggerWidth = signal<number | undefined>(undefined);

  positions = [
    new ConnectionPositionPair(
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' },
      0,
      4
    ),
    new ConnectionPositionPair(
      { originX: 'start', originY: 'top' },
      { overlayX: 'start', overlayY: 'bottom' },
      0,
      -4
    ),
  ];

  selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? '';
  }

  toggle(): void {
    if (this.disabled) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.disabled || this.isOpen()) return;
    this.syncTriggerWidth();
    this.isOpen.set(true);
    this.panelRendered.set(true);
    openOverlayPanel(() => this.panelVisible.set(true));
  }

  close(): void {
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.panelVisible.set(false);
    closeOverlayPanel(this.panel?.nativeElement, () => {
      this.panelRendered.set(false);
    });
  }

  select(opt: FormSelectOption): void {
    this.valueChange.emit(opt.value);
    this.close();
    this.triggerBtn?.nativeElement.focus();
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'Escape':
        this.close();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) this.open();
        break;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  private syncTriggerWidth(): void {
    const w = this.triggerBtn?.nativeElement.offsetWidth;
    if (w) this.triggerWidth.set(w);
  }
}
