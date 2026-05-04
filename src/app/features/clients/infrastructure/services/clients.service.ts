import {inject, Injectable, signal} from '@angular/core';
import {ClientsApi} from '../api/clients.api';
import {Client} from '../../domain/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {

  private api = inject(ClientsApi);

  private clients = signal<Client[]>([]);

  clients$ = this.clients.asReadonly();

  load() {
    this.api.getAll().subscribe(res => {
      this.clients.set(res);
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
