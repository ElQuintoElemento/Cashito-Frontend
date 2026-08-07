import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_SETTINGS} from '../../../../core/config/app.settings';
import {Client} from '../../domain/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientsApi {

  private http = inject(HttpClient);
  private base = `${APP_SETTINGS.apiUrl}/clients`;

  getAll() {
    return this.http.get<Client[]>(this.base);
  }

  create(data: any) {
    return this.http.post<Client>(this.base, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.base}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
