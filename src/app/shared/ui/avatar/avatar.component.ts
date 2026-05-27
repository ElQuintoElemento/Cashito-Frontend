import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
})
export class AvatarComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${this.userClass}`;
  }
}

@Component({
  selector: 'app-avatar-fallback',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class AvatarFallbackComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground ${this.userClass}`;
  }
}
