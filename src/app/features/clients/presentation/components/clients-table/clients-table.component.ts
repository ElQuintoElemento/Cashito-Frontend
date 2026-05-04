import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgFor} from '@angular/common';
import {Client} from '../../../domain/models/client.model';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [NgFor],
  templateUrl: './clients-table.component.html'
})
export class ClientsTableComponent {

  @Input() clients: Client[] = [];
  @Output() edit = new EventEmitter<Client>();
  @Output() delete = new EventEmitter<number>();

}
