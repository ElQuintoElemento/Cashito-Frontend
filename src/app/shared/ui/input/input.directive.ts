import { Component, Input, HostBinding } from '@angular/core';
import { cn } from '../../utils/ui.utils';

@Component({
  selector: 'input[appInput]',
  standalone: true,
  template: '',
})
export class InputDirective {
  @Input() userClass: string = '';

  @HostBinding('class')
  get hostClasses(): string {
    return cn(
      'flex h-11 w-full rounded-md border border-input bg-background px-4 py-2 text-sm transition-all duration-200 ease-in-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 hover:border-primary/40 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
      this.userClass
    );
  }
}
