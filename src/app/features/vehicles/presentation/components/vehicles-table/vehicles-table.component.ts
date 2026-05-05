import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor } from '@angular/common';
import {Vehicle} from '../../../domain/models/vehicles.model';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  imports: [NgFor],
  templateUrl: './vehicles-table.component.html'
})
export class VehiclesTableComponent {

  @Input() vehicles: Vehicle[] = [];
  @Output() edit = new EventEmitter<Vehicle>();
  @Output() delete = new EventEmitter<number>();

}
