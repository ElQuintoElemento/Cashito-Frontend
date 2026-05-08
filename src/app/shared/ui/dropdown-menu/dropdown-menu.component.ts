import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block text-left">
      <ng-content select="[trigger]"></ng-content>
      
      <div *ngIf="isOpen" 
           class="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none animate-in fade-in-80 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DropdownMenuComponent {
  @Input() isOpen = false;
  
  toggle() {
    this.isOpen = !this.isOpen;
  }

  close() {
    this.isOpen = false;
  }
}

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DropdownItemComponent {
  @Input() destructive = false;
  @Input() userClass: string = '';

  @HostBinding('class')
  get hostClasses(): string {
    const base = 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer';
    const destructiveCls = this.destructive ? 'text-destructive hover:bg-destructive/10 focus:text-destructive' : '';
    return `${base} ${destructiveCls} ${this.userClass}`;
  }
}

@Component({
  selector: 'app-dropdown-label',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class DropdownLabelComponent {
  @HostBinding('class')
  get hostClasses(): string {
    return 'px-2 py-1.5 text-sm font-semibold';
  }
}

@Component({
  selector: 'app-dropdown-separator',
  standalone: true,
  template: '',
})
export class DropdownSeparatorComponent {
  @HostBinding('class')
  get hostClasses(): string {
    return '-mx-1 my-1 h-px bg-muted block';
  }
}
