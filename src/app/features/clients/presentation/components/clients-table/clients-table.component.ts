import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Client} from '../../../domain/models/client.model';
import {
  TableWrapperComponent, TableDirective, TableHeaderDirective,
  TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective
} from '../../../../../shared/ui/table/table.component';
import { DropdownMenuComponent, DropdownItemComponent } from '../../../../../shared/ui/dropdown-menu/dropdown-menu.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { AvatarComponent, AvatarFallbackComponent } from '../../../../../shared/ui/avatar/avatar.component';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { LucideAngularModule } from 'lucide-angular';

import { CurrencyService } from '../../../../../core/config/currency.service';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [
    CommonModule, TableWrapperComponent, TableDirective, TableHeaderDirective,
    TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective,
    DropdownMenuComponent, DropdownItemComponent, ButtonDirective,
    AvatarComponent, AvatarFallbackComponent, LucideAngularModule, EmptyStateComponent, TranslateModule
  ],
  templateUrl: './clients-table.component.html'
})
export class ClientsTableComponent {

  @Input() clients: Client[] = [];
  @Output() edit = new EventEmitter<Client>();
  @Output() delete = new EventEmitter<number>();

  public currencyService = inject(CurrencyService);

}
