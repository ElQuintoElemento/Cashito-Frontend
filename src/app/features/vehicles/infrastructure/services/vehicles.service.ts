import {inject, Injectable, signal} from '@angular/core';
import {VehiclesApi} from '../api/vehicles.api';
import {Vehicle} from '../../domain/models/vehicles.model';

@Injectable({ providedIn: 'root' })
export class VehiclesService {

  private api = inject(VehiclesApi);

  private vehicles = signal<Vehicle[]>([]);

  vehicles$ = this.vehicles.asReadonly();

  load() {
    this.api.getAll().subscribe(res => {
      this.vehicles.set(res);
    });
  }

  create(data: any) {
    this.api.create(data).subscribe(() => this.load());
  }

  update(id: number, data: any) {
    this.api.update(id, data).subscribe(() => this.load());
  }

  delete(id: number) {
    this.api.delete(id).subscribe(() => this.load());
  }
}
