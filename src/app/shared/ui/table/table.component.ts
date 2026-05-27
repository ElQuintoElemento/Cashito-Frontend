import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../utils/ui.utils';

@Component({
  selector: 'app-table-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="relative w-full overflow-auto"><ng-content></ng-content></div>`,
})
export class TableWrapperComponent {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return this.userClass;
  }
}

@Component({
  selector: 'table[appTable]',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TableDirective {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return cn('w-full caption-bottom text-sm', this.userClass);
  }
}

@Component({
  selector: 'thead[appTableHeader]',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TableHeaderDirective {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return cn('[&_tr]:border-b', this.userClass);
  }
}

@Component({
  selector: 'tbody[appTableBody]',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TableBodyDirective {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return cn('[&_tr:last-child]:border-0', this.userClass);
  }
}

@Component({
  selector: 'tr[appTableRow]',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TableRowDirective {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', this.userClass);
  }
}

@Component({
  selector: 'th[appTableHead]',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TableHeadDirective {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0', this.userClass);
  }
}

@Component({
  selector: 'td[appTableCell]',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class TableCellDirective {
  @Input() userClass: string = '';
  @HostBinding('class')
  get hostClasses(): string {
    return cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', this.userClass);
  }
}
