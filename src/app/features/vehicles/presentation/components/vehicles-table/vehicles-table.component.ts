import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../../domain/models/vehicles.model';
import {
  TableWrapperComponent, TableDirective, TableHeaderDirective,
  TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective
} from '../../../../../shared/ui/table/table.component';
import { DropdownMenuComponent, DropdownItemComponent } from '../../../../../shared/ui/dropdown-menu/dropdown-menu.component';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { AvatarComponent, AvatarFallbackComponent } from '../../../../../shared/ui/avatar/avatar.component';
import { EmptyStateComponent } from '../../../../../shared/ui/empty-state/empty-state.component';
import { LucideAngularModule } from 'lucide-angular';
import { BadgeComponent } from '../../../../../shared/ui/badge/badge.component';
import { CurrencyService } from '../../../../../core/config/currency.service';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  imports: [
    CommonModule, TableWrapperComponent, TableDirective, TableHeaderDirective,
    TableBodyDirective, TableRowDirective, TableHeadDirective, TableCellDirective,
    DropdownMenuComponent, DropdownItemComponent, ButtonDirective,
    AvatarComponent, AvatarFallbackComponent, LucideAngularModule, EmptyStateComponent, BadgeComponent, TranslateModule
  ],
  templateUrl: './vehicles-table.component.html'
})
export class VehiclesTableComponent {

  @Input() vehicles: Vehicle[] = [];
  @Output() edit = new EventEmitter<Vehicle>();
  @Output() delete = new EventEmitter<number>();

  public currencyService = inject(CurrencyService);

}
