import { Component, inject, signal } from '@angular/core';

import { VehiclesTableComponent } from '../../components/vehicles-table/vehicles-table.component';
import { VehicleModalComponent } from '../../components/vehicle-modal/vehicle-modal.component';
import {VehiclesService} from '../../../infrastructure/services/vehicles.service';
import {Vehicle} from '../../../domain/models/vehicles.model';

@Component({
  standalone: true,
  selector: 'app-vehicles-page',
  imports: [VehiclesTableComponent, VehicleModalComponent],
  templateUrl: './vehicles-page.component.html'
})
export class VehiclesPageComponent {

  private service = inject(VehiclesService);

  vehicles = this.service.vehicles$;

  search = signal('');
  modalOpen = signal(false);
  editing = signal<Vehicle | null>(null);

  ngOnInit() {
    this.service.load();
  }

  openCreate() {
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  openEdit(vehicle: Vehicle) {
    this.editing.set(vehicle);
    this.modalOpen.set(true);
  }

  save(data: any) {
    const editing = this.editing();

    if (editing) {
      this.service.update(editing.id, data);
    } else {
      this.service.create(data);
    }

    this.modalOpen.set(false);
  }

  delete(id: number) {
    this.service.delete(id);
  }
}
