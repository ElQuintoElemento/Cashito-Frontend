import {Component, inject, signal} from '@angular/core';
import {ClientsService} from '../../../infrastructure/services/clients.service';
import {Client} from '../../../domain/models/client.model';
import {ClientsTableComponent} from '../../components/clients-table/clients-table.component';
import {ClientModalComponent} from '../../components/client-modal/client-modal.component';


@Component({
  standalone: true,
  selector: 'app-clients-page',
  imports: [ClientsTableComponent, ClientModalComponent],
  templateUrl: './clients-page.component.html'
})
export class ClientsPageComponent {

  private service = inject(ClientsService);

  clients = this.service.clients$;

  search = signal('');
  modalOpen = signal(false);
  editing = signal<Client | null>(null);

  ngOnInit() {
    this.service.load();
  }

  openCreate() {
    this.editing.set(null);
    this.modalOpen.set(true);
  }

  openEdit(client: Client) {
    this.editing.set(client);
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
