import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Client } from '../../../models/client.model';
import { ClientService } from '../client.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    MatCardModule,
    MatPaginatorModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {

  private paginator!: MatPaginator;

  clients = signal<Client[]>([]);
  displayedColumns: string[] = ['nombres','apellidos','telefono','Local','actions'];
  datasource = new MatTableDataSource(this.clients());
  pageSize : number = 10;

  constructor(private clientService : ClientService){}


  @ViewChild(MatPaginator) set matPaginartor(mp: MatPaginator) {
      this.paginator = mp;
      this.setDataSourceAttributes();
  }

  ngAfterViewInit() {
    this.loadClients();
    this.datasource = new MatTableDataSource(this.clients());
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.datasource.paginator = this.paginator;
  }


  ngOnInit(): void {
    this.loadClients();
  }


  loadClients(query : string = '') {
    /* this.clientService.getClients(query).subscribe((data) => {
      this.clients.set(data); */
      this.clientService.getClients()
        .subscribe((data) => {

        this.clients.set(
          data.map((client: Client) => ({
            id: client.id,
            nombres: client.nombres,
            apellidos: client.apellidos,
            telefono: client.telefono,
            estado: client.estado,
            ruc: client.ruc,
            idLocal: client.idLocal,
            local: Number(client.idLocal) === 1 ? 'Alborada' : 'Other'
          }))
        );

        this.datasource.data = this.clients();
        this.datasource.paginator = this.paginator;
        /* this.clients.set(
          data.map((client: Client) => ({
            id: client.id,
            nombres: client.nombres,
            apellidos: client.apellidos,
            telefono: client.telefono,
            estado: client.estado,
            ruc: client.ruc,
            idLocal: client.idLocal,
            local: Number(client.idLocal) === 1 ? 'Alborada' : 'Other'
          }))
        ); */
    })
  }

  changePage(pageEvent: PageEvent) {
    const startIndex = pageEvent.pageIndex * pageEvent.pageSize;
    const endIndex = startIndex + pageEvent.pageSize;
    const paginatedData = this.clients().slice(startIndex, endIndex);
    this.datasource = new MatTableDataSource(paginatedData);
 }



  editClient(client: Client) {

  }

  deleteClient(id : number) {

  }

  viewClient(arg0: string) {

    }




}
