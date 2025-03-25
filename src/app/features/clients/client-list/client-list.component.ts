import { Component, OnInit, signal } from '@angular/core';
import { Client } from '../../../models/client.model';
import { ClientService } from '../client.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, 
    MatTableModule, 
    MatPaginatorModule, 
    MatInputModule, 
    MatButtonModule,
    MatCardModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {

  
  clients = signal<Client[]>([]);
  displayedColumns: string[] = ['nombres','apellidos','telefono','idLocal','actions'];

  
  constructor(private clientService : ClientService) {  }

  ngOnInit(): void {
    this.loadClients();
    // this.clientService.getClients().subscribe((data) => {
    //   this.clients = data;
    // })
  }
  loadClients(query : string = '') {
    /* this.clientService.getClients(query).subscribe((data) => {
      this.clients.set(data); */
      this.clientService.getClients().subscribe((data) => {
        this.clients.set(data);
    })
  }

  editClient(client: Client) {
    
  }

  deleteClient(id : number) {
      
  }  

  viewClient(arg0: string) {
   
    }

}
