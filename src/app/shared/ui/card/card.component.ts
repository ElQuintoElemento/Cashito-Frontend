import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
})
export class CardComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col ${this.userClass}`;
  }
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CardHeaderComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `flex flex-col space-y-1.5 p-6 ${this.userClass}`;
  }
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CardTitleComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `text-2xl font-semibold leading-none tracking-tight ${this.userClass}`;
  }
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CardContentComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `p-6 pt-0 flex-1 ${this.userClass}`;
  }
}

@Component({
  selector: 'app-card-footer',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class CardFooterComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return `flex items-center p-6 pt-0 ${this.userClass}`;
  }
}
