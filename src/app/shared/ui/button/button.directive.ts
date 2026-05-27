import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/ui.utils';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
})
export class ButtonDirective {
  @Input() variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' = 'default';
  @Input() size: 'default' | 'sm' | 'lg' | 'icon' = 'default';
  @Input() userClass: string = '';

  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:border-primary disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
      {
        'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md': this.variant === 'default',
        'bg-destructive text-destructive-foreground hover:bg-destructive/90': this.variant === 'destructive',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground': this.variant === 'outline',
        'bg-secondary text-secondary-foreground hover:bg-secondary/80': this.variant === 'secondary',
        'hover:bg-accent hover:text-accent-foreground': this.variant === 'ghost',
        'text-primary underline-offset-4 hover:underline': this.variant === 'link',
        'h-11 px-4 py-2': this.size === 'default',
        'h-9 rounded-md px-3': this.size === 'sm',
        'h-12 rounded-md px-8': this.size === 'lg',
        'h-11 w-11': this.size === 'icon',
      },
      this.userClass
    );
  }
}
