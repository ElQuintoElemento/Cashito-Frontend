import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_SETTINGS} from '../../../../core/config/app.settings';
import {Vehicle} from '../../domain/models/vehicles.model';

@Injectable({ providedIn: 'root' })
export class VehiclesApi {

  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/vehicles`;

  getAll() {
    return this.http.get<Vehicle[]>(this.base);
  }

  create(data: any) {
    return this.http.post(this.base, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
