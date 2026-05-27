import {Component, computed, inject, signal} from '@angular/core';
import {ClientsService} from '../../../infrastructure/services/clients.service';
import {Client} from '../../../domain/models/client.model';
import {ClientsTableComponent} from '../../components/clients-table/clients-table.component';
import {ClientModalComponent} from '../../components/client-modal/client-modal.component';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonDirective } from '../../../../../shared/ui/button/button.directive';
import { InputDirective } from '../../../../../shared/ui/input/input.directive';
import { CardComponent } from '../../../../../shared/ui/card/card.component';

@Component({
  standalone: true,
  selector: 'app-clients-page',
  imports: [ClientsTableComponent, ClientModalComponent, LucideAngularModule, ButtonDirective, InputDirective, CardComponent],
  templateUrl: './clients-page.component.html'
})
export class ClientsPageComponent {

  private service = inject(ClientsService);

  clients = this.service.clients$;

  search = signal('');

  filteredClients = computed(() => {
    const q = this.search().trim().toLowerCase();
    const list = this.clients();
    if (!q) return list;
    return list.filter(c =>
      c.dni.toLowerCase().includes(q) ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  });
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
